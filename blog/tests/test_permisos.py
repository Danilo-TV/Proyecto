import pytest
from rest_framework.test import APIClient
from rest_framework import status

@pytest.mark.django_db
class TestBlogPermisos:
    def test_interaccion_bloqueada_para_anonimos(self):
        """
        Feature: Seguridad del Blog
        Scenario: Interacción bloqueada para anónimos
        """
        client = APIClient()
        
        # Given un usuario no autenticado
        # (El client de APIClient no tiene credenciales por defecto)
        
        # When intenta hacer un POST a /blog/comentarios/
        url = '/blog/comentarios/'
        data = {
            "cuerpo_comentario": "Este es un comentario malicioso o spam.",
            "post_fk": 1,
            "aprobado": False
        }
        response = client.post(url, data, format='json')
        
        # Then el sistema devuelve un error HTTP 401 Unauthorized o 403 Forbidden 
        assert response.status_code in [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]
