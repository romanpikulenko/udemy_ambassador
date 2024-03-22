from confluent_kafka import Producer

# producer = Producer({"bootstrap.servers": "localhost:9093"})
producer = Producer({"bootstrap.servers": "kafka:9092"})


def delivery_report(err, msg):
    """Called once for each message produced to indicate delivery result.
    Triggered by poll() or flush()."""
    if err is not None:
        print("Message delivery failed: {}".format(err))
    else:
        print("Message delivered to {} [{}]".format(msg.topic(), msg.partition()))


def deliver_message(msg):
    producer.produce("default", msg.encode("utf-8"), callback=delivery_report)
    producer.flush()
