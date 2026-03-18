from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.db.models import Count
from e_commerce.models import Cita
from portafolio.models import ContactoPortafolio

class ResumenDashboardView(APIView):
    """
    Vista agregadora de solo lectura para el panel de control del dueño del negocio.
    Solo administradores (is_staff=True) tienen acceso.
    """
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        # 1. Contar el número total de citas orgánicamente
        total_citas = Cita.objects.count()

        # 2. Contar el número total de mensajes de contacto recibidos
        total_mensajes_contacto = ContactoPortafolio.objects.count()

        # 3. Construir la respuesta agregada estructurada en JSON
        data = {
            "total_citas": total_citas,
            "total_mensajes_contacto": total_mensajes_contacto
        }

        return Response(data)
