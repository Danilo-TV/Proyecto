import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from portafolio.models import ItemPortafolio, ContactoPortafolio
from e_commerce.models import Curso, Servicio
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

# =========================================================
# FIXTURES
# =========================================================

@pytest.fixture
def client():
    return APIClient()

@pytest.fixture
def admin_user():
    return User.objects.create_superuser(username='admin_port', password='testpass', email='admin@port.com')

@pytest.fixture
def client_user():
    return User.objects.create_user(username='client_port', password='testpass')

@pytest.fixture
def auth_client(client, client_user):
    token = RefreshToken.for_user(client_user).access_token
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    return client

@pytest.fixture
def admin_client(client, admin_user):
    token = RefreshToken.for_user(admin_user).access_token
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    return client

@pytest.fixture
def curso_test():
    return Curso.objects.create(nombre='Curso Demo', precio=1.0, fecha_creacion='2025-01-01')

@pytest.fixture
def servicio_test():
    return Servicio.objects.create(nombre_servicio='Microshading', precio_estimado=200.0, categoria_servicio='Labios')

@pytest.fixture
def imagen_mock():
    # 1x1 pixel transparente en GIF
    gif_bytes = b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b'
    return SimpleUploadedFile(name='test_image.gif', content=gif_bytes, content_type='image/gif')

@pytest.fixture
def imagen_mock_despues():
    gif_bytes = b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b'
    return SimpleUploadedFile(name='test_image_desp.gif', content=gif_bytes, content_type='image/gif')

@pytest.fixture
def item_test(curso_test, imagen_mock, imagen_mock_despues):
    return ItemPortafolio.objects.create(
        titulo='Portafolio Existente',
        fecha_trabajo='2025-11-10',
        imagen_antes=imagen_mock,
        imagen_despues=imagen_mock,
        tipo_item='TRABAJO',
        curso_fk=curso_test
    )

# =========================================================
# PRUEBAS DE MODELOS (ItemPortafolio, ContactoPortafolio)
# =========================================================

@pytest.mark.django_db
class TestItemPortafolioModel:
    def test_creacion_item_portafolio_minimo(self, imagen_mock, imagen_mock_despues):
        item = ItemPortafolio.objects.create(
            titulo='Trabajo de Cejas',
            descripcion='Ejemplo de trabajo',
            fecha_trabajo='2025-11-10',
            imagen_antes=imagen_mock,
            imagen_despues=imagen_mock_despues,
        )
        assert item.titulo == 'Trabajo de Cejas'
        assert item.tipo_item == 'TRABAJO'
        assert item.curso_fk is None

    def test_item_tipo_curso_con_fk(self, imagen_mock, imagen_mock_despues, curso_test):
        item = ItemPortafolio.objects.create(
            titulo='Ejemplo de práctica',
            fecha_trabajo='2025-11-11',
            imagen_antes=imagen_mock,
            imagen_despues=imagen_mock_despues,
            tipo_item='CURSO',
            curso_fk=curso_test
        )
        assert item.tipo_item == 'CURSO'
        assert item.curso_fk.nombre == 'Curso Demo'
        assert item.servicio_fk is None

    def test_item_tipo_trabajo_con_fk_servicio(self, imagen_mock, imagen_mock_despues, servicio_test):
        item = ItemPortafolio.objects.create(
            titulo='Trabajo Final',
            fecha_trabajo='2025-11-12',
            imagen_antes=imagen_mock,
            imagen_despues=imagen_mock_despues,
            tipo_item='TRABAJO',
            servicio_fk=servicio_test
        )
        assert item.tipo_item == 'TRABAJO'
        assert item.servicio_fk.nombre_servicio == 'Microshading'

    def test_validacion_tipo_item_invalido(self, imagen_mock, imagen_mock_despues):
        item = ItemPortafolio(
            titulo='Inválido',
            fecha_trabajo='2025-11-10',
            imagen_antes=imagen_mock,
            imagen_despues=imagen_mock_despues,
            tipo_item='PRODUCTO_NUEVO'
        )
        with pytest.raises(ValidationError):
            item.full_clean()

@pytest.mark.django_db
class TestContactoPortafolioModel:
    def test_nombre_email_requeridos(self):
        contacto = ContactoPortafolio(
            mensaje='Interesado en cita',
            fecha_contacto='2025-10-10'
        )
        with pytest.raises(ValidationError):
            contacto.full_clean()

# =========================================================
# PRUEBAS DE API (ViewSets y Permisos)
# =========================================================

@pytest.mark.django_db
class TestItemPortafolioViewSet:
    url = '/portafolio/items_portafolio/'

    def test_acceso_lectura_anonimo_permitido(self, client, item_test):
        response = client.get(self.url)
        assert response.status_code == status.HTTP_200_OK
        data = response.data['results'] if isinstance(response.data, dict) and 'results' in response.data else response.data
        assert 'curso_fk' in data[0] or len(data) > 0

    def test_escritura_anonima_denegada(self, client, imagen_mock, imagen_mock_despues):
        data = {
            'titulo': 'Nuevo Item', 
            'fecha_trabajo': '2026-01-01', 
            'imagen_antes': imagen_mock,
            'imagen_despues': imagen_mock_despues,
            'tipo_item': 'TRABAJO'
        }
        response = client.post(self.url, data, format='multipart')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        
    def test_escritura_admin_permitida(self, admin_client, imagen_mock, imagen_mock_despues, curso_test):
        data = {
            'titulo': 'Nuevo Item Admin', 
            'descripcion': 'Test description',
            'fecha_trabajo': '2026-01-01', 
            'imagen_antes': imagen_mock,
            'imagen_despues': imagen_mock_despues,
            'tipo_item': 'CURSO',
            'curso_fk': curso_test.id
        }
        # Hay que resetear file pointer para multipart si se usó
        imagen_mock.seek(0)
        imagen_mock_despues.seek(0)
        response = admin_client.post(self.url, data, format='multipart')
        assert response.status_code == status.HTTP_201_CREATED, response.data
        assert ItemPortafolio.objects.count() == 1  # 1 created here, the item_test is not saved if we don't call the fixture explicitly in the argument list?
        # Wait, the fixture `item_test` is not passed to this function, so it's not created.

@pytest.mark.django_db
class TestContactoPortafolioViewSet:
    url = '/portafolio/contactos_portafolio/'

    def test_creacion_contacto_anonima_permitida(self, client):
        data = {
            'nombre': 'Anónimo',
            'email': 'anon@test.com',
            'telefono': '123456789',
            'mensaje': 'Quiero un presupuesto.',
            'fecha_contacto': '2025-12-10'
        }
        response = client.post(self.url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED, response.data
        assert ContactoPortafolio.objects.count() == 1
        
    def test_lectura_contacto_anonima_denegada(self, client):
        response = client.get(self.url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        
    def test_lectura_contacto_admin_permitida(self, admin_client):
        ContactoPortafolio.objects.create(nombre='Cliente', email='c@c.com', telefono='123', mensaje='Msg', fecha_contacto='2025-12-10')
        response = admin_client.get(self.url)
        assert response.status_code == status.HTTP_200_OK
        data = response.data['results'] if isinstance(response.data, dict) and 'results' in response.data else response.data
        assert len(data) == 1