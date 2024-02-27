from typing import Any

from django.core.management import BaseCommand
from faker import Faker

from core.models import User


class Command(BaseCommand):
    def handle(self, *args: Any, **options: Any) -> str | None:
        faker = Faker()
        for index in range(30):
            user = User.objects.create(
                first_name=faker.first_name(),
                last_name=faker.last_name(),
                email=faker.email(),
                password="",
                is_ambassador=True,
            )
            user.set_password("1")
            user.save()
            self.stdout.write(f"Created faker {index + 1}. {user.email} ")
