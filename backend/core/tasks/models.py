from django.db import models

class Task(models.Model):

    description = models.TextField()

    status = models.CharField(
        max_length=50,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.description