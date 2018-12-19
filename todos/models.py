from django.db import models

class Task(models.Model):
    description = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    date_added = models.DateTimeField()
    completed = models.BooleanField(default=False)

    def get_as_dict(self):
        return {
            'id': self.id,
            'description': self.description,
            'category': self.category,
            'date_added': self.date_added,
            'completed': self.completed
        }