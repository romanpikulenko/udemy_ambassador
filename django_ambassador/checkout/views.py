import decimal

from django.db import transaction
from rest_framework import exceptions
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Link, Order, OrderItem, Product

from .serializers import LinkSerializer


class LinkAPIView(APIView):

    def get(self, request, code=""):
        link = Link.objects.get(code=code)

        serializer = LinkSerializer(link)

        return Response(serializer.data)


class OrderAPIView(APIView):
    @transaction.atomic
    def post(self, request):
        data = request.data

        link = Link.objects.filter(code=data["code"]).first()

        if not link:
            raise exceptions.APIException("Invalid code")

        order = Order(
            code=link.code,
            user=link.user,
            ambassador_email=link.user.email,
            first_name=data["first_name"],
            last_name=data["last_name"],
            email=data["email"],
            address=data["address"],
            country=data["country"],
            city=data["city"],
            zip=data["zip"],
        )

        order.save()

        data_products = data["products"]

        product_ids = (p["product_id"] for p in data_products)
        products = {product.id: product for product in Product.objects.filter(pk__in=product_ids)}  # type: ignore

        for item in data_products:
            product = products.get(item["product_id"])

            if product:
                quantity = decimal.Decimal(item["quantity"])
                order_item = OrderItem(
                    order=order,
                    product_title=product.title,
                    quantity=quantity,
                    price=product.price,
                    ambassador_revenue=decimal.Decimal(0.1) * product.price * quantity,
                    admin_revenue=decimal.Decimal(0.9) * product.price * quantity,
                )

                order_item.save()

        return Response({"message": "success"})
