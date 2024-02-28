from rest_framework import exceptions
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from app import settings
from common.authentication import JWTAuthentication, Scope
from common.serializers import UserSerializer
from core.models import User


class RegisterAPIView(APIView):
    def post(self, request):
        data = request.data

        if data["password"] != data["password_confirm"]:
            raise exceptions.APIException("Passwords do not match")

        data["is_ambassador"] = Scope.is_ambassador(request.path)

        serializer = UserSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class LoginAPIView(APIView):
    def post(self, request):
        email = request.data["email"]
        password = request.data["password"]

        user = User.objects.filter(email=email).first()

        if not (user and user.check_password(password)):
            raise exceptions.AuthenticationFailed("Incorrect user or password")

        scope = Scope.get_scope(request.path)

        if user.is_ambassador and scope == Scope.admin:
            raise exceptions.AuthenticationFailed("Unauthorized")

        token = JWTAuthentication.generate_jwt(user.id, scope)  # type: ignore

        response = Response()

        response.set_cookie(settings.ACCESS_TOKEN_NAME, value=token, httponly=True)
        response.data = {"message": "success"}

        return response


class UserAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        data = serializer.data

        if Scope.is_ambassador(request.path):
            data["revenue"] = user.revenue  # type: ignore

        response = Response(data)

        return response


class LogoutAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, _):
        response = Response()

        response.delete_cookie(key=settings.ACCESS_TOKEN_NAME)
        response.data = {"message": "success"}

        return response


class ProfileInfoAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request, pk=None):
        user = request.user
        serializer = UserSerializer(user, request.data, partial=True)

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class ProfilePasswordAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request, pk=None):
        user = request.user
        data = request.data

        if data["password"] != data["password_confirm"]:
            raise exceptions.APIException("Passwords do not match")

        user.set_password(data["password"])
        user.save()

        serializer = UserSerializer(user)

        return Response(serializer.data)
