from rest_framework import serializers
from .models import ItemPortafolio, ContactoPortafolio

# Se utiliza la clase base ModelSerializer, práctica recomendada de DRF [7-12]

class ItemPortafolioSerializer(serializers.ModelSerializer):
    """
    Serializer para la presentación de trabajos del portafolio.
    """
    class Meta:
        model = ItemPortafolio
        fields = '__all__' # Correcto para gestión por parte del administrador

class ContactoPortafolioSerializer(serializers.ModelSerializer):
    """
    Serializer para la gestión de mensajes de contacto anónimos recibidos.
    """
    class Meta:
        model = ContactoPortafolio
        # Listamos explícitamente los campos, práctica que adhiere a la serialización limpia [7-10]
        fields = [
            'id', 
            'nombre', 
            'email', 
            'telefono', 
            'mensaje', 
            'fecha_contacto'
        ]
        
        # El ID y la fecha de contacto deben ser SOLO LECTURA, ya que son establecidos por el servidor.
        read_only_fields = ['id', 'fecha_contacto']