from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import register_view, CustomLoginView

urlpatterns = [
    # Rutas de autenticación
    path('register/', register_view, name='register'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]