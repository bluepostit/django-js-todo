from django.urls import path
from . import views

app_name = 'todos'

urlpatterns = [
    path('', views.get_all, name='get_all'),
]