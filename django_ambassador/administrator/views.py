from django.core.cache import cache
from rest_framework import generics, mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from administrator.serializers import LinkSerializer, OrderSerializer, ProductSerializer
from common import serializers
from common.authentication import JWTAuthentication
from core.models import Link, Order, Product, User


class AmbassadorAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, _):
        ambassadors = User.objects.filter(is_ambassador=True)
        serializer = serializers.UserSerializer(ambassadors, many=True)

        return Response(serializer.data)


class ProductGenericAPIView(
    generics.GenericAPIView,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get(self, request, pk=None):
        if pk:
            return self.retrieve(request, pk)

        return self.list(request)

    def post(self, request):
        response = self.create(request)
        cache.delete("products_backend")
        for key in cache.keys("*products_frontend*"):  # type: ignore
            cache.delete(key)
        return response

    def put(self, request, pk):
        response = self.partial_update(request, pk)
        cache.delete("products_backend")
        for key in cache.keys("*products_frontend*"):  # type: ignore
            cache.delete(key)

        return response

    def delete(self, request, pk=None):
        response = self.destroy(request, pk)
        cache.delete("products_backend")
        for key in cache.keys("*products_frontend*"):  # type: ignore
            cache.delete(key)

        return response


class LinkAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id=None):
        links = Link.objects.filter(user_id=user_id)
        serializer = LinkSerializer(links, many=True)

        return Response(serializer.data)


class OrderAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id=None):
        orders = Order.objects.filter(complete=True)
        serializer = OrderSerializer(orders, many=True)

        return Response(serializer.data)
