from django.test import TestCase
class ContactoPortafolioModelTest(TestCase):
	"""
	Pruebas unitarias para el modelo ContactoPortafolio.
	"""
	def test_nombre_y_email_requeridos(self):
		from .models import ContactoPortafolio
		contacto = ContactoPortafolio(
			telefono='123456789',
			mensaje='Mensaje de prueba',
			fecha_contacto='2025-10-10'
		)
		with self.assertRaises(ValidationError):
			contacto.full_clean()

	def test_str_retorna_nombre(self):
		from .models import ContactoPortafolio
		contacto = ContactoPortafolio.objects.create(
			nombre='Juan',
			email='juan@test.com',
			telefono='123456789',
			mensaje='Mensaje de prueba',
			fecha_contacto='2025-10-10'
		)
		self.assertEqual(str(contacto), 'Juan')
from django.core.exceptions import ValidationError
from .models import ItemPortafolio

class ItemPortafolioModelTest(TestCase):
	"""
	Pruebas unitarias para el modelo ItemPortafolio.
	"""
	def test_titulo_es_requerido(self):
		item = ItemPortafolio(
			descripcion='Trabajo profesional',
			fecha_trabajo='2025-10-10',
			imagen_antes='antes.jpg',
			imagen_despues='despues.jpg'
		)
		item.titulo = None
		with self.assertRaises(ValidationError):
			item.full_clean()

	def test_imagenes_no_nulas(self):
		item = ItemPortafolio(
			titulo='Trabajo Test',
			descripcion='Trabajo profesional',
			fecha_trabajo='2025-10-10'
		)
		with self.assertRaises(ValidationError):
			item.full_clean()

	def test_str_retorna_titulo(self):
		item = ItemPortafolio.objects.create(
			titulo='Trabajo Test',
			descripcion='Trabajo profesional',
			fecha_trabajo='2025-10-10',
			imagen_antes='antes.jpg',
			imagen_despues='despues.jpg'
		)
		self.assertEqual(str(item), 'Trabajo Test')
from django.test import TestCase

# Create your tests here.
