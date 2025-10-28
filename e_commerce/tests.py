from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from rest_framework.test import APIClient
from rest_framework import status
from .models import Cita, Curso, VentaCurso, Servicio 

# Obtener el modelo de usuario activo para las pruebas
User = get_user_model()

# =========================================================
# PRUEBAS UNITARIAS DE MODELOS EXISTENTES (VentaCurso y Curso)
# =========================================================

class VentaCursoModelTest(TestCase):
    """Pruebas unitarias para el modelo VentaCurso."""

    def setUp(self):
        self.user = User.objects.create_user(username='cliente', password='testpass')
        self.curso = Curso.objects.create(
            nombre='Curso Test',
            descripcion_corta='Curso básico',
            precio=100.0,
            url_video='https://ejemplo.com/video',
            fecha_creacion='2025-10-10'
        )

    def test_curso_fk_es_requerido(self):
        # ... (Prueba existente para FK a Curso) [4]
        venta = VentaCurso(
            usuario_fk=self.user,
            monto_pagado=100.0,
            fecha_compra='2025-10-11'
        )
        with self.assertRaises(ValidationError):
            venta.full_clean()

    def test_usuario_fk_es_requerido(self):
        # ... (Prueba existente para FK a Usuario) [4]
        venta = VentaCurso(
            curso_fk=self.curso,
            monto_pagado=100.0,
            fecha_compra='2025-10-11'
        )
        with self.assertRaises(ValidationError):
            venta.full_clean()

    # ... (Otras pruebas de VentaCurso y Curso se mantienen igual) [5-7]

# =========================================================
# NUEVAS PRUEBAS UNITARIAS PARA EL MODELO: Servicio (Catálogo)
# =========================================================

class ServicioModelTest(TestCase):
    """
    Pruebas unitarias para el NUEVO modelo Servicio.
    Asegura que los campos clave sean requeridos.
    """
    def test_nombre_servicio_es_requerido(self):
        servicio = Servicio(
            descripcion='Servicio de prueba', 
            precio_estimado=200.00,
            categoria_servicio='Cejas'
        )
        with self.assertRaises(ValidationError):
            servicio.full_clean()
    
    def test_precio_estimado_es_requerido(self):
        servicio = Servicio(
            nombre_servicio='Microblading', 
            descripcion='Servicio de prueba',
            categoria_servicio='Cejas'
        )
        with self.assertRaises(ValidationError):
            servicio.full_clean()

# =========================================================
# PRUEBAS UNITARIAS DE REFRACTORIZACIÓN: Cita
# =========================================================

class CitaModelRefactorTest(TestCase):
    """
    Pruebas unitarias para el modelo Cita después de refactorizar el campo de servicio.
    """
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.servicio = Servicio.objects.create(
            nombre_servicio='Microblading', 
            precio_estimado=250.00,
            categoria_servicio='Cejas'
        )
        
    def test_usuario_fk_es_requerido(self):
        # Se mantiene la prueba de seguridad: usuario_fk es obligatorio [13]
        cita = Cita(
            fecha_agendamiento='2025-10-10',
            hora_agendamiento='10:00',
            # servicio_fk es ahora el campo clave
            estado_cita='Pendiente',
            servicio_fk=self.servicio 
        )
        # Esto debería fallar porque usuario_fk no está presente
        with self.assertRaises(ValidationError):
            cita.full_clean()

    def test_cita_requiere_servicio_fk(self):
        # Nuevo test: Asegura que servicio_fk es obligatorio, reemplazando el viejo CharField
        cita = Cita(
            usuario_fk=self.user,
            fecha_agendamiento='2026-01-01',
            hora_agendamiento='10:00:00',
            estado_cita='Pendiente'
            # FALTA servicio_fk
        )
        with self.assertRaises(ValidationError):
            cita.full_clean()
            
    def test_str_retorna_cadena_legible_con_servicio(self):
        # Prueba que el __str__ refleje el nombre del servicio FK, no el texto simple
        cita = Cita.objects.create(
            usuario_fk=self.user,
            fecha_agendamiento='2025-10-10',
            hora_agendamiento='10:00',
            servicio_fk=self.servicio,
            estado_cita='Pendiente'
        )
        # La cadena debe contener el nombre del servicio (Microblading)
        self.assertIn('Microblading', str(cita))


# =========================================================
# PRUEBAS DE API (ViewSets y Permisos de Seguridad)
# =========================================================

class ECommerceAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Crear usuarios para probar permisos
        self.admin_user = User.objects.create_superuser(username='admin_test', password='testpass', email='admin@test.com')
        self.client_user = User.objects.create_user(username='client_test', password='testpass')
        
        # Crear datos de catálogo
        self.servicio = Servicio.objects.create(
            nombre_servicio='Microblading Cejas', 
            precio_estimado=250.00,
            categoria_servicio='Cejas'
        )
        self.curso = Curso.objects.create(
            nombre='Curso Avanzado',
            descripcion_corta='...',
            precio=500.0,
            url_video='...',
            fecha_creacion='2025-10-10'
        )
        
        # URLs base (asumiendo que las rutas están configuradas por Router)
        self.servicio_list_url = '/api/e_commerce/servicios/' 
        self.cita_list_url = '/api/e_commerce/citas/' 
        self.venta_list_url = '/api/e_commerce/ventas_cursos/' 

# --- Pruebas para ServicioViewSet (IsAuthenticatedOrReadOnly) ---

class ServicioViewSetTest(ECommerceAPITest):

    def test_acceso_lectura_anonimo_permitido(self):
        # TDD: Verificar que la lectura (GET) esté abierta para anónimos (IsAuthenticatedOrReadOnly)
        response = self.client.get(self.servicio_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_escritura_anonima_denegada(self):
        # TDD: Verificar que la escritura (POST) esté denegada para anónimos (Seguridad)
        data = {'nombre_servicio': 'Test', 'precio_estimado': 100.0, 'categoria_servicio': 'Test'}
        response = self.client.post(self.servicio_list_url, data, format='json')
        # Debe fallar con 401: No autorizado
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_escritura_admin_permitida(self):
        # TDD: Verificar que un usuario autenticado puede crear un servicio (contenido)
        self.client.force_authenticate(user=self.admin_user)
        data = {'nombre_servicio': 'Servicio Nuevo', 'precio_estimado': 300.00, 'descripcion': '...', 'categoria_servicio': 'Labios'}
        response = self.client.post(self.servicio_list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

# --- Pruebas para CitaViewSet (IsAuthenticated) ---

class CitaViewSetTest(ECommerceAPITest):
    
    def test_acceso_lectura_anonimo_denegado(self):
        # CitaViewSet utiliza IsAuthenticated [10]: el listado debe estar restringido
        response = self.client.get(self.cita_list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_creacion_cita_anonima_denegada(self):
        # TDD: La creación de una cita requiere login (Seguridad) [10]
        data = {
            'fecha_agendamiento': '2026-01-01',
            'hora_agendamiento': '10:00:00',
            'servicio_fk': self.servicio.id, # Nuevo campo
            'estado_cita': 'Pendiente',
        }
        response = self.client.post(self.cita_list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_creacion_cita_autenticada_exitosa(self):
        # Un cliente logeado puede crear una cita
        self.client.force_authenticate(user=self.client_user)
        data = {
            'fecha_agendamiento': '2026-01-01',
            'hora_agendamiento': '10:00:00',
            'servicio_fk': self.servicio.id,
            'estado_cita': 'Pendiente',
        }
        response = self.client.post(self.cita_list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Cita.objects.count(), 1)
        
    def test_seguridad_perform_create_broken_access_control(self):
        # CRÍTICO: Prueba la función perform_create [14] para prevenir Broken Access Control [11, 12]
        self.client.force_authenticate(user=self.client_user)
        
        # El cliente intenta maliciosamente asignar la cita al ID del administrador (1)
        # Se asume que el ID del administrador es 1 (self.admin_user.id)
        data = {
            'fecha_agendamiento': '2026-01-01',
            'hora_agendamiento': '10:00:00',
            'servicio_fk': self.servicio.id,
            'estado_cita': 'Pendiente',
            'usuario_fk': self.admin_user.id # Intento de inyección de ID
        }
        
        response = self.client.post(self.cita_list_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verifica que la cita se asignó al usuario autenticado (self.client_user), 
        # ignorando el usuario_fk malicioso enviado en los datos.
        cita_creada = Cita.objects.first()
        self.assertEqual(cita_creada.usuario_fk, self.client_user) 
        self.assertNotEqual(cita_creada.usuario_fk, self.admin_user)