import time
from typing import Any

from django.core.management import BaseCommand
from django.db import connections
from django.db.utils import OperationalError


class Command(BaseCommand):
    def handle(self, *args: Any, **options: Any) -> str | None:
        self.stdout.write("Waiting for the database ...")

        conn = None

        while not conn:
            try:
                conn = connections["default"]
            except OperationalError:
                self.stdout.write("The database is unavailable, waiting for 1 second...")
                time.sleep(1)

        self.stdout.write(self.style.SUCCESS("The database is available"))
