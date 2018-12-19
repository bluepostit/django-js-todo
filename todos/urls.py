from django.urls import path
from . import views

app_name = 'todos'

urlpatterns = [
    path('', views.index, name='index'),
    path('<int:task_id>/', views.update_task, name='update_task'),
    path('delete-completed/', views.delete_completed, name='delete_completed')
]