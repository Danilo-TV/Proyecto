import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
class TestAuthJWTAndThrottling:
    
    def test_login_exitoso_devuelve_jwt(self):
        """
        Feature: Autenticación Segura
        Scenario: Login exitoso devuelve JWT
        """
        # Given un usuario registrado y activo
        user = User.objects.create_user(username='test_jwt_user', password='securepassword123')
        client = APIClient()
        
        # When hace un POST al endpoint de login con credenciales válidas
        url = '/auth/login/'
        data = {
            "username": "test_jwt_user",
            "password": "securepassword123"
        }
        response = client.post(url, data, format='json')
        
        # Then el sistema devuelve un HTTP 200 OK
        assert response.status_code == status.HTTP_200_OK, f"Status no es 200. Es: {response.status_code}"
        
        # And la respuesta contiene un "access" token y un "refresh" token
        assert "access" in response.data, "No se encontró el 'access' token en la respuesta"
        assert "refresh" in response.data, "No se encontró el 'refresh' token en la respuesta"

    def test_prevencion_fuerza_bruta_throttling(self):
        """
        Feature: Autenticación Segura
        Scenario: Prevención de Fuerza Bruta (Throttling)
        """
        client = APIClient()
        url = '/auth/login/'
        data = {
            "username": "anon_brute",
            "password": "wrongpassword"
        }
        
        # Given un usuario anónimo malicioso
        from django.core.cache import cache
        cache.clear()

        # When hace 6 peticiones POST fallidas consecutivas al endpoint de login
        for i in range(5):
            response = client.post(url, data, format='json')
            # Las primeras 5 (o fallan por credenciales 401, o similar, pero no 429)
            assert response.status_code != status.HTTP_429_TOO_MANY_REQUESTS
            
        # Then en la sexta petición el sistema devuelve un HTTP 429 Too Many Requests
        response = client.post(url, data, format='json')
        assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS, "El throttling no detuvo la 6ta petición"
