from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token # Esencial para el token
from django.shortcuts import get_object_or_404 # Para buscar usuarios
from .serializers import UserSerializer # Su serializer

# ----------------------------------------------------------------------
# 3.1. ENDPOINT DE REGISTRO (REGISTER)
# ----------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_view(request):
    """
    Permite registrar un nuevo usuario y devuelve un token.
    """
    serializer = UserSerializer(data=request.data)
    
    # 1. Validación de Serializer [12, 13]
    if serializer.is_valid():
        user = serializer.save()

        # 2. Configurar y guardar el password de forma segura (encriptada) [14]
        user.set_password(request.data['password'])
        user.save()

        # 3. Generar un token único para el nuevo usuario [15]
        token = Token.objects.create(user=user)

        # 4. Devolver el token y los datos del usuario [16]
        return Response({
            'token': token.key, 
            'user': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    # Manejo de errores de validación [13]
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ----------------------------------------------------------------------
# 3.2. ENDPOINT DE LOGIN (INICIO DE SESIÓN)
# ----------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([permissions.AllowAny]) # Permite acceso anónimo para iniciar sesión [Conversation History]
def login_view(request):
    """
    Permite el inicio de sesión, valida credenciales y devuelve el token existente o uno nuevo.
    """
    # Se debe verificar que el usuario envíe 'username' y 'password'
    
    try:
        # 1. Buscar usuario por username
        # CORRECCIÓN: Usar __iexact para ignorar mayúsculas/minúsculas y mejorar la robustez [Conversation History]
        user = get_object_or_404(User, username__iexact=request.data['username'])
    except:
        # El 404 de get_object_or_404 es manejado para retornar un mensaje claro.
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    # 2. Validar la contraseña [5, 6]
    if not user.check_password(request.data['password']):
        return Response({'error': 'invalid password'}, status=status.HTTP_400_BAD_REQUEST) # [7]

    # 3. Obtener o Crear Token [8, 9]
    # Si el usuario es válido, se obtiene su token (o se crea si no existe)
    token, created = Token.objects.get_or_create(user=user)
    
    # 4. Serializar el usuario y devolver el token [9, 10]
    serializer = UserSerializer(user)
    return Response({
        'token': token.key, # La clave del token para las rutas protegidas [2, 10]
        'user': serializer.data
    }, status=status.HTTP_200_OK) # [10]