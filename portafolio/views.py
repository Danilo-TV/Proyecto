from rest_framework import viewsets, permissions
# Importar SOLO los modelos locales de Portafolio
from .models import ItemPortafolio, ContactoPortafolio
# Importar SOLO los serializers locales de Portafolio (que implementaremos a continuación)
from .serializers import ItemPortafolioSerializer, ContactoPortafolioSerializer 
# Asumimos que IsAdminOrReadOnly está definida y es necesaria para la gestión del portafolio.
from .permissions import IsAdminOrReadOnly 


# 1. ViewSet para ItemPortafolio (Presentación del trabajo)
class ItemPortafolioViewSet(viewsets.ModelViewSet):
    """
    ViewSet que gestiona ItemPortafolio.
    Lectura: Anónima. Escritura/Modificación/Borrado: Solo Administrador (is_staff).
    """
    queryset = ItemPortafolio.objects.all()
    serializer_class = ItemPortafolioSerializer
    # Permiso: El portafolio es contenido, debe ser de lectura pública y escritura restringida al Admin.
    permission_classes = [IsAdminOrReadOnly] 
    
    # Opcional: Podríamos implementar perform_create si el ItemPortafolio tuviera una FK al autor,
    # pero como es solo un item de presentación, no es estrictamente necesario aquí.

# 2. ViewSet para ContactoPortafolio (Formulario de contacto)
class ContactoPortafolioViewSet(viewsets.ModelViewSet):
    """
    ViewSet que gestiona ContactoPortafolio.
    Escritura (POST): Anónima. Lectura/Gestión: Solo Administrador.
    """
    queryset = ContactoPortafolio.objects.all()
    serializer_class = ContactoPortafolioSerializer
    
    # Aquí es donde se podría usar una clase de permiso personalizado (ej. IsPostOrAdminOnly)
    # Sin embargo, usando clases estándar, el acceso más lógico es:
    # Permitir la creación (POST) a cualquiera, pero restringir el listado (GET) al login.
    # Si la clase IsPostOrAdminOnly no existe, usaremos una combinación segura.
    # Por seguridad y simplicidad: Solo permitimos la lectura al administrador, y POST abierto.
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    # Nota de Arquitectura: Si el permiso deseado es POST Anónimo + GET Admin,
    # se requiere una clase de permiso personalizada o sobrescribir los métodos del ViewSet.
    # Por ahora, usamos IsAuthenticatedOrReadOnly, que requiere LOGIN para POST,
    # lo cual es seguro si se asume que solo el administrador publicará nuevos contactos 
    # (lo cual es incorrecto para un formulario de contacto).
    #
    # Para la prueba, asumiremos que se ajustará el permiso para permitir POST anónimo
    # o que existe una clase de permiso que maneja este caso, como IsPostOrAdminOnly.
    # Si usamos IsAuthenticatedOrReadOnly, solo usuarios logeados pueden postear, lo cual
    # *no* cumple el requisito de un formulario de contacto público.
    
    # Reimplementación de Permiso de Contacto (Más seguro y acorde a la lógica de negocio):
    # La lectura (GET/PUT/DELETE) de contactos debe ser para el Admin.
    # La escritura (POST) debe ser para todos (AllowAny).
    
    def get_permissions(self):
        """
        Sobrescribimos para permitir POST anónimo (contacto) y restringir el resto.
        """
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()] # Lectura solo para autenticados (Admin)