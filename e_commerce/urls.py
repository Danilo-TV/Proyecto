from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CursoViewSet, CitaViewSet, VentaCursoViewSet, ServicioViewSet,
    IniciarPagoPayPalView, ConfirmarPagoPayPalView
)

# 1. Inicializar el Router
# El Router de DRF automáticamente genera las rutas CRUD para los ModelViewSet
router = DefaultRouter()

# 2. Registrar los ViewSets
# Se usan nombres de ruta en snake_case, alineados con las reglas del proyecto [4-6].
router.register(r'cursos', CursoViewSet, basename='curso')
router.register(r'citas', CitaViewSet, basename='cita')
router.register(r'ventas_cursos', VentaCursoViewSet, basename='ventacurso')
router.register(r'servicios', ServicioViewSet, basename='servicio')

# 3. Definir los patrones de URL
urlpatterns = [
    # Incluir todas las URLs generadas por el router para /cursos, /citas, /ventas_cursos
    path('', include(router.urls)),
    path('pagar/', IniciarPagoPayPalView.as_view(), name='pagar_paypal'),
    path('confirmar-pago/', ConfirmarPagoPayPalView.as_view(), name='confirmar_pago_paypal'),
]