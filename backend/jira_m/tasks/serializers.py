from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'name', 'status', 'time_taken', 'due_date', 'user']
        read_only_fields = ['user']