from django.http import JsonResponse

def get_all(request):
    tasks = [
        {
            "id": 0,
            "description": "Buy concert tickets",
            "category": "home"
         }, {
            "id": 1,
            "description": "Cook dinner",
            "category": "studies"
         }
    ]
    response = {
        "tasks": tasks,
        "code": 200
    }
    return JsonResponse(response)
