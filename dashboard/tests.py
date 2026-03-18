import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from e_commerce.models import Cita, Servicio
from portafolio.models import ContactoPortafolio
from rest_framework_simplejwt.tokens import RefreshToken
import datetime

User = get_user_model()

@pytest.fixture
def client():
    return APIClient()

@pytest.fixture
def admin_user():
    return User.objects.create_superuser(username='admin_dash', password='testpass', email='admin@dash.com')

@pytest.fixture
def normal_user():
    return User.objects.create_user(username='user_dash', password='testpass', email='user@dash.com')

@pytest.fixture
def admin_client(client, admin_user):
    token = RefreshToken.for_user(admin_user).access_token
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    return client

@pytest.fixture
def auth_client(client, normal_user):
    token = RefreshToken.for_user(normal_user).access_token
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    return client

@pytest.fixture
def setup_metrics(normal_user):
    # Crear 3 citas
    servicio = Servicio.objects.create(nombre_servicio='Corte', precio_estimado=15.0, categoria_servicio='Pelo')
    Cita.objects.create(usuario_fk=normal_user, fecha_agendamiento='2026-01-01', hora_agendamiento='10:00:00', servicio_fk=servicio, estado_cita='Pendiente')
    Cita.objects.create(usuario_fk=normal_user, fecha_agendamiento='2026-01-02', hora_agendamiento='11:00:00', servicio_fk=servicio, estado_cita='Pendiente')
    Cita.objects.create(usuario_fk=normal_user, fecha_agendamiento='2026-01-03', hora_agendamiento='12:00:00', servicio_fk=servicio, estado_cita='Pendiente')
    
    # Crear 2 contactos
    ContactoPortafolio.objects.create(nombre='A', email='a@a.com', telefono='1', mensaje='M1', fecha_contacto=datetime.date.today())
    ContactoPortafolio.objects.create(nombre='B', email='b@b.com', telefono='2', mensaje='M2', fecha_contacto=datetime.date.today())

@pytest.mark.django_db
class TestDashboardMetrics:
    url = '/dashboard/resumen/'

    def test_acceso_denegado_anonimo(self, client):
        response = client.get(self.url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_acceso_denegado_cliente_normal(self, auth_client):
        # Un usuario autenticado pero sin rol admin no debe acceder (IsAdminUser)
        response = auth_client.get(self.url)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_acceso_exitoso_admin_devuelve_metricas(self, admin_client, setup_metrics):
        # El administrador debe poder entrar y ver las métricas agregadas
        response = admin_client.get(self.url)
        assert response.status_code == status.HTTP_200_OK
        
        data = response.data
        assert 'total_citas' in data
        assert 'total_mensajes_contacto' in data
        assert data['total_citas'] == 3
        assert data['total_mensajes_contacto'] == 2
