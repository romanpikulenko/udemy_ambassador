import math
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
    def get(self, request):
        products = cache.get("product_backend")

        if not products:
            time.sleep(2)
            products = list(Product.objects.all())
            cache.set("product_backend", products, timeout=30 * 60)  # 60 minutes

        s: str = request.query_params.get("s", "")

        if s:
            products = list(
                [
                    p
                    for p in products
                    if (s.lower() in p.title.lower()) or (p.description and s.lower() in p.description.lower())
                ]
            )

        total = len(products)

        sort_order: str = request.query_params.get("sort", "")

        if sort_order == "asc":
            products.sort(key=lambda p: p.price)
        elif sort_order == "desc":
            products.sort(key=lambda p: p.price, reverse=True)

        per_page = 9
        page = int(request.query_params.get("page", 1))
        start = (page - 1) * per_page
        end = page * per_page

        data = ProductSerializer(products[start:end], many=True).data

        return Response(
            {
                "data": data,
                "meta": {
                    "total": total,
                    "page": page,
                    "last_page": math.ceil(total / per_page),
                },
            }
        )
