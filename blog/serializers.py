from rest_framework import serializers
from .models import PostBlog, Comentario

class PostBlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostBlog
        fields = '__all__'

class ComentarioSerializer(serializers.ModelSerializer):
    # Opcionalmente, mostrar el nombre de usuario legible en lugar del ID
    # usuario_fk_username = serializers.CharField(source='usuario_fk.username', read_only=True) 

    class Meta:
        model = Comentario
        # Incluimos los campos esenciales para la lectura y los que el cliente puede escribir (cuerpo)
        fields = [
            'id', 
            'post_fk', 
            'cuerpo_comentario', 
            'fecha_comentario',
            'aprobado',
            'usuario_fk', 
        ]
        
        # El campo 'usuario_fk' y 'aprobado' deben ser de SOLO LECTURA
        # El usuario no puede definir su ID ni aprobar su propio comentario.
        read_only_fields = ['usuario_fk', 'aprobado']
