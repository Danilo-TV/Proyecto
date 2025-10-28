from rest_framework import serializers
# Solo necesitamos importar los modelos locales de Portafolio
from .models import ItemPortafolio, ContactoPortafolio 

# =========================================================
# 1. Serializer para ItemPortafolio (Presentación y Clasificación)
# =========================================================

class ItemPortafolioSerializer(serializers.ModelSerializer):
    """
    Serializa el ItemPortafolio, incluyendo los vínculos opcionales a Cursos y Servicios.
    """
    # Campo de solo lectura para obtener el valor legible de la clasificación (ej. 'Trabajo de Cliente').
    # Se asume que get_tipo_item_display() está implementado en ItemPortafolio.
    tipo_item_display = serializers.CharField(source='get_tipo_item_display', read_only=True)
    
    # Exponer el nombre del Curso vinculado (FK opcional) para el frontend (UX)
    # Si curso_fk es nulo, este campo será nulo, lo cual es correcto.
    curso_nombre = serializers.CharField(source='curso_fk.nombre', read_only=True)
    
    # Exponer el nombre del Servicio vinculado (FK opcional) para el frontend (UX)
    servicio_nombre = serializers.CharField(source='servicio_fk.nombre_servicio', read_only=True)

    class Meta:
        model = ItemPortafolio
        fields = [
            'id', 
            'titulo', 
            'descripcion', 
            'fecha_trabajo', 
            'imagen_antes', 
            'imagen_despues',
            
            # Nuevos campos del modelo (Clasificación y FKs)
            'tipo_item',
            'curso_fk',    # ID del Curso (opcional)
            'servicio_fk', # ID del Servicio (opcional)
            
            # Campos de salida de Lectura (Mejora de UX)
            'tipo_item_display',
            'curso_nombre',
            'servicio_nombre'
        ]

# =========================================================
# 2. Serializer para ContactoPortafolio (Formulario de Contacto)
# =========================================================

class ContactoPortafolioSerializer(serializers.ModelSerializer):
    """
    Serializa la información de contacto recibida.
    """
    class Meta:
        model = ContactoPortafolio
        fields = '__all__'
        # Se asume que fecha_contacto se asigna automáticamente y no se recibe en la entrada.
        read_only_fields = ['fecha_contacto']