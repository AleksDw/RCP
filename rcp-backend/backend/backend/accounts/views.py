from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

from .serializers import (
    CustomTokenObtainPairSerializer,
    UserSerializer,
    UserCreateSerializer
)

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        # Pracodawcy widzą wszystkich użytkowników
        if user.role == 'employer':
            return User.objects.all()
        
        # Pracownicy i technicy widzą tylko siebie
        return User.objects.filter(id=user.id)
    
    def perform_create(self, serializer):
        # Tylko pracodawcy mogą tworzyć nowych użytkowników
        if self.request.user.role != 'employer':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Tylko pracodawcy mogą tworzyć nowych użytkowników.")
        serializer.save()