from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class ResultadosAtencionView(APIView):
    """
    Vista para recibir los resultados de atención enviados desde el frontend.
    No almacena los datos, solo responde con un mensaje de éxito.
    """

    def post(self, request):
        # Imprime los datos recibidos para depuración (puedes quitar esto en producción)
        print("Datos recibidos:", request.data)
        # Ejemplo de acceso a los campos esperados:
        # documento = request.data.get('documento')
        # ear = request.data.get('ear')
        # head_pose = request.data.get('headPose')
        # mor = request.data.get('mor')
        # mejor = request.data.get('mejor')
        # Devuelve una respuesta de éxito
        return Response(
            {"mensaje": "Resultados recibidos correctamente."},
            status=status.HTTP_200_OK
        )