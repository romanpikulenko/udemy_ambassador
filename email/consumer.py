import json
import os

import django
from confluent_kafka import Consumer
from django.core.mail import send_mail

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")
django.setup()

consumer = Consumer({"bootstrap.servers": "kafka:9092", "group.id": "mygroup", "auto.offset.reset": "earliest"})

consumer.subscribe(["default"])

while True:
    msg = consumer.poll(1.0)

    if msg is None:
        continue
    if msg.error():
        print("Consumer error: {}".format(msg.error()))
        continue

    data = msg.value().decode("utf-8")

    print("Received message: {}".format(data))

    try:
        order = json.loads(data)

        # Admin email
        send_mail(
            subject="An order has been completed",
            message=f"Order #{order['id']} with a tolal of ${order['admin_revenue']} has been completed",  # type: ignore
            from_email="from@mail.com",
            recipient_list=["admin@admin.com"],
        )

        # Ambassador email
        send_mail(
            subject="An order has been completed",
            message=f"You earned ${order['ambassador_revenue']} from the link #{order['code']}",
            from_email="from@mail.com",
            recipient_list=[order["ambassador_email"]],
        )

        print(f"Emails for order {order['id']} have been sent")
    except Exception as e:
        print(type(e))  # the exception type
        print(e.args)  # arguments stored in .args
        print(e)  # __str__ allows args to be printed directly,
        # but may be overridden in exception subclasses

consumer.close()
