from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permiso personalizado que concede acceso de lectura (GET, HEAD, OPTIONS) a cualquiera.
    Las operaciones de escritura (POST, PUT, DELETE) solo se permiten
    si el usuario autenticado tiene privilegios de staff (is_staff).
    """

    def has_permission(self, request, view):
        # Permite acceso de lectura (Safe Methods) a cualquier solicitud (anónima o autenticada)
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Para métodos inseguros (POST, PUT, DELETE), el usuario debe ser staff (administrador)
        # Esto asegura que solo los administradores puedan crear, modificar o eliminar posts.
        return request.user and request.user.is_staff