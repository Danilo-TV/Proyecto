
from rest_framework import viewsets, permissions
from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import PostBlog, Comentario
from .serializers import PostBlogSerializer, ComentarioSerializer

class PostBlogViewSet(viewsets.ModelViewSet):
	queryset = PostBlog.objects.all()
	serializer_class = PostBlogSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ComentarioPermission(BasePermission):
	"""
	Permite POST a cualquier usuario, pero restringe GET/PUT/PATCH/DELETE a usuarios autenticados.
	"""
	def has_permission(self, request, view):
		if request.method == 'POST':
			return True
		return request.user and request.user.is_authenticated

class ComentarioViewSet(viewsets.ModelViewSet):
	queryset = Comentario.objects.all()
	serializer_class = ComentarioSerializer
	permission_classes = [ComentarioPermission]

# Create your views here.
