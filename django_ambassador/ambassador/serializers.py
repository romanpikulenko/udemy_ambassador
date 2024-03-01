from rest_framework import serializers

from core.models import Link, Order, Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class LinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Link
        fields = "__all__"


class LinkStatSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=255)
    count = serializers.SerializerMethodField()
    revenue = serializers.SerializerMethodField()

    summary = dict()

    def fill_summary(self, code):
        orders = Order.objects.filter(code=code, complete=True).all()

        count = len(orders)
        revenue = sum(o.ambassador_revenue for o in orders)

        self.summary[code] = (count, revenue)

    def get_count(self, obj):
        code = obj.code

        if not code in self.summary:
            self.fill_summary(code)

        return self.summary[code][0]

    def get_revenue(self, obj):

        code = obj.code

        if not code in self.summary:
            self.fill_summary(code)

        return self.summary[code][1]

    class Meta:
        fields = ["code", "count", "revenue"]
