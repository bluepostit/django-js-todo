from django.http import JsonResponse
from .models import Task

def _get_all_tasks():
    task_objects = Task.objects.all()[:30]
    tasks = []
    for task_obj in task_objects:
        task = task_obj.get_as_dict()
        tasks.append(task)
    return tasks


def index(request):
    if request.method == 'POST':
        code = 200
        error = None
        task_for_response = None

        task_description = request.POST.get('task[description]')
        task_category = request.POST.get('task[category]')
        task_date_added = request.POST.get('task[dateAdded]')
        if (task_description is not None) and (task_category is not None)\
                and (task_date_added is not None):
            task = Task()
            task.description = task_description
            task.category = task_category
            task.date_added = task_date_added
            task.save()
            task_for_response = task.get_as_dict()
        else:
            code = 400
            error = 'No task data submitted'

        response = {
            'task': task_for_response,
            'code': code,
            'error': error
        }
        return JsonResponse(response)
    else:
        return get_all(request)


def get_all(request):
    tasks = _get_all_tasks()
    response = {
        "tasks": tasks,
        "code": 200
    }
    return JsonResponse(response)

def update_task(request, task_id):
    code = 200
    error = None
    task_for_response = None

    task = Task.objects.get(id=task_id)
    if task is None:
        code = 404
        error = f'No task found for id {task_id}'
    else:
        task_description = request.POST.get('task[description]')
        task_category = request.POST.get('task[category]')
        task_completed = request.POST.get('task[completed]')
        if (task_description is None) or (task_category is None)\
                or (task_completed is None):
            code = 400
            error = 'No task data submitted'
        else:
            task.description = task_description
            task.category = task_category
            task.completed = task_completed in ('true', 'True', '1')
            task.save()
            task_for_response = task.get_as_dict()

    response = {
        'task': task_for_response,
        'code': code,
        'error': error
    }
    return JsonResponse(response)

def delete_completed(request):
    Task.objects.filter(completed=True).delete()
    return get_all(request)