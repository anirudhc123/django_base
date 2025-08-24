from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from accounts.models import User  # Correct import
from tasks.models import Task
from django.db.models import Count

class AdminStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        registered_users = User.objects.count()
        active_tasks = Task.objects.exclude(status='Done').count()
        users_tasks = User.objects.annotate(task_count=Count('tasks')).values('username', 'task_count')
        
        return Response({
            'registered_users': registered_users,
            'active_tasks': active_tasks,
            'users_vs_tasks': list(users_tasks),
        })