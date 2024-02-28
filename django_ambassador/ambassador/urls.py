from django.urls import include, path

from . import views

urlpatterns = [
    path("", include("common.urls")),
    path("products/frontend/", views.ProductfrontendAPIView.as_view()),
    path("products/backend/", views.ProductbackendAPIView.as_view()),
]
