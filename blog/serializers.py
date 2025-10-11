from rest_framework import serializers
from .models import PostBlog, Comentario

class PostBlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostBlog
        fields = '__all__'

class ComentarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentario
        fields = '__all__'
