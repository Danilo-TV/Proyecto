from rest_framework import viewsets, permissions
from .models import ItemPortafolio, ContactoPortafolio
from .serializers import ItemPortafolioSerializer, ContactoPortafolioSerializer
from .permissions import IsAdminOrReadOnly, IsPostOrAdminOnly # <--- Importar las nuevas clases

class ItemPortafolioViewSet(viewsets.ModelViewSet):
    """
    GESTIÓN DE ÍTEMS DE PORTAFOLIO
    Lectura: Anónima (Para la Landing Page).
    Escritura/Modificación/Borrado: Solo Administrador (is_staff).
    """
    queryset = ItemPortafolio.objects.all()
    serializer_class = ItemPortafolioSerializer
    # Aplicar IsAdminOrReadOnly: Restringe la escritura solo al Admin.
    permission_classes = [IsAdminOrReadOnly] # <--- CAMBIO CLAVE 1

class ContactoPortafolioViewSet(viewsets.ModelViewSet):
    """
    GESTIÓN DE MENSAJES DE CONTACTO
    Creación (POST): Anónima.
    Lectura (GET), Modificación/Borrado: Solo Administrador (is_staff).
    """
    queryset = ContactoPortafolio.objects.all()
    serializer_class = ContactoPortafolioSerializer
    # Aplicar IsPostOrAdminOnly: Permite POST anónimo, el resto solo para Admin.
    permission_classes = [IsPostOrAdminOnly] # <--- CAMBIO CLAVE 2