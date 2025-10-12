from django.urls import path, include
from rest_framework import routers
from .views import ItemPortafolioViewSet, ContactoPortafolioViewSet

# 1. Inicializar el Router de DRF
# El uso de Routers permite la generación automática y eficiente de la configuración de URL (URL conf) [1, 3-5].
router = routers.DefaultRouter()

# 2. Registrar los ViewSets (siguiendo la nomenclatura snake_case)

# Endpoint para la gestión de ítems del portafolio (Lectura pública, Escritura autenticada)
router.register(r'items_portafolio', ItemPortafolioViewSet, basename='items_portafolio')

# Endpoint para la gestión de contactos recibidos (Creación anónima, Lectura/Administración autenticada)
router.register(r'contactos_portafolio', ContactoPortafolioViewSet, basename='contactos_portafolio')

# 3. Incluir las URLs generadas por el Router
urlpatterns = [
    path('', include(router.urls)),
]