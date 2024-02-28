import datetime
import enum
from turtle import st

import jwt
from django.utils import timezone
from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication

from app import settings
from core.models import User


class JWTAuthentication(BaseAuthentication):

    def authenticate(self, request):
        is_ambassador = Scope.is_ambassador(request.path)

        token = request.COOKIES.get(settings.ACCESS_TOKEN_NAME)

        if not token:
            return None

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("unauthenticated")

        payload_scope = payload["scope"]

        if (is_ambassador and payload_scope != Scope.ambassador.name) or (
            not is_ambassador and payload_scope != "admin"
        ):
            raise exceptions.AuthenticationFailed("invalid scope")

        user = User.objects.filter(pk=payload["user_id"]).first()

        if not user:
            raise exceptions.AuthenticationFailed("User not found")

        return (user, None)

    @staticmethod
    def generate_jwt(user_id, scope):
        iat = timezone.now()
        exp = iat + datetime.timedelta(days=1)

        payload = {
            "user_id": user_id,
            "scope": scope.name,
            "exp": exp,
            "iat": iat,
        }

        token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

        return token


class Scope(enum.Enum):
    unknown = 0
    admin = 1
    ambassador = 2

    @classmethod
    def get_scope(cls, path: str):
        if "api/admin" in path:
            return cls.admin
        if "api/ambassador" in path:
            return cls.ambassador
        return cls.unknown

    @classmethod
    def is_ambassador(cls, path: str):
        return cls.get_scope(path) == cls.ambassador
