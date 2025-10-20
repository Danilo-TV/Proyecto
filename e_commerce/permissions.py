from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permite el acceso de lectura (GET, HEAD, OPTIONS) a cualquier usuario (anónimo o autenticado).
    Permite el acceso de escritura (POST, PUT, DELETE) SOLAMENTE a usuarios administradores (is_staff=True).
    """

    def has_permission(self, request, view):
        # Permite la lectura para cualquier solicitud (SAFE_METHODS incluye GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True

        # Permite la escritura solo si el usuario está autenticado Y es administrador
        return request.user and request.user.is_staff

class IsPostOrAdminOnly(permissions.BasePermission):
    """
    Permite la creación de recursos (POST) para todos los usuarios (incluyendo anónimos).
    Restringe todas las demás acciones (GET, PUT, DELETE) solamente a usuarios administradores (is_staff=True).
    """

    def has_permission(self, request, view):
        # Permite el acceso de creación (POST) para todos (público/anónimo)
        if request.method == 'POST':
            return True

        # Para todas las demás acciones (Lectura, Edición, Borrado), requiere que sea administrador
        return request.user and request.user.is_staff