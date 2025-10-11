from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from .models import Cita
class VentaCursoModelTest(TestCase):
	"""
	Pruebas unitarias para el modelo VentaCurso.
	"""
	def setUp(self):
		from .models import Curso
		self.user = get_user_model().objects.create_user(username='cliente', password='testpass')
		self.curso = Curso.objects.create(
			nombre='Curso Test',
			descripcion_corta='Curso básico',
			precio=100.0,
			url_video='https://ejemplo.com/video',
			fecha_creacion='2025-10-10'
		)

	def test_curso_fk_es_requerido(self):
		from .models import VentaCurso
		venta = VentaCurso(
			usuario_fk=self.user,
			monto_pagado=100.0,
			fecha_compra='2025-10-11'
		)
		with self.assertRaises(ValidationError):
			venta.full_clean()

	def test_usuario_fk_es_requerido(self):
		from .models import VentaCurso
		venta = VentaCurso(
			curso_fk=self.curso,
			monto_pagado=100.0,
			fecha_compra='2025-10-11'
		)
		with self.assertRaises(ValidationError):
			venta.full_clean()

	def test_monto_pagado_no_nulo(self):
		from .models import VentaCurso
		venta = VentaCurso(
			curso_fk=self.curso,
			usuario_fk=self.user,
			fecha_compra='2025-10-11'
		)
		with self.assertRaises(ValidationError):
			venta.full_clean()

	def test_str_retorna_cadena_legible(self):
		from .models import VentaCurso
		venta = VentaCurso.objects.create(
			curso_fk=self.curso,
			usuario_fk=self.user,
			monto_pagado=100.0,
			fecha_compra='2025-10-11'
		)
		self.assertIn('cliente', str(venta))
class CursoModelTest(TestCase):
	"""
	Pruebas unitarias para el modelo Curso.
	"""
	def test_nombre_es_requerido(self):
		from .models import Curso
		curso = Curso(
			descripcion_corta='Curso básico',
			precio=100.0,
			url_video='https://ejemplo.com/video',
			fecha_creacion='2025-10-10'
		)
		with self.assertRaises(ValidationError):
			curso.full_clean()

	def test_precio_no_nulo(self):
		from .models import Curso
		curso = Curso(
			nombre='Curso Test',
			descripcion_corta='Curso básico',
			url_video='https://ejemplo.com/video',
			fecha_creacion='2025-10-10'
		)
		with self.assertRaises(ValidationError):
			curso.full_clean()

	def test_str_retorna_nombre(self):
		from .models import Curso
		curso = Curso.objects.create(
			nombre='Curso Test',
			descripcion_corta='Curso básico',
			precio=100.0,
			url_video='https://ejemplo.com/video',
			fecha_creacion='2025-10-10'
		)
		self.assertEqual(str(curso), 'Curso Test')

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from .models import Cita

class CitaModelTest(TestCase):
	"""
	Pruebas unitarias para el modelo Cita.
	"""
	def setUp(self):
		self.user = get_user_model().objects.create_user(username='testuser', password='testpass')

	def test_usuario_fk_es_requerido(self):
		cita = Cita(
			fecha_agendamiento='2025-10-10',
			hora_agendamiento='10:00',
			servicio_solicitado='Microblading',
			estado_cita='Pendiente'
		)
		with self.assertRaises(ValidationError):
			cita.full_clean()

	def test_fecha_y_hora_agendamiento_no_nulos(self):
		cita = Cita(
			usuario_fk=self.user,
			servicio_solicitado='Microblading',
			estado_cita='Pendiente'
		)
		with self.assertRaises(ValidationError):
			cita.full_clean()

	def test_str_retorna_cadena_legible(self):
		cita = Cita.objects.create(
			usuario_fk=self.user,
			fecha_agendamiento='2025-10-10',
			hora_agendamiento='10:00',
			servicio_solicitado='Microblading',
			estado_cita='Pendiente'
		)
		self.assertIn('testuser', str(cita))
