from rest_framework import serializers
from .models import PostBlog, Comentario
from django.contrib.auth.models import User # Para serializar datos de FK

# Serializador para el modelo PostBlog
class PostBlogSerializer(serializers.ModelSerializer):
    # Opcional: Campo de solo lectura para mostrar el nombre de usuario del autor
    autor_username = serializers.CharField(source='autor_fk.username', read_only=True)

    class Meta:
        model = PostBlog
        # Se utiliza '__all__' para incluir todos los campos, siguiendo la práctica de DRF [6].
        fields = '__all__' 
        # Aseguramos que el 'autor_fk' sea de solo lectura en la salida, 
        # y no se pida en la entrada, ya que se asigna automáticamente en el ViewSet.
        read_only_fields = ('autor_fk',)

class ComentarioSerializer(serializers.ModelSerializer):
    usuario_fk_username = serializers.CharField(source='usuario_fk.username', read_only=True) 

    class Meta:
        model = Comentario
        fields = [
            'id', 
            'post_fk', 
            'cuerpo_comentario', 
            'fecha_comentario',
            'aprobado',
            'usuario_fk',
            # ¡NUEVO CAMPO!
            'usuario_fk_username', 
        ]
        
        read_only_fields = ['usuario_fk', 'aprobado']
