import decimal
import json

import stripe
from django.db import transaction
from django.forms import model_to_dict
from rest_framework import exceptions
from rest_framework.response import Response
from rest_framework.views import APIView

from administrator.serializers import OrderSerializer
from app.producer import deliver_message
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

        line_items = []

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

                line_items.append(
                    {
                        "price_data": {
                            "currency": "usd",
                            "product_data": {
                                "name": product.title,
                                "description": product.description,
                                "images": [product.image],
                            },
                            "unit_amount": int(100 * product.price),
                        },
                        "quantity": quantity,
                    }
                )

        stripe.api_key = "sk_test_51OprTmD2kfc4zq5EwDdIQVQwMIW5BLdqItfacoh6YoITO7Xn2RgaqcoO0fPN53PegN61U8zTN4HaHWK1upifjWb700TlBWYCj7"

        source = stripe.checkout.Session.create(
            success_url="http://localhost:5000/success?source={CHECKOUT_SESSION_ID}",
            cancel_url="http://localhost:5000/error",
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
        )

        order.transaction_id = source["id"]

        order.save()

        return Response(source)


class OrderConfirmAPIView(APIView):
    def post(self, request):
        order = Order.objects.filter(transaction_id=request.data["source"]).first()

        if not order:
            raise exceptions.APIException("Order not found")

        order.complete = True
        order.save()

        order_data = model_to_dict(order)
        order_data["ambassador_revenue"] = str(order.ambassador_revenue)
        order_data["admin_revenue"] = str(order.admin_revenue)

        deliver_message(json.dumps(order_data))

        return Response({"message": "success"})
