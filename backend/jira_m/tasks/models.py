from django.db import models
from django.contrib.auth import get_user_model

class Task(models.Model):
    STATUS_CHOICES = (
        ('To Do', 'To Do'),
        ('In Progress', 'In Progress'),
        ('Done', 'Done'),
    )
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='To Do')
    time_taken = models.IntegerField(default=0)
    due_date = models.DateField(null=True, blank=True)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='tasks')
    created_at = models.DateTimeField(auto_now_add=True, null=True)  # Add null=True
    updated_at = models.DateTimeField(auto_now=True, null=True)      # Add null=True