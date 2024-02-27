import datetime
from turtle import st

import jwt
from django.utils import timezone
from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication

from app import settings
from core.models import User


class JWTAuthentication(BaseAuthentication):

    def authenticate(self, request):
        token = request.COOKIES.get(settings.ACCESS_TOKEN_NAME)

        if not token:
            return None

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("unauthenticated")

        user = User.objects.filter(pk=payload["user_id"]).first()

        if not user:
            raise exceptions.AuthenticationFailed("User not found")

        return (user, None)

    @staticmethod
    def generate_jwt(user_id):
        iat = timezone.now()
        exp = iat + datetime.timedelta(days=1)

        payload = {
            "user_id": user_id,
            "exp": exp,
            "iat": iat,
        }

        token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

        return token
