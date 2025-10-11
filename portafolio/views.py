
from rest_framework import viewsets, permissions
from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import ItemPortafolio, ContactoPortafolio
from .serializers import ItemPortafolioSerializer, ContactoPortafolioSerializer

class ItemPortafolioViewSet(viewsets.ModelViewSet):
	queryset = ItemPortafolio.objects.all()
	serializer_class = ItemPortafolioSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ContactoPortafolioPermission(BasePermission):
	"""
	Permite POST a cualquier usuario, pero restringe GET/PUT/PATCH/DELETE a usuarios autenticados.
	"""
	def has_permission(self, request, view):
		if request.method == 'POST':
			return True
		return request.user and request.user.is_authenticated

class ContactoPortafolioViewSet(viewsets.ModelViewSet):
	queryset = ContactoPortafolio.objects.all()
	serializer_class = ContactoPortafolioSerializer
	permission_classes = [ContactoPortafolioPermission]


# Create your views here.
