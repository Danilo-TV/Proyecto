from django.db import models

class ContactoPortafolio(models.Model):
    """
    Modelo para gestión de información de contacto recibida a través del portafolio.
    """
    nombre = models.CharField(max_length=255, null=False)
    email = models.EmailField(null=False)
    telefono = models.CharField(max_length=20)
    mensaje = models.TextField()
    fecha_contacto = models.DateField()

    def __str__(self):
        return self.nombre
from django.db import models

class ItemPortafolio(models.Model):
    """
    Modelo para presentación profesional del portafolio.
    """
    titulo = models.CharField(max_length=255, null=False)
    descripcion = models.TextField()
    fecha_trabajo = models.DateField()
    imagen_antes = models.ImageField(upload_to='portafolio/', null=False)
    imagen_despues = models.ImageField(upload_to='portafolio/', null=False)

    def __str__(self):
        return self.titulo
from django.db import models
from django.utils import timezone

class PortfolioItem(models.Model):
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True)
    imagen_url = models.URLField(max_length=500)
    tecnica = models.CharField(max_length=100) # Microblading/Shading
    fecha_trabajo = models.DateField()

    def __str__(self):
        return self.titulo