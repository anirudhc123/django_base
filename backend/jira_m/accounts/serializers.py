from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User
import logging

logger = logging.getLogger(__name__)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            role=validated_data.get('role', 'user'),
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        logger.debug(f'Validating login for email: {email}')
        
        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)
            if not user:
                logger.warning(f'Authentication failed for email: {email}')
                raise serializers.ValidationError('Invalid email or password')
            data['user'] = user
            return data
        logger.error('Missing email or password')
        raise serializers.ValidationError('Email and password are required')