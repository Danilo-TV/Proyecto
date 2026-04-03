from rest_framework import viewsets, permissions
from .models import Curso, Cita, VentaCurso, Servicio # Importar el nuevo modelo Servicio
from .serializers import CursoSerializer, CitaSerializer, VentaCursoSerializer, ServicioSerializer # Importar el nuevo Serializer
from .permissions import IsAdminOrReadOnly # Se mantiene la importación para gestión de contenido

# 1. ViewSet para Cursos (Lectura pública, Escritura restringida)

class CursoViewSet(viewsets.ModelViewSet):
    """
    GESTIÓN DE CURSOS: El contenido de los cursos es visible para todos,
    pero solo el administrador puede crearlos/editarlos.
    """
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer
    # Permiso: Según spec de seguridad, todas las vistas de e_commerce deben estar protegidas con IsAuthenticated.
    permission_classes = [permissions.IsAuthenticated]

# 2. NUEVO ViewSet para Servicios (Catálogo)

class ServicioViewSet(viewsets.ModelViewSet):
    """
    GESTIÓN DE SERVICIOS: Catálogo de servicios agendables. 
    Lectura para anónimos; Escritura solo para autenticados (Admin).
    """
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer
    # Según especificaciones, el catálogo también requiere IsAuthenticated.
    permission_classes = [permissions.IsAuthenticated]

# 3. ViewSet para Citas (Transaccional - Seguridad Crítica)

class CitaViewSet(viewsets.ModelViewSet):
    """
    GESTIÓN DE CITAS: Solo usuarios autenticados pueden agendar citas (POST).
    *** REFRACTORIZADO ***: Ahora usa el nuevo CitaSerializer con servicio_fk.
    """
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer
    # Permiso: Requiere autenticación para cualquier acción [4].
    permission_classes = [permissions.IsAuthenticated] 
    
    # CRÍTICO: Mantenemos perform_create para prevenir Broken Access Control [5, 6].
    def perform_create(self, serializer):
        # Asigna el usuario autenticado (self.request.user) a la clave foránea usuario_fk.
        # Esto ignora cualquier valor de usuario_fk que el cliente intente enviar [5].
        serializer.save(usuario_fk=self.request.user)

# 4. ViewSet para VentaCurso (Transaccional - Seguridad Crítica)

class VentaCursoViewSet(viewsets.ModelViewSet):
    """
    GESTIÓN DE VENTAS: Solo usuarios autenticados pueden registrar una venta (POST).
    """
    queryset = VentaCurso.objects.all()
    serializer_class = VentaCursoSerializer
    # Permiso: Requiere autenticación para cualquier acción [7].
    permission_classes = [permissions.IsAuthenticated]

    # CRÍTICO: Mantenemos perform_create para prevenir Broken Access Control [6, 7].
    def perform_create(self, serializer):
        # Asigna el usuario autenticado (self.request.user) a la clave foránea usuario_fk.
        serializer.save(usuario_fk=self.request.user)


from rest_framework import serializers
from .models import Curso, Cita, VentaCurso, Servicio # Importar Servicio
from django.contrib.auth.models import User

# 1. Serializer para el Modelo Curso (Lectura pública)
class CursoSerializer(serializers.ModelSerializer):
    """
    Serializa la información de los cursos.
    """
    class Meta:
        model = Curso
        fields = '__all__' 

# 2. NUEVO Serializer para el Modelo Servicio (Catálogo)
class ServicioSerializer(serializers.ModelSerializer):
    """
    Serializa el catálogo de servicios.
    """
    class Meta:
        model = Servicio
        fields = '__all__' 

# 3. Serializer para el Modelo Cita (Refactorizado)
class CitaSerializer(serializers.ModelSerializer):
    """
    Serializa la información de las citas agendadas.
    *** REFRACTORIZADO ***: servicio_solicitado reemplazado por servicio_fk.
    """
    # Cumpliendo con snake_case, expone el nombre del servicio al front-end.
    servicio_nombre = serializers.CharField(source='servicio_fk.nombre_servicio', read_only=True) 

    class Meta:
        model = Cita
        fields = [
            'usuario_fk', 
            'fecha_agendamiento', 
            'hora_agendamiento', 
            'servicio_fk', # Campo de entrada (ID del Servicio)
            'servicio_nombre', # Campo de salida (Nombre del Servicio)
            'estado_cita'
        ]
        # Seguridad: usuario_fk sigue siendo de solo lectura
        read_only_fields = ['usuario_fk']
        
# 4. Serializer para el Modelo VentaCurso (Transaccional)
class VentaCursoSerializer(serializers.ModelSerializer):
    """
    Serializa las ventas de cursos.
    """
    class Meta:
        model = VentaCurso
        fields = ['curso_fk', 'usuario_fk', 'monto_pagado', 'fecha_compra']

import requests
import base64
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404


def get_paypal_access_token():
    client_id = getattr(settings, 'PAYPAL_CLIENT_ID', '')
    secret = getattr(settings, 'PAYPAL_SECRET', '')
    
    auth_string = f"{client_id}:{secret}"
    auth_bytes = auth_string.encode("ascii")
    auth_base64 = base64.b64encode(auth_bytes).decode("ascii")

    headers = {
        "Authorization": f"Basic {auth_base64}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}
    
    response = requests.post(
        "https://api-m.sandbox.paypal.com/v1/oauth2/token",
        headers=headers,
        data=data
    )
    if response.status_code == 200:
        return response.json().get("access_token")
    return None


class IniciarPagoPayPalView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    from drf_yasg.utils import swagger_auto_schema
    from drf_yasg import openapi

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['cita_id'],
            properties={
                'cita_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID de la cita a pagar')
            }
        )
    )
    def post(self, request):
        cita_id = request.data.get('cita_id')
        cita = get_object_or_404(Cita, id=cita_id)
        
        access_token = get_paypal_access_token()
        if not access_token:
            return Response({"detail": "Error obteniendo token de PayPal"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        precio = str(cita.servicio_fk.precio_estimado)
        
        payload = {
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "amount": {
                        "currency_code": "USD",
                        "value": precio
                    }
                }
            ]
        }
        
        # Petición a PayPal para crear la orden
        paypal_response = requests.post(
            'https://api-m.sandbox.paypal.com/v2/checkout/orders',
            headers=headers,
            json=payload
        )
        
        if paypal_response.status_code == 201:
            data = paypal_response.json()
            approval_url = None
            for link in data.get('links', []):
                if link.get('rel') == 'approve':
                    approval_url = link.get('href')
                    break
            
            if approval_url:
                return Response({"approval_url": approval_url}, status=status.HTTP_200_OK)
        
        return Response({"detail": "Error al contactar a PayPal"}, status=status.HTTP_400_BAD_REQUEST)


class ConfirmarPagoPayPalView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    from drf_yasg.utils import swagger_auto_schema
    from drf_yasg import openapi

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['cita_id', 'token'],
            properties={
                'cita_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID de la cita pagada'),
                'token': openapi.Schema(type=openapi.TYPE_STRING, description='Token de aprobación de PayPal')
            }
        )
    )
    def post(self, request):
        cita_id = request.data.get('cita_id')
        token = request.data.get('token')
        cita = get_object_or_404(Cita, id=cita_id)
        
        access_token = get_paypal_access_token()
        if not access_token:
            return Response({"detail": "Error obteniendo token de PayPal"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        # Validación de pago en PayPal
        paypal_response = requests.post(
            f'https://api-m.sandbox.paypal.com/v2/checkout/orders/{token}/capture',
            headers=headers,
            json={}
        )
        
        if paypal_response.status_code == 201:
            data = paypal_response.json()
            if data.get("status") == "COMPLETED":
                cita.estado_cita = 'Pagada'
                cita.save()
                return Response({"detail": "Pago confirmado y Cita actualizada"}, status=status.HTTP_200_OK)
                
        return Response({"detail": "Pago no pudo ser confirmado"}, status=status.HTTP_400_BAD_REQUEST)