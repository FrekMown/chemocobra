from rest_framework.views import APIView
from rest_framework.response import Response
from chemocobra.settings import STATIC_DIR
import os
import json
import api.metabolic_functions as met_funcs

class RunpFBA(APIView):
    """
    Runs pFBA from scen described in params
    """
    def get(self,request):
        scen = met_funcs.get_scen_from_request(request)
        model = met_funcs.get_model_from_scen(scen)
        return Response(met_funcs.run_pfba(model))

class RunFVA(APIView):
    """
    Runs FVA for a specific scen and reaction
    """
    def get(self,request):
        scen = met_funcs.get_scen_from_request(request)
        model = met_funcs.get_model_from_scen(scen)
        react_id = request.query_params('reactId')
        return Response(met_funcs.run_fva(model,react_id))


class GetAvailableModels(APIView):
    """
    Returns all afuncsvailable models locally
    """
    def get(self,request):
        models_path = os.path.join(STATIC_DIR,'metabolic','models')
        available_models = [f.split('.')[0] for f in os.listdir(models_path) if f.endswith('.json')]
        return Response(available_models)

class GetModel(APIView):
    """
    Returns JSON representation of a metabolic model
    """
    def get(self,request):
        model_id = request.query_params.get('id')
        model_path = os.path.join(STATIC_DIR,'metabolic','models',model_id+'.json')
        with open(os.path.join(model_path)) as f:
            model = json.load(f)
        model['id'] = model_id
        return Response(model)