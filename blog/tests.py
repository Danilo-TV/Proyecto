from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from .models import PostBlog
class ComentarioModelTest(TestCase):
	"""
	Pruebas unitarias para el modelo Comentario.
	"""
	def setUp(self):
		from .models import PostBlog
		self.user = get_user_model().objects.create_user(username='autor', password='testpass')
		self.post = PostBlog.objects.create(
			titulo='Post Test',
			slug='post-test',
			contenido='Contenido de prueba',
			fecha_publicacion='2025-10-10',
			autor_fk=self.user,
			imagen_principal='https://ejemplo.com/img.jpg'
		)

	def test_post_fk_es_requerido(self):
		from .models import Comentario
		comentario = Comentario(
			usuario_fk=self.user,
			cuerpo_comentario='Comentario de prueba',
			fecha_comentario='2025-10-11',
			aprobado=True
		)
		with self.assertRaises(ValidationError):
			comentario.full_clean()

	def test_usuario_fk_es_requerido(self):
		from .models import Comentario
		comentario = Comentario(
			post_fk=self.post,
			cuerpo_comentario='Comentario de prueba',
			fecha_comentario='2025-10-11',
			aprobado=True
		)
		with self.assertRaises(ValidationError):
			comentario.full_clean()

	def test_str_retorna_cuerpo(self):
		from .models import Comentario
		comentario = Comentario.objects.create(
			post_fk=self.post,
			usuario_fk=self.user,
			cuerpo_comentario='Comentario de prueba',
			fecha_comentario='2025-10-11',
			aprobado=True
		)
		self.assertIn('Comentario de prueba', str(comentario))

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from .models import PostBlog

class PostBlogModelTest(TestCase):
	"""
	Pruebas unitarias para el modelo PostBlog.
	"""
	def setUp(self):
		self.user = get_user_model().objects.create_user(username='admin', password='testpass')

	def test_titulo_es_requerido(self):
		post = PostBlog(
			slug='post-test',
			contenido='Contenido de prueba',
			fecha_publicacion='2025-10-10',
			autor_fk=self.user,
			imagen_principal='https://ejemplo.com/img.jpg'
		)
		post.titulo = None
		with self.assertRaises(ValidationError):
			post.full_clean()

	def test_autor_fk_es_requerido(self):
		post = PostBlog(
			titulo='Post Test',
			slug='post-test',
			contenido='Contenido de prueba',
			fecha_publicacion='2025-10-10',
			imagen_principal='https://ejemplo.com/img.jpg'
		)
		with self.assertRaises(ValidationError):
			post.full_clean()

	def test_str_retorna_titulo(self):
		post = PostBlog.objects.create(
			titulo='Post Test',
			slug='post-test',
			contenido='Contenido de prueba',
			fecha_publicacion='2025-10-10',
			autor_fk=self.user,
			imagen_principal='https://ejemplo.com/img.jpg'
		)
		self.assertEqual(str(post), 'Post Test')
