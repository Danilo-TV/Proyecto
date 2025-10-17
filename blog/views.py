
from rest_framework import viewsets, permissions
from .models import PostBlog, Comentario
from .serializers import PostBlogSerializer, ComentarioSerializer
from .permissions import IsAdminOrReadOnly  # <-- IMPORTAMOS EL NUEVO PERMISO
from rest_framework.permissions import IsAuthenticatedOrReadOnly


class PostBlogViewSet(viewsets.ModelViewSet):
    """
    ViewSet que gestiona PostBlog.
    Lectura: Anónima. Escritura/Modificación/Borrado: Solo Administrador (is_staff).
    """
    queryset = PostBlog.objects.all()
    serializer_class = PostBlogSerializer
    # Aplicamos el permiso estricto: Solo lectura para todos, escritura solo para staff.
    permission_classes = [IsAdminOrReadOnly] # <-- CAMBIO CLAVE

    # Opcional: Para asignar automáticamente el autor del post al usuario logeado (admin)
    def perform_create(self, serializer):
        # Asigna el usuario autenticado (que es un administrador) como autor_fk
        # Se asume que el modelo PostBlog tiene un campo autor_fk a User [5].
        serializer.save(autor_fk=self.request.user)


class ComentarioViewSet(viewsets.ModelViewSet):
    """
    ViewSet que gestiona Comentario.
    Lectura: Anónima. Escritura: Solo Usuarios Logeados.
    """
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer
    # Mantenemos IsAuthenticatedOrReadOnly, ya que se requiere login para el usuario_fk.
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    # Opcional: Para asignar automáticamente el usuario_fk al usuario logeado
    def perform_create(self, serializer):
        # Asigna el usuario autenticado (regular o admin) como autor del comentario
        # Se asume que el modelo Comentario tiene un campo usuario_fk a User [5].
        serializer.save(usuario_fk=self.request.user)
