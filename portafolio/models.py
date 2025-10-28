from django.db import models
# Importación asumida de los modelos de catálogo de e_commerce
from e_commerce.models import Curso, Servicio 

# Opciones de clasificación para el campo tipo_item
TIPO_ITEM_CHOICES = [
    ('TRABAJO', 'Trabajo de Cliente'),
    ('CURSO', 'Curso Ejemplificado'),
]

class ItemPortafolio(models.Model):
    """
    Modelo para presentación profesional del portafolio, ahora con categorización.
    """
    titulo = models.CharField(max_length=255, null=False)
    descripcion = models.TextField()
    fecha_trabajo = models.DateField()
    
    # Imagen antes y después (se usa ImageField, asumiendo la dependencia Pillow [7])
    imagen_antes = models.ImageField(upload_to='portafolio/', null=False)
    imagen_despues = models.ImageField(upload_to='portafolio/', null=False)

    # NUEVO CAMPO: Diferencia si es un trabajo real o un ejemplo de curso
    tipo_item = models.CharField(
        max_length=10, 
        choices=TIPO_ITEM_CHOICES, 
        null=False,
        default='TRABAJO'
    )
    
    # NUEVO CAMPO: Clave Foránea Opcional a Curso (para redireccionar a la compra)
    # Se usa SET_NULL porque el portafolio no debe borrarse si se elimina un curso.
    curso_fk = models.ForeignKey(
        Curso, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    
    # NUEVO CAMPO: Clave Foránea Opcional a Servicio (para saber a qué categoría de servicio pertenece)
    servicio_fk = models.ForeignKey(
        Servicio, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )

    def __str__(self):
        return f"[{self.get_tipo_item_display()}] {self.titulo}"
    
    # Se asume que los modelos PortfolioItem y otros duplicados se unificarán en ItemPortafolio.

class ContactoPortafolio(models.Model):
    """
    Modelo para gestión de información de contacto recibida a través del portafolio.
    (No requiere FK a User ya que son contactos anónimos)
    """
    nombre = models.CharField(max_length=255, null=False)
    email = models.EmailField(null=False)
    telefono = models.CharField(max_length=20)
    mensaje = models.TextField()
    fecha_contacto = models.DateField()

    def __str__(self):
        return self.nombre