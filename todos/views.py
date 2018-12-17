from django.shortcuts import render
from django.http import JsonResponse

def get_all(request):
    tasks = [
        {
            "description": "Buy concert tickets",
            "category": "Home"
         }, {
            "description": "Cook dinner",
            "category": "Home"
         }
    ]
    response = {
        "tasks": tasks,
        "code": 200
    }
    return JsonResponse(response)
