from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone

class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El email es obligatorio')
        email = self.normalize_email(email)
        usuario = self.model(email=email, **extra_fields)
        usuario.set_password(password) # set_password aplica hashing
        usuario.save(using=self._db)
        return usuario
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_admin', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)
    
class Usuario(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    nombre = models.CharField(max_length=255)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    fecha_registro = models.DateTimeField(default=timezone.now)

    objects = UsuarioManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre']

    def __str__(self):
        return self.email

class SocialTokens(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    plataforma = models.CharField(max_length=50) # Ej: 'Twitter', 'Facebook'
    token_acceso = models.TextField()
    fecha_expiracion = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ('usuario', 'plataforma')

class Servicios(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField()
    es_curso = models.BooleanField(default=False) # True si es curso, False si es servicio
    
    def __str__(self):
        return self.nombre

class Servicios(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField()
    es_curso = models.BooleanField(default=False) # True si es curso, False si es servicio
    
    def __str__(self):
        return self.nombre

class InscripcionesCurso(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    curso = models.ForeignKey(Servicios, on_delete=models.CASCADE, limit_choices_to={'es_curso': True}) 
    fecha_inscripcion = models.DateTimeField(default=timezone.now)
    precio_pagado = models.DecimalField(max_digits=10, decimal_places=2)
    estado_pago = models.CharField(max_length=50)
    
    def __str__(self):
        return f"Inscripción de {self.usuario.email} al curso {self.curso.nombre}"                        