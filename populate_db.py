import os
import django
from datetime import datetime, timedelta
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'administracion_portafolio.settings')
django.setup()

from e_commerce.models import Usuario, Servicios, InscripcionesCurso, SocialTokens
from blog.models import BlogPost
from portafolio.models import PortfolioItem


def run():
    # Usuarios
    usuarios = []
    for i in range(10):
        email = f"usuario{i+1}@test.com"
        nombre = f"Usuario {i+1}"
        usuario = Usuario.objects.create_user(email=email, password=f"pass{i+1}secure", nombre=nombre)
        usuarios.append(usuario)

    # Servicios (5 servicios, 5 cursos)
    servicios = []
    for i in range(5):
        s = Servicios.objects.create(nombre=f"Servicio {i+1}", descripcion=f"Descripción del servicio {i+1}", es_curso=False)
        servicios.append(s)
    for i in range(5):
        c = Servicios.objects.create(nombre=f"Curso {i+1}", descripcion=f"Descripción del curso {i+1}", es_curso=True)
        servicios.append(c)

    # InscripcionesCurso (10 inscripciones, cada usuario en un curso diferente)
    cursos = [s for s in servicios if s.es_curso]
    for i, usuario in enumerate(usuarios):
        curso = cursos[i % len(cursos)]
        InscripcionesCurso.objects.create(
            usuario=usuario,
            curso=curso,
            precio_pagado=round(random.uniform(100, 500), 2),
            estado_pago=random.choice(['Pagado', 'Pendiente'])
        )

    # SocialTokens (cada usuario con un token Facebook y uno Twitter)
    for usuario in usuarios:
        SocialTokens.objects.create(
            usuario=usuario,
            plataforma='Facebook',
            token_acceso=f'FACEBOOK_TOKEN_{usuario.id}_FICTICIO',
            fecha_expiracion=datetime.now() + timedelta(days=30)
        )
        SocialTokens.objects.create(
            usuario=usuario,
            plataforma='Twitter',
            token_acceso=f'TWITTER_TOKEN_{usuario.id}_FICTICIO',
            fecha_expiracion=datetime.now() + timedelta(days=30)
        )

    # BlogPosts (10 posts, autor aleatorio)
    for i in range(10):
        autor = random.choice(usuarios)
        BlogPost.objects.create(
            autor=autor,
            titulo=f'Post de prueba #{i+1}',
            contenido='Contenido de ejemplo para el blog.',
            categoria='Test',
            fecha_publicacion=datetime.now() - timedelta(days=random.randint(0, 30))
        )

    # PortfolioItems (10 trabajos, técnica y usuario aleatorio)
    tecnicas = ['Microblading', 'Microshading']
    for i in range(10):
        PortfolioItem.objects.create(
            titulo=f'Trabajo de prueba #{i+1}',
            descripcion=f'Descripción del trabajo {i+1}',
            imagen_url=f'https://ejemplo.com/imagenes/ejemplo{i+1}.jpg',
            tecnica=random.choice(tecnicas),
            fecha_trabajo=datetime.now().date() - timedelta(days=random.randint(0, 365))
        )

    print('¡10 registros creados en cada tabla principal!')

if __name__ == '__main__':
    run()
