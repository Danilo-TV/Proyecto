from django.urls import path
from .views import register_view, login_view
# Importa sus vistas de autenticación

urlpatterns = [
    # Rutas de autenticación
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('profile/', login_view, name='profile'),  # Ejemplo de endpoint protegido
    # Nota: Puede añadir aquí también el endpoint 'profile/' protegido, 
    # utilizando los decoradores de autenticación, siguiendo el ejemplo de DRF [24].
]