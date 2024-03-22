import json

from confluent_kafka import Consumer
from django.core.mail import send_mail

c = Consumer({"bootstrap.servers": "kafka:9092", "group.id": "mygroup", "auto.offset.reset": "earliest"})

c.subscribe(["default"])

while True:
    msg = c.poll(1.0)

    if msg is None:
        continue
    if msg.error():
        print("Consumer error: {}".format(msg.error()))
        continue

    data = msg.value().decode("utf-8")

    print("Received message: {}".format(data))

c.close()
