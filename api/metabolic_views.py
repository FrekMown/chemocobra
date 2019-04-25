from rest_framework.views import APIView
from rest_framework.response import Response
from chemocobra.settings import STATIC_DIR
import os
import json

class GetAvailableModels(APIView):
    """
    Returns all available models locally
    """
    def get(self,request):
        models_path = os.path.join(STATIC_DIR,'metabolic','models')
        available_models = [f.split('.')[0] for f in os.listdir(models_path) if f.endswith('.json')]
        return Response(available_models)

class GetModel(APIView):
    """
    Returns JSON representation of a metabollic model
    """
    def get(self,request):
        model_id = request.query_params.get('id')
        model_path = os.path.join(STATIC_DIR,'metabolic','models',model_id+'.json')
        with open(os.path.join(model_path)) as f:
            model = json.load(f)
        model['id'] = model_id
        return Response(model)