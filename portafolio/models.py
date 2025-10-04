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