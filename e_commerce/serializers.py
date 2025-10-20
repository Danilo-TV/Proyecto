from rest_framework import serializers
from .models import Curso, Cita, VentaCurso

# 1. Serializer para el Modelo Curso (Lectura pública)
class CursoSerializer(serializers.ModelSerializer):
    """
    Serializa la información de los cursos.
    """
    class Meta:
        model = Curso
        fields = '__all__' # Incluye todos los campos del modelo Curso

# 2. Serializer para el Modelo Cita (Transaccional)
class CitaSerializer(serializers.ModelSerializer):
    """
    Serializa la información de las citas agendadas.
    Requiere el usuario_fk.
    """
    class Meta:
        model = Cita
        # Se listan explícitamente los campos para excluir campos internos si fuera necesario,
        # pero para el CRUD de la API se incluyen todos los campos relevantes:
        fields = ['usuario_fk', 'fecha_agendamiento', 'hora_agendamiento', 'servicio_solicitado', 'estado_cita']
        # Nota de Seguridad: Django/DRF gestionará que el usuario autenticado sea el que se asigne al usuario_fk en la vista.

# 3. Serializer para el Modelo VentaCurso (Transaccional)
class VentaCursoSerializer(serializers.ModelSerializer):
    """
    Serializa las ventas de cursos.
    """
    class Meta:
        model = VentaCurso
        fields = ['curso_fk', 'usuario_fk', 'monto_pagado', 'fecha_compra']