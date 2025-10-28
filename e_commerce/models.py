from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _


# ====================================================================
# CATÁLOGOS BASE
# ====================================================================

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

class Servicio(models.Model):
    """
    NUEVO MODELO: Catálogo para servicios agendables de microblading/microshading.
    """
    # Cumpliendo con snake_case
    nombre_servicio = models.CharField(max_length=100, null=False, unique=True)
    descripcion = models.TextField()
    precio_estimado = models.DecimalField(max_digits=10, decimal_places=2, null=False)
    # Campo para clasificar internamente los servicios (ej. 'Cejas', 'Labios')
    categoria_servicio = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre_servicio

# ====================================================================
# MODELOS TRANSACCIONALES (Requieren usuario_fk para Seguridad)
# ====================================================================

class VentaCurso(models.Model):
    """
    Modelo para registrar la venta de cursos a usuarios registrados.
    Requiere un usuario_fk que apunte al modelo User para seguridad [5].
    """
    curso_fk = models.ForeignKey('Curso', on_delete=models.CASCADE)
    # Clave foránea al modelo User de Django [5]
    usuario_fk = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    monto_pagado = models.DecimalField(max_digits=10, decimal_places=2, null=False)
    fecha_compra = models.DateField()

    def __str__(self):
        return f"Venta de {self.curso_fk.nombre} a {self.usuario_fk.username} por {self.monto_pagado}"

class Cita(models.Model):
    """
    Modelo para gestionar citas agendadas por usuarios registrados.
    *** REFRACTORIZADO ***: Ahora usa servicio_fk en lugar de servicio_solicitado.
    """
    # Clave foránea al modelo User de Django [6]
    usuario_fk = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    fecha_agendamiento = models.DateField(null=False)
    hora_agendamiento = models.TimeField(null=False)
    
    # CAMBIO CLAVE: Clave foránea al nuevo modelo Servicio, reemplazando CharField [4]
    # Usamos PROTECT para evitar borrar servicios si hay citas asociadas.
    servicio_fk = models.ForeignKey(
        Servicio, 
        on_delete=models.PROTECT, 
        verbose_name=_('Servicio Solicitado')
    ) 
    
    estado_cita = models.CharField(max_length=50)

    def __str__(self):
        # La cadena ahora usa el nombre del servicio a través de la relación FK
        return f"Cita de {self.usuario_fk.username} para {self.servicio_fk.nombre_servicio} el {self.fecha_agendamiento} a las {self.hora_agendamiento}"