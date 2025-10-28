from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.exceptions import ValidationError
from rest_framework.test import APIClient
from rest_framework import status

# Importación asumida de modelos de Portafolio y de los catálogos de E-commerce
from .models import ItemPortafolio, ContactoPortafolio
# Se asume que la app Portafolio puede acceder a los modelos de E-commerce
from e_commerce.models import Curso, Servicio 

User = get_user_model()

# =========================================================
# PRUEBAS DE MODELOS: ItemPortafolio (REFRACTORIZADO)
# =========================================================

class ItemPortafolioModelTest(TestCase):
    """
    Pruebas unitarias para el modelo ItemPortafolio (ahora con categorización).
    """
    def setUp(self):
        # Crear datos de catálogo requeridos para FKs opcionales
        self.curso = Curso.objects.create(
            nombre='Curso Microblading', descripcion_corta='...', precio=300.0, url_video='...', fecha_creacion='2025-01-01'
        )
        self.servicio = Servicio.objects.create(
            nombre_servicio='Microshading', precio_estimado=200.0, categoria_servicio='Labios'
        )
        
        # Simular archivos de imagen usando SimpleUploadedFile (requiere Pillow [4, 5])
        self.imagen_mock = SimpleUploadedFile(name='test_image.jpg', content=b'content', content_type='image/jpeg')
        
    def test_creacion_item_portafolio_minimo(self):
        # Prueba la creación exitosa con campos obligatorios y tipo_item por defecto
        item = ItemPortafolio.objects.create(
            titulo='Trabajo de Cejas',
            descripcion='Ejemplo de trabajo',
            fecha_trabajo='2025-11-10',
            imagen_antes=self.imagen_mock,
            imagen_despues=self.imagen_mock,
            # tipo_item por defecto es 'TRABAJO'
        )
        self.assertEqual(item.titulo, 'Trabajo de Cejas')
        self.assertEqual(item.tipo_item, 'TRABAJO')
        self.assertIsNone(item.curso_fk) # Debe ser opcional

    def test_item_tipo_curso_con_fk(self):
        # Prueba un item categorizado como 'CURSO' vinculado a un Curso existente
        item = ItemPortafolio.objects.create(
            titulo='Ejemplo de práctica',
            fecha_trabajo='2025-11-11',
            imagen_antes=self.imagen_mock,
            imagen_despues=self.imagen_mock,
            tipo_item='CURSO',
            curso_fk=self.curso # Vinculado al curso
        )
        self.assertEqual(item.tipo_item, 'CURSO')
        self.assertEqual(item.curso_fk.nombre, 'Curso Microblading')
        self.assertIsNone(item.servicio_fk) # El otro FK debe ser nulo

    def test_item_tipo_trabajo_con_fk_servicio(self):
        # Prueba un item categorizado como 'TRABAJO' vinculado a un Servicio existente
        item = ItemPortafolio.objects.create(
            titulo='Trabajo Final',
            fecha_trabajo='2025-11-12',
            imagen_antes=self.imagen_mock,
            imagen_despues=self.imagen_mock,
            tipo_item='TRABAJO',
            servicio_fk=self.servicio # Vinculado al servicio
        )
        self.assertEqual(item.tipo_item, 'TRABAJO')
        self.assertEqual(item.servicio_fk.nombre_servicio, 'Microshading')

    def test_validacion_tipo_item_invalido(self):
        # Debe fallar si se usa una opción fuera de TIPO_ITEM_CHOICES
        item = ItemPortafolio(
            titulo='Inválido',
            fecha_trabajo='2025-11-10',
            imagen_antes=self.imagen_mock,
            imagen_despues=self.imagen_mock,
            tipo_item='PRODUCTO_NUEVO' # Valor no permitido
        )
        with self.assertRaises(ValidationError):
            item.full_clean()

# =========================================================
# PRUEBAS DE MODELOS: ContactoPortafolio
# =========================================================

class ContactoPortafolioModelTest(TestCase):
    """
    Pruebas unitarias para el modelo ContactoPortafolio (contactos anónimos) [6].
    """
    def test_nombre_email_requeridos(self):
        # Prueba que los campos de contacto esenciales sean obligatorios
        contacto = ContactoPortafolio(
            mensaje='Interesado en cita',
            fecha_contacto='2025-10-10'
        )
        # Debería fallar por falta de nombre y email
        with self.assertRaises(ValidationError):
            contacto.full_clean()

