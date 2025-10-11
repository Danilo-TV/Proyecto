from django.db import models
from django.contrib.auth import get_user_model


class Comentario(models.Model):
	"""
	Modelo para comentarios en publicaciones del blog.
	"""
	post_fk = models.ForeignKey('PostBlog', on_delete=models.CASCADE, null=False)
	usuario_fk = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, null=False)
	cuerpo_comentario = models.TextField()
	fecha_comentario = models.DateField()
	aprobado = models.BooleanField(default=False)

	def __str__(self):
		return f"{self.cuerpo_comentario[:50]}..."
from django.db import models
from django.contrib.auth import get_user_model

class PostBlog(models.Model):
	"""
	Modelo para publicaciones del blog.
	"""
	titulo = models.CharField(max_length=255, null=False)
	slug = models.SlugField(max_length=255)
	contenido = models.TextField()
	fecha_publicacion = models.DateField()
	autor_fk = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, null=False)
	imagen_principal = models.URLField(max_length=500)

	def __str__(self):
		return self.titulo

    
