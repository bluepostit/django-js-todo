from django.shortcuts import render
from django.http import JsonResponse

def get_all(request):
    tasks = [
        {
            "description": "Buy concert tickets",
            "category": "home"
         }, {
            "description": "Cook dinner",
            "category": "studies"
         }
    ]
    response = {
        "tasks": tasks,
        "code": 200
    }
    return JsonResponse(response)
