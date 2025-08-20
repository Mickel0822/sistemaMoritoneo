from django.urls import path
from .views import ResultadosAtencionView

urlpatterns = [
    # Endpoint para recibir los resultados de atención
    path('resultados/', ResultadosAtencionView.as_view(), name='resultados-atencion'),
]