from random import randrange
from typing import Any

from django.core.management import BaseCommand
from faker import Faker

from core.models import Product, User


class Command(BaseCommand):
    def handle(self, *args: Any, **options: Any) -> str | None:
        faker = Faker()
        for index in range(30):
            product = Product.objects.create(
                title=faker.name(),
                description=faker.text(100),
                image=faker.image_url(),
                price=randrange(10, 100),
            )
            self.stdout.write(f"Created product {index + 1}. {product.title} ")
