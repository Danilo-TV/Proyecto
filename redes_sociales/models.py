from django.db import models

# Create your models here.
class PublicacionRedSocial(models.Model):
    """
    Modelo para gestionar publicaciones en redes sociales.
    """
    plataforma = models.CharField(max_length=50, null=False)
    contenido_texto = models.TextField()
    imagen_adjunta = models.ImageField(upload_to='redes_sociales/', null=True, blank=True)
    fecha_programada = models.DateField()
    estado = models.CharField(max_length=50, null=False)

    def __str__(self):
        return f"{self.plataforma}: {self.estado}"

class MetricaReaccion(models.Model):
    """
    Modelo para registrar métricas de reacción en publicaciones de redes sociales.
    """
    publicacion_fk = models.ForeignKey(PublicacionRedSocial, on_delete=models.CASCADE, null=False)
    tipo_reaccion = models.CharField(max_length=50)
    conteo = models.IntegerField()

    def __str__(self):
        return f"{self.tipo_reaccion}: {self.conteo}"