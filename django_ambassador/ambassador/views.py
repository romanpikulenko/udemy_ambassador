import math
import random
import string
import time

from django.core.cache import cache
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django_redis import get_redis_connection
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

import ambassador
from ambassador.serializers import LinkSerializer, LinkStatSerializer, ProductSerializer
from common import serializers
from common.authentication import JWTAuthentication
from core.models import Link, Product, User


class ProductfrontendAPIView(APIView):

    @method_decorator(cache_page(60 * 60 * 2, key_prefix="products_frontend"))
    def get(self, _):
        time.sleep(2)
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)

        return Response(serializer.data)


class ProductbackendAPIView(APIView):
    def get(self, request):
        products = cache.get("products_backend")

        if not products:
            time.sleep(2)
            products = list(Product.objects.all())
            cache.set("products_backend", products, timeout=30 * 60)  # 60 minutes

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


class LinkAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        serializer = LinkSerializer(
            data={
                "user": user.id,
                "code": "".join(random.choices(string.ascii_lowercase + string.digits, k=6)),
                "products": request.data["products"],
            }
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class StatsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        links = Link.objects.filter(user=user)
        serializer = LinkStatSerializer(links, many=True)

        return Response(serializer.data)


class RankingsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        con = get_redis_connection("default")

        rankings = con.zrevrangebyscore("rankings", min=0, max=1000000, withscores=True)

        data = {r[0].decode("utf-8"): r[1] for r in rankings}

        return Response(data)
