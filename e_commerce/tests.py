import pytest
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from e_commerce.models import Cita, Curso, VentaCurso, Servicio
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

# =========================================================
# FIXTURES
# =========================================================

@pytest.fixture
def client():
    return APIClient()

@pytest.fixture
def client_user():
    return User.objects.create_user(username='client_test', password='testpass')

@pytest.fixture
def admin_user():
    return User.objects.create_superuser(username='admin_test', password='testpass', email='admin@test.com')

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
    return Curso.objects.create(
        nombre='Curso Test',
        descripcion_corta='Curso básico',
        precio=100.0,
        url_video='https://ejemplo.com/video',
        fecha_creacion='2025-10-10'
    )

@pytest.fixture
def servicio_test():
    return Servicio.objects.create(
        nombre_servicio='Microblading',
        descripcion='Servicio de prueba',
        precio_estimado=250.00,
        categoria_servicio='Cejas'
    )

# =========================================================
# PRUEBAS UNITARIAS DE MODELOS (VentaCurso, Servicio, Cita)
# =========================================================

@pytest.mark.django_db
class TestVentaCursoModel:
    def test_curso_fk_es_requerido(self, client_user):
        venta = VentaCurso(
            usuario_fk=client_user,
            monto_pagado=100.0,
            fecha_compra='2025-10-11'
        )
        with pytest.raises(ValidationError):
            venta.full_clean()

    def test_usuario_fk_es_requerido(self, curso_test):
        venta = VentaCurso(
            curso_fk=curso_test,
            monto_pagado=100.0,
            fecha_compra='2025-10-11'
        )
        with pytest.raises(ValidationError):
            venta.full_clean()

@pytest.mark.django_db
class TestServicioModel:
    def test_nombre_servicio_es_requerido(self):
        servicio = Servicio(descripcion='Test', precio_estimado=200.0, categoria_servicio='Cejas')
        with pytest.raises(ValidationError):
            servicio.full_clean()
    
    def test_precio_estimado_es_requerido(self):
        servicio = Servicio(nombre_servicio='Test', descripcion='Test', categoria_servicio='Cejas')
        with pytest.raises(ValidationError):
            servicio.full_clean()

@pytest.mark.django_db
class TestCitaModel:
    def test_usuario_fk_es_requerido(self, servicio_test):
        cita = Cita(
            fecha_agendamiento='2025-10-10',
            hora_agendamiento='10:00:00',
            estado_cita='Pendiente',
            servicio_fk=servicio_test 
        )
        with pytest.raises(ValidationError):
            cita.full_clean()

    def test_cita_requiere_servicio_fk(self, client_user):
        cita = Cita(
            usuario_fk=client_user,
            fecha_agendamiento='2026-01-01',
            hora_agendamiento='10:00:00',
            estado_cita='Pendiente'
        )
        with pytest.raises(ValidationError):
            cita.full_clean()
            
    def test_str_retorna_cadena_legible_con_servicio(self, client_user, servicio_test):
        cita = Cita.objects.create(
            usuario_fk=client_user,
            fecha_agendamiento='2025-10-10',
            hora_agendamiento='10:00:00',
            servicio_fk=servicio_test,
            estado_cita='Pendiente'
        )
        assert 'Microblading' in str(cita)

# =========================================================
# PRUEBAS DE API (ViewSets y Permisos con JWT)
# =========================================================

@pytest.mark.django_db
class TestServicioViewSet:
    url = '/e_commerce/servicios/' 

    def test_acceso_lectura_anonimo_denegado_o_permitido(self, client, servicio_test):
        # Según spec (IsAuthenticated): e_commerce debe estar protegido TODO con IsAuthenticated
        response = client.get(self.url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_escritura_anonima_denegada(self, client):
        data = {'nombre_servicio': 'Test', 'precio_estimado': 100.0, 'categoria_servicio': 'Test'}
        response = client.post(self.url, data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        
    def test_escritura_admin_permitida(self, admin_client):
        data = {'nombre_servicio': 'Servicio Nuevo', 'precio_estimado': 300.00, 'descripcion': '...', 'categoria_servicio': 'Labios'}
        response = admin_client.post(self.url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED

@pytest.mark.django_db
class TestCitaViewSet:
    url = '/e_commerce/citas/' 
    
    def test_acceso_lectura_anonimo_denegado(self, client):
        response = client.get(self.url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_creacion_cita_anonima_denegada(self, client, servicio_test):
        data = {
            'fecha_agendamiento': '2026-01-01',
            'hora_agendamiento': '10:00:00',
            'servicio_fk': servicio_test.id,
            'estado_cita': 'Pendiente',
        }
        response = client.post(self.url, data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_creacion_cita_autenticada_exitosa(self, auth_client, client_user, servicio_test):
        data = {
            'fecha_agendamiento': '2026-01-01',
            'hora_agendamiento': '10:00:00',
            'servicio_fk': servicio_test.id,
            'estado_cita': 'Pendiente',
        }
        response = auth_client.post(self.url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert "id" in response.data
        assert response.data["id"] is not None
        assert Cita.objects.count() == 1
        
    def test_seguridad_perform_create_broken_access_control(self, auth_client, client_user, admin_user, servicio_test):
        # El cliente intenta asignar la cita al admin_user inyectando usuario_fk
        data = {
            'fecha_agendamiento': '2026-01-02',
            'hora_agendamiento': '10:00:00',
            'servicio_fk': servicio_test.id,
            'estado_cita': 'Pendiente',
            'usuario_fk': admin_user.id
        }
        response = auth_client.post(self.url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        
        cita_creada = Cita.objects.first()
        assert cita_creada.usuario_fk == client_user
        assert cita_creada.usuario_fk != admin_user