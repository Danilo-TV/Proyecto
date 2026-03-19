import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from unittest.mock import patch
from e_commerce.models import Cita, Servicio

User = get_user_model()

@pytest.mark.django_db
class TestPayPalIntegration:
    def test_inicializacion_pago_exitosa(self):
        """
        Feature: Integración de Pagos con PayPal
        Scenario: Inicialización de pago exitosa
        """
        # Given un usuario autenticado y una Cita en estado pendiente
        user = User.objects.create_user(username='cliente_paypal', password='password123')
        servicio = Servicio.objects.create(
            nombre_servicio='Servicio PayPal',
            descripcion='Prueba PayPal',
            precio_estimado=100.00,
            categoria_servicio='Cejas'
        )
        cita = Cita.objects.create(
            usuario_fk=user,
            fecha_agendamiento='2026-10-10',
            hora_agendamiento='10:00:00',
            servicio_fk=servicio,
            estado_cita='Pendiente'
        )
        
        client = APIClient()
        client.force_authenticate(user=user)
        
        # Then la API de PayPal es mockeada (interceptada con @patch)
        # Hacemos patch de requests.post ya que aún no existe implementado en views
        with patch('requests.post') as mock_post:
            class MockResponse:
                def __init__(self, json_data, status_code):
                    self.json_data = json_data
                    self.status_code = status_code
                def json(self):
                    return self.json_data

            def side_effect(*args, **kwargs):
                url = args[0]
                if "oauth2/token" in url:
                    return MockResponse({"access_token": "FAKE_TOKEN_123"}, 200)
                elif "checkout/orders" in url:
                    return MockResponse({
                        "id": "PAYPAL_ORDER_ID_123",
                        "links": [
                            {"rel": "approve", "href": "https://www.sandbox.paypal.com/checkoutnow?token=PAYPAL_ORDER_ID_123"}
                        ]
                    }, 201)
                return MockResponse({}, 400)

            mock_post.side_effect = side_effect
            
            # When hace un POST a /e_commerce/pagar/ con el ID de la Cita
            url = '/e_commerce/pagar/'
            response = client.post(url, {'cita_id': cita.id}, format='json')
            
            # And el sistema devuelve un HTTP 200 OK con una "approval_url"
            assert response.status_code == status.HTTP_200_OK
            assert "approval_url" in response.data

    def test_confirmacion_pago_actualiza_estado(self):
        """
        Feature: Integración de Pagos con PayPal
        Scenario: Confirmación de pago actualiza el estado
        """
        # Given un pago previamente iniciado (Cita pendiente)
        user = User.objects.create_user(username='cliente_paypal_auth', password='password123')
        servicio = Servicio.objects.create(
            nombre_servicio='Servicio PayPal Auth',
            descripcion='Prueba PayPal Auth',
            precio_estimado=150.00,
            categoria_servicio='Labios'
        )
        cita = Cita.objects.create(
            usuario_fk=user,
            fecha_agendamiento='2026-10-11',
            hora_agendamiento='11:00:00',
            servicio_fk=servicio,
            estado_cita='Pendiente'
        )
        
        client = APIClient()
        client.force_authenticate(user=user)
        
        # Then la API de validación de PayPal es mockeada para retornar éxito
        with patch('requests.post') as mock_post:
            class MockResponse:
                def __init__(self, json_data, status_code):
                    self.json_data = json_data
                    self.status_code = status_code
                def json(self):
                    return self.json_data

            def side_effect(*args, **kwargs):
                url = args[0]
                if "oauth2/token" in url:
                    return MockResponse({"access_token": "FAKE_TOKEN_123"}, 200)
                elif "capture" in url:
                    return MockResponse({"status": "COMPLETED"}, 201)
                return MockResponse({}, 400)

            mock_post.side_effect = side_effect
            
            # When hace un POST a /e_commerce/confirmar-pago/ con el token de PayPal
            url = '/e_commerce/confirmar-pago/'
            response = client.post(url, {'cita_id': cita.id, 'token': 'PAYPAL_ORDER_ID_123'}, format='json')
            
            # And el sistema devuelve un HTTP 200 OK
            assert response.status_code == status.HTTP_200_OK
            
            # And el sistema marca la Cita como pagada en la base de datos
            cita.refresh_from_db()
            assert cita.estado_cita == 'Pagada'
