from django.http import JsonResponse

def _get_all_tasks():
    # task_objects = Task.objects.all()[:30]
    # tasks = []
    # for task_obj in task_objects:
    #     # task = task_obj.get_as_dict()
    #     task = {
    #         'id': task_obj.id,
    #         'description': task_obj.description,
    #         # etc.
    #     }
    #     tasks.append(task)
    return [
        {
            "id": 0,
            "description": "Buy concert tickets",
            "category": "home"
        }, {
            "id": 1,
            "description": "Cook lunch",
            "category": "studies"
        }
    ]


def index(request):
    if request.method == 'POST':
        # TO DO: add a new Task object
        response = {
            'tasks': _get_all_tasks(),
            'code': 200
        }
        return JsonResponse(response)


def get_all(request):
    tasks = _get_all_tasks()
    response = {
        "tasks": tasks,
        "code": 200
    }
    return JsonResponse(response)
