from django.urls import include, path

from . import views

urlpatterns = [
    path("", include("common.urls")),
    path("products/frontend/", views.ProductfrontendAPIView.as_view()),
    path("products/backend/", views.ProductbackendAPIView.as_view()),
    path("stats/", views.StatsAPIView.as_view()),
    path("rankings/", views.RankingsAPIView.as_view()),
    path("links/", views.LinkAPIView.as_view()),
]
