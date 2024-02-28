from django.urls import include, path

from . import views

urlpatterns = [
    path("", include("common.urls")),
    path("ambassadors/", views.AmbassadorAPIView.as_view()),
    path("products/", views.ProductGenericAPIView.as_view()),
    path("products/<str:pk>", views.ProductGenericAPIView.as_view()),
    path("users/<str:user_id>/links", views.LinkAPIView.as_view()),
]
