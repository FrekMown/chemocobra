from rest_framework.views import APIView
from django.views.generic import View
from rest_framework.response import Response
from chemocobra.settings import STATIC_DIR, FRONTEND_DIR
import os
import json
import api.metabolic_functions as met_funcs
from django.http import HttpResponse
from rdkit.Chem import MolFromSmiles
import pandas as pd

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
        react_id = request.query_params.get('reactId')
        fractionOpt = request.query_params.get('fractionOpt')

        return Response(met_funcs.run_fva(model,react_id,float(fractionOpt)))


class GetAvailableModels(APIView):
    """
    Returns all afuncsvailable models locally
    """
    def get(self,request):
        models_path = os.path.join(STATIC_DIR,'metabolic','models')
        available_models = [f.split('.')[0] for f in os.listdir(models_path) if f.endswith('.json')]
        return Response(available_models)

class GetAvailableMaps(APIView):
    """
    Returns all afuncsvailable models locally
    """
    def get(self,request):
        maps_path = os.path.join(STATIC_DIR,'metabolic','maps')
        available_maps = [f.split('.')[0] for f in os.listdir(maps_path) if f.endswith('.json')]
        return Response(available_maps)

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
        ## Add SMILES to metabolites
        # struct_data = pd.read_csv(os.path.join(STATIC_DIR, 'chemoinfo', 'smiles_database.csv'), index_col=0)['smiles']
        # for m in model['metabolites']:
        #     m_id = '_'.join(m['id'].split('_')[:-1])
        #     if m_id in struct_data.index:
        #         m['smiles'] = struct_data.loc[m_id].replace('/','')
        return Response(model)

class GetMap(APIView):
    """
    Returns JSON representation of a metabolic model
    """
    def get(self,request):
        map_id = request.query_params.get('id')
        map_path = os.path.join(STATIC_DIR,'metabolic','maps',map_id+'.json')
        with open(os.path.join(map_path)) as f:
            map_out = json.load(f)
        map_out[0]['map_name'] = map_id
        map_out[0]['map_id'] = map_id
        return Response(map_out)


class MetabolicAppView(View):
    """
    Serves the compiled frontend entry point.
    """
    def get(self,request):
        try:
            with open(os.path.join(FRONTEND_DIR,'build','index.html')) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            return HttpResponse('index.html in build not found', status=501)