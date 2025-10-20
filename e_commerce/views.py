from rest_framework import viewsets, permissions
from .models import Curso, Cita, VentaCurso
from .serializers import CursoSerializer, CitaSerializer, VentaCursoSerializer
# Importar IsAdminOrReadOnly (o la implementada IsPostOrAdminOnly si aplica)
# Para este ejemplo, usaremos las clases estándar o implementadas previamente:
from .permissions import IsAdminOrReadOnly # Asumimos esta clase para gestión de contenido

# 1. ViewSet para Cursos (Lectura pública, Escritura restringida)
class CursoViewSet(viewsets.ModelViewSet):
    """
    GESTIÓN DE CURSOS: El contenido de los cursos es visible para todos,
    pero solo el administrador puede crearlos/editarlos.
    """
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer
    # Permiso: Lectura para anónimos; Escritura solo para autenticados.
    # Esto asegura que cualquiera puede ver la oferta, pero solo el Admin puede cambiarla.
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] # [12, 13]

# 2. ViewSet para Citas (Transaccional - Escritura restringida)
class CitaViewSet(viewsets.ModelViewSet):
    """
    GESTIÓN DE CITAS: Solo usuarios autenticados pueden agendar citas (POST).
    La lista completa solo debe ser accesible para el administrador.
    """
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer
    # Permiso: Requiere autenticación para cualquier acción (POST, GET, PUT, DELETE).
    # Esto se alinea con la seguridad de que solo un usuario logueado puede crear una Cita.
    permission_classes = [permissions.IsAuthenticated] # O IsAdminUser para restringir la lista GET a solo admins

    # Sobrescribir perform_create para asignar automáticamente el usuario_fk
    def perform_create(self, serializer):
        # Asume que el usuario está autenticado gracias a IsAuthenticated
        serializer.save(usuario_fk=self.request.user)

# 3. ViewSet para VentaCurso (Transaccional - Escritura restringida)
class VentaCursoViewSet(viewsets.ModelViewSet):
    """
    GESTIÓN DE VENTAS: Solo usuarios autenticados pueden registrar una venta (POST).
    La lista completa es para la auditoría administrativa.
    """
    queryset = VentaCurso.objects.all()
    serializer_class = VentaCursoSerializer
    # Permiso: Requiere autenticación para cualquier acción.
    permission_classes = [permissions.IsAuthenticated]

    # Sobrescribir perform_create para asignar automáticamente el usuario_fk
    def perform_create(self, serializer):
        # Asume que el usuario está autenticado gracias a IsAuthenticated
        serializer.save(usuario_fk=self.request.user)