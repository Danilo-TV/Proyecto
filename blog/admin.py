from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import PostBlog # Importa el modelo PostBlog de tu models.py

# 1. Registrar el modelo PostBlog
admin.site.register(PostBlog)

# Opcional: Personalizar la vista de administración
class PostBlogAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'fecha_publicacion', 'autor_fk')