from django.db import models
from e_commerce.models import Usuario 
from django.utils import timezone

class BlogPost(models.Model):
    # La clave foránea apunta al administrador/autor que publica el post
    autor = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True) 
    titulo = models.CharField(max_length=255)
    contenido = models.TextField()
    fecha_publicacion = models.DateTimeField(default=timezone.now)
    categoria = models.CharField(max_length=100)
    
    def __str__(self):
        return self.titulo
    
