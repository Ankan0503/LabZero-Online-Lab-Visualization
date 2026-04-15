from django.urls import path
from .views import ElementList, ElementDetail, APIStatus

urlpatterns = [
    path('status/', APIStatus.as_view(), name='api-status'),
    path('elements/', ElementList.as_view(), name='element-list'),
    path('elements/<int:number>/', ElementDetail.as_view(), name='element-detail'),
]