from django.test import TestCase
from django.core.exceptions import ValidationError

class PublicacionRedSocialModelTest(TestCase):
    """
    Pruebas unitarias para el modelo PublicacionRedSocial.
    """
    def test_plataforma_y_estado_requeridos(self):
        from .models import PublicacionRedSocial
        pub = PublicacionRedSocial(
            contenido_texto='Texto de prueba',
            imagen_adjunta='imagen.jpg',
            fecha_programada='2025-10-10'
        )
        with self.assertRaises(ValidationError):
            pub.full_clean()

    def test_str_retorna_plataforma(self):
        from .models import PublicacionRedSocial
        pub = PublicacionRedSocial.objects.create(
            plataforma='Twitter',
            contenido_texto='Texto de prueba',
            imagen_adjunta='imagen.jpg',
            fecha_programada='2025-10-10',
            estado='Programada'
        )
        self.assertIn('Twitter', str(pub))

class MetricaReaccionModelTest(TestCase):
    """
    Pruebas unitarias para el modelo MetricaReaccion.
    """
    def setUp(self):
        from .models import PublicacionRedSocial
        self.pub = PublicacionRedSocial.objects.create(
            plataforma='Facebook',
            contenido_texto='Texto de prueba',
            imagen_adjunta='imagen.jpg',
            fecha_programada='2025-10-10',
            estado='Publicado'
        )

    def test_publicacion_fk_es_requerido(self):
        from .models import MetricaReaccion
        metrica = MetricaReaccion(
            tipo_reaccion='Like',
            conteo=10
        )
        with self.assertRaises(ValidationError):
            metrica.full_clean()

    def test_str_retorna_tipo_reaccion(self):
        from .models import MetricaReaccion
        metrica = MetricaReaccion.objects.create(
            publicacion_fk=self.pub,
            tipo_reaccion='Share',
            conteo=5
        )
        self.assertIn('Share', str(metrica))