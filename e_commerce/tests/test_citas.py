import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from e_commerce.models import Cita, Servicio

User = get_user_model()

@pytest.mark.django_db
class TestCitas:
    def test_prevencion_doble_reserva(self):
        """
        Feature: Motor de Reservas
        Scenario: Prevención de doble reserva (Double Booking)
        """
        # Preparamos los datos base para la prueba
        user1 = User.objects.create_user(username='cliente_uno', password='password123')
        user2 = User.objects.create_user(username='cliente_dos', password='password123')
        
        servicio_prueba = Servicio.objects.create(
            nombre_servicio='Microblading Test',
            descripcion='Servicio de prueba para citas',
            precio_estimado=150.00,
            categoria_servicio='Cejas'
        )
        
        # Given una cita ya agendada para el "2026-05-20 a las 10:00 AM"
        Cita.objects.create(
            usuario_fk=user1,
            fecha_agendamiento='2026-05-20',
            hora_agendamiento='10:00:00',
            servicio_fk=servicio_prueba,
            estado_cita='Agendada'
        )
        
        # Configuramos el cliente como el segundo usuario autenticado
        client = APIClient()
        client.force_authenticate(user=user2)
        
        # When otro usuario intenta agendar una cita en la misma fecha y hora
        url = '/e_commerce/citas/'
        data = {
            "fecha_agendamiento": "2026-05-20",
            "hora_agendamiento": "10:00:00",
            "servicio_fk": servicio_prueba.id,
            "estado_cita": "Pendiente"
        }
        
        response = client.post(url, data, format='json')
        
        # Then el sistema devuelve un error HTTP 400 Bad Request indicando que el horario no está disponible
        assert response.status_code == status.HTTP_400_BAD_REQUEST
