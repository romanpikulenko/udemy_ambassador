import time

from django.core.cache import cache
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.response import Response
from rest_framework.views import APIView

from ambassador.serializers import ProductSerializer
from core.models import Product


class ProductfrontendAPIView(APIView):

    @method_decorator(cache_page(60 * 60 * 2, key_prefix="products_frontend"))
    def get(self, _):
        time.sleep(2)
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)

        return Response(serializer.data)


class ProductbackendAPIView(APIView):
    def get(self, _):
        products = cache.get("product_backend")

        if not products:
            time.sleep(2)
            products = list(Product.objects.all())
            cache.set("product_backend", products, timeout=30 * 60)  # 60 minutes

        serializer = ProductSerializer(products, many=True)

        return Response(serializer.data)
