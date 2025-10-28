from rest_framework import serializers
from .models import Curso, Cita, VentaCurso, Servicio # Importar el nuevo modelo Servicio
from django.contrib.auth.models import User

## =========================================================
# CATÁLOGOS BASE
# =========================================================

# 1. Serializer para el Modelo Curso (Lectura pública)
class CursoSerializer(serializers.ModelSerializer):
    """
    Serializa la información de los cursos.
    """
    class Meta:
        model = Curso
        fields = '__all__' # Incluye todos los campos del modelo Curso [3]

# 2. NUEVO Serializer para el Modelo Servicio (Catálogo)
class ServicioSerializer(serializers.ModelSerializer):
    """
    Serializa el catálogo de servicios agendables.
    """
    class Meta:
        model = Servicio
        fields = '__all__' 

# =========================================================
# TRANSACCIONALES (Requieren usuario_fk)
# =========================================================

# 3. Serializer para el Modelo Cita (Refactorizado)
class CitaSerializer(serializers.ModelSerializer):
    """
    Serializa la información de las citas agendadas.
    *** REFRACTORIZADO ***: Ahora usa servicio_fk.
    """
    # Exponer el nombre del servicio (lectura anidada) para el front-end (mejor UX).
    # Cumple con la nomenclatura snake_case para atributos [4, 5].
    servicio_nombre = serializers.CharField(source='servicio_fk.nombre_servicio', read_only=True) 

    class Meta:
        model = Cita
        fields = [
            'usuario_fk', 
            'fecha_agendamiento', 
            'hora_agendamiento', 
            'servicio_fk', # Campo de entrada (espera el ID del Servicio)
            'servicio_nombre', # Campo de salida (Nombre del Servicio)
            'estado_cita'
        ]
        # Seguridad: usuario_fk sigue siendo de solo lectura [6]. 
        # Esto es crucial ya que CitaViewSet asigna el usuario automáticamente
        # en perform_create para prevenir el Control de Acceso Roto [7, 8].
        read_only_fields = ['usuario_fk']
        
# 4. Serializer para el Modelo VentaCurso (Transaccional)
class VentaCursoSerializer(serializers.ModelSerializer):
    """
    Serializa las ventas de cursos.
    """
    class Meta:
        model = VentaCurso
        fields = ['curso_fk', 'usuario_fk', 'monto_pagado', 'fecha_compra'] # [9]