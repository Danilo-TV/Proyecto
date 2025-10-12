from django.urls import path, include
from rest_framework import routers
from .views import PostBlogViewSet, ComentarioViewSet

# 1. Inicializar el Router
# Utilizamos DefaultRouter para la configuración estándar.
router = routers.DefaultRouter()

# 2. Registrar los ViewSets
# Se sigue la Convención de Nomenclatura para URLs/Endpoints: usar snake_case [7, 8].

# Endpoint para la gestión de publicaciones
router.register(r'posts_blog', PostBlogViewSet, basename='posts_blog')

# Endpoint para la gestión de comentarios
router.register(r'comentarios', ComentarioViewSet, basename='comentarios')

# 3. Definir los patrones de URL
# Incluimos todas las rutas generadas automáticamente por el router.
urlpatterns = [
    path('', include(router.urls)),
]