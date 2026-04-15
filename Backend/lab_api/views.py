from rest_framework.views import APIView
from rest_framework import generics
from .models import Element
from .serializers import ElementSerializer
from rest_framework.response import Response

class APIStatus(APIView):
    def get(self, request):
        return Response({"status": "Lab Backend is Online", "code": 200})

class ElementList(generics.ListAPIView):
    queryset = Element.objects.all().order_by('number') 
    serializer_class = ElementSerializer

class ElementDetail(generics.RetrieveAPIView):
    queryset = Element.objects.all()
    serializer_class = ElementSerializer
    lookup_field = 'number'