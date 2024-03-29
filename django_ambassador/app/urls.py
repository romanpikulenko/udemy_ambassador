from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/admin/", include("administrator.urls")),
    path("api/ambassador/", include("ambassador.urls")),
    path("api/checkout/", include("checkout.urls")),
]
