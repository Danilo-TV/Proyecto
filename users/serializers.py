from rest_framework import serializers
from django.contrib.auth.models import User # Importamos el modelo de usuario por defecto

class UserSerializer(serializers.ModelSerializer):
    """Serializer para el modelo de usuario por defecto de Django."""
    class Meta:
        model = User
        # Se listan los campos necesarios para registro/login y visualización.
        fields = ['id', 'username', 'email', 'password']
        # El password debe ser de solo escritura para evitar exponer el hash.
        extra_kwargs = {'password': {'write_only': True}}