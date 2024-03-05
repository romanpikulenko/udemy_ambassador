from django.contrib import admin
from django.urls import include, path

from . import views

urlpatterns = [
    path("register/", views.RegisterAPIView.as_view()),
    path("login/", views.LoginAPIView.as_view()),
    path("user/", views.UserAPIView.as_view()),
    path("logout/", views.LogoutAPIView.as_view()),
    path("users/info/", views.ProfileInfoAPIView.as_view()),
    path("users/password/", views.ProfilePasswordAPIView.as_view()),
]
