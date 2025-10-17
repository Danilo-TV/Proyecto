from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Concede permiso de lectura (GET, HEAD, OPTIONS) a cualquiera (anónimo o logeado).
    Concede permiso de escritura (POST, PUT, DELETE) solo si el usuario es staff (Admin).
    """
    def has_permission(self, request, view):
        # Permite acceso de lectura (SAFE_METHODS) a todos.
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Para escritura, requiere que el usuario esté autenticado Y sea staff (Admin).
        return request.user and request.user.is_staff

class IsPostOrAdminOnly(permissions.BasePermission):
    """
    Permite el método POST (envío de contacto anónimo).
    Para los métodos GET, PUT, DELETE, requiere que el usuario sea staff (Admin).
    """
    def has_permission(self, request, view):
        # Permite POST (Creación de un contacto) a cualquier usuario (anónimo o no)
        if request.method == 'POST':
            return True
        
        # Para ver (GET), modificar (PUT/PATCH) o borrar (DELETE) los contactos, 
        # se requiere que el usuario esté autenticado Y sea staff (Admin).
        return request.user and request.user.is_staff