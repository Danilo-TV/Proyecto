"""
URL configuration for administracion_portafolio project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('blog/', include('blog.urls')),  # Incluir las URLs de la app 'blog'
    path('portafolio/', include('portafolio.urls')),  # Incluir las URLs de la app 'portafolio'
    path('auth/', include('users.urls')),  # Incluir las URLs de la app 'auth'
    path('api-auth/', include('rest_framework.urls')),  # Añadir las URLs de autenticación de DRF
    path('e_commerce/', include('e_commerce.urls')),  # Incluir las URLs de la app 'e_commerce'
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)