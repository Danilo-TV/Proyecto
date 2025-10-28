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
    # Permiso: Lectura para anónimos; Escritura solo para autenticados.
    # Esto asegura que cualquiera puede ver la oferta, pero solo el Admin puede cambiarla [1, 2].
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] 

# 2. NUEVO ViewSet para Servicios (Catálogo)

class ServicioViewSet(viewsets.ModelViewSet):
    """
    GESTIÓN DE SERVICIOS: Catálogo de servicios agendables. 
    Lectura para anónimos; Escritura solo para autenticados (Admin).
    """
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer
    # Utilizamos IsAuthenticatedOrReadOnly para el catálogo, 
    # permitiendo la lectura pública de precios y descripciones [1-3].
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] 

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