# =========================================================
# PRUEBAS DE API (ViewSets y Permisos)
# =========================================================

class PortafolioAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Crear usuarios para probar permisos
        self.admin_user = User.objects.create_superuser(username='admin_port', password='testpass', email='admin@port.com')
        self.client_user = User.objects.create_user(username='client_port', password='testpass')
        
        # Crear datos necesarios
        self.curso = Curso.objects.create(nombre='Curso Demo', precio=1.0, fecha_creacion='2025-01-01')
        self.imagen_mock = SimpleUploadedFile(name='test_image.jpg', content=b'content', content_type='image/jpeg')
        self.item = ItemPortafolio.objects.create(
            titulo='Portafolio Existente',
            fecha_trabajo='2025-11-10',
            imagen_antes=self.imagen_mock,
            imagen_despues=self.imagen_mock,
            tipo_item='TRABAJO',
            curso_fk=self.curso # Puede o no tener FK
        )
        
        # URLs base (asumiendo rutas estándar de DRF Router)
        self.item_list_url = '/api/portafolio/items_portafolio/'
        self.contacto_list_url = '/api/portafolio/contactos_portafolio/' 

# --- Pruebas para ItemPortafolioViewSet (IsAdminOrReadOnly) ---

class ItemPortafolioViewSetTest(PortafolioAPITest):
    
    def test_acceso_lectura_anonimo_permitido(self):
        # TDD: El portafolio debe ser de lectura pública
        response = self.client.get(self.item_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verifica que los datos incluyan la nueva información de clasificación
        self.assertIn('curso_fk', response.data['results'])
        self.assertIn('tipo_item', response.data['results'])

    def test_escritura_anonima_denegada(self):
        # TDD: La escritura debe ser solo para administradores (Seguridad)
        data = {
            'titulo': 'Nuevo Item', 
            'fecha_trabajo': '2026-01-01', 
            'imagen_antes': self.imagen_mock,
            'imagen_despues': self.imagen_mock,
            'tipo_item': 'TRABAJO'
        }
        # Debe fallar con 401: No autorizado
        response = self.client.post(self.item_list_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_escritura_admin_permitida(self):
        # TDD: El administrador puede crear contenido del portafolio
        self.client.force_authenticate(user=self.admin_user)
        data = {
            'titulo': 'Nuevo Item Admin', 
            'fecha_trabajo': '2026-01-01', 
            'imagen_antes': self.imagen_mock,
            'imagen_despues': self.imagen_mock,
            'tipo_item': 'CURSO',
            'curso_fk': self.curso.id # Vinculación con el catálogo de e_commerce
        }
        response = self.client.post(self.item_list_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ItemPortafolio.objects.count(), 2)

# --- Pruebas para ContactoPortafolioViewSet (IsPostOrAdminOnly o similar) ---

class ContactoPortafolioViewSetTest(PortafolioAPITest):
    
    def test_creacion_contacto_anonima_permitida(self):
        # TDD: El formulario de contacto debe permitir POST de usuarios anónimos
        data = {
            'nombre': 'Anónimo',
            'email': 'anon@test.com',
            'mensaje': 'Quiero un presupuesto.',
            'fecha_contacto': '2025-12-10'
        }
        response = self.client.post(self.contacto_list_url, data, format='json')
        # Se asume que el ViewSet utiliza un permiso que permite POST anónimos (ej. IsPostOrAdminOnly)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ContactoPortafolio.objects.count(), 1)
        
    def test_lectura_contacto_anonima_denegada(self):
        # TDD: Los contactos son datos sensibles y deben estar restringidos al administrador
        response = self.client.get(self.contacto_list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_lectura_contacto_admin_permitida(self):
        # TDD: El administrador debe poder leer los contactos recibidos
        ContactoPortafolio.objects.create(nombre='Cliente', email='c@c.com', mensaje='Msg', fecha_contacto='2025-12-10')
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.contacto_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)