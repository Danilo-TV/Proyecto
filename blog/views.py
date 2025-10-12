
from rest_framework import viewsets, permissions
from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import PostBlog, Comentario
from .serializers import PostBlogSerializer, ComentarioSerializer

class PostBlogViewSet(viewsets.ModelViewSet):
    """
    ViewSet que gestiona las operaciones CRUD para PostBlog.
    Permite lectura a usuarios anónimos, pero requiere autenticación 
    para crear, actualizar o eliminar publicaciones.
    """
    queryset = PostBlog.objects.all()
    serializer_class = PostBlogSerializer
    # Permiso: Autenticado para escribir, Anónimo para leer (IsAuthenticatedOrReadOnly)
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] 

class ComentarioViewSet(viewsets.ModelViewSet):
    """
    ViewSet que gestiona las operaciones CRUD para Comentario.
    Permite lectura de comentarios a usuarios anónimos.
    Requiere que el usuario esté autenticado para crear un comentario 
    (necesario para la clave foránea 'usuario_fk' en el modelo).
    """
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer
    # Permiso corregido: Esto garantiza que la lectura (GET) es pública, 
    # pero la creación (POST) requiere login, ya que el modelo necesita el usuario autenticado.
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
