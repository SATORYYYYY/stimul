from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=False,
        allow_blank=True,
        validators=[UniqueValidator(
            queryset=User.objects.all(),
            message='Этот email уже зарегистрирован'
        )]
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        error_messages={
            'required': 'Пароль обязателен',
            'blank': 'Пароль не может быть пустым'
        }
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        error_messages={
            'required': 'Подтверждение пароля обязательно',
            'blank': 'Подтверждение пароля не может быть пустым'
        }
    )
    username = serializers.CharField(
        validators=[UniqueValidator(
            queryset=User.objects.all(),
            message='Это имя пользователя уже занято'
        )],
        error_messages={
            'required': 'Имя пользователя обязательно',
            'blank': 'Имя пользователя не может быть пустым'
        }
    )
    first_name = serializers.CharField(
        required=False,
        allow_blank=True,
        error_messages={
            'invalid': 'Некорректное имя'
        }
    )
    last_name = serializers.CharField(
        required=False,
        allow_blank=True,
        error_messages={
            'invalid': 'Некорректная фамилия'
        }
    )

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password2'):
            raise serializers.ValidationError("Пароли не совпадают")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2', None)
        # Remove None values
        validated_data = {k: v for k, v in validated_data.items() if v is not None}

        try:
            user = User.objects.create_user(**validated_data)
            return user
        except Exception as e:
            raise serializers.ValidationError(f'Ошибка при создании пользователя: {str(e)}')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
