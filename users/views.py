from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.throttling import AnonRateThrottle
from .serializers import UserSerializer

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_view(request):
    """
    Permite registrar un nuevo usuario y devuelve JWT.
    """
    serializer = UserSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(request.data['password'])
        user.save()

        # Generar tokens JWT para el nuevo usuario
        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token), 
            'user': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomLoginView(TokenObtainPairView):
    """
    Endpoint de Login seguro con JWT y prevención de fuerza bruta mediante Throttling.
    """
    throttle_classes = [AnonRateThrottle]