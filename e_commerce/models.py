from django.db import models
from django.contrib.auth import get_user_model

class VentaCurso(models.Model):
	"""
	Modelo para registrar la venta de cursos a usuarios registrados.
	"""
	curso_fk = models.ForeignKey('Curso', on_delete=models.CASCADE)
	usuario_fk = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
	monto_pagado = models.DecimalField(max_digits=10, decimal_places=2, null=False)
	fecha_compra = models.DateField()

	def __str__(self):
		return f"Venta de {self.curso_fk.nombre} a {self.usuario_fk.username} por {self.monto_pagado}"

class Curso(models.Model):
	"""
	Modelo para cursos especializados ofrecidos en la plataforma.
	"""
	nombre = models.CharField(max_length=255, null=False)
	descripcion_corta = models.TextField()
	precio = models.DecimalField(max_digits=10, decimal_places=2, null=False)
	url_video = models.URLField(max_length=500)
	fecha_creacion = models.DateField()

	def __str__(self):
		return self.nombre

from django.db import models
from django.contrib.auth import get_user_model

class Cita(models.Model):
	"""
	Modelo para gestionar citas agendadas por usuarios registrados.
	"""
	usuario_fk = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
	fecha_agendamiento = models.DateField(null=False)
	hora_agendamiento = models.TimeField(null=False)
	servicio_solicitado = models.CharField(max_length=100)
	estado_cita = models.CharField(max_length=50)

	def __str__(self):
		return f"Cita de {self.usuario_fk.username} para {self.servicio_solicitado} el {self.fecha_agendamiento} a las {self.hora_agendamiento}"
                     