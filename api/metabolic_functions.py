import cameo
from chemocobra.settings import STATIC_DIR
import os
import numpy as np

def get_scen_from_request(request):
    baseModelId = request.query_params.get('baseModelId')
    objective = request.query_params.get('objective')
    modifReacts = request.query_params.get('modifReacts')
    scen = {'baseModelId':baseModelId, 'objective':objective}
    if modifReacts is not None:
        scen['modifReacts'] = {x.split('/')[0]:[float(x.split('/')[1]),float(x.split('/')[2])] for x in modifReacts.split(',')}
    return scen

def get_model_from_scen(scen):
    folder_models = os.path.join(STATIC_DIR,'metabolic','models')
    model = cameo.load_model(os.path.join(folder_models,scen['baseModelId']+'.json'))
    model.objective = scen['objective']
    if 'modifReacts' in scen:
        for react_id in scen['modifReacts']:
            r = model.reactions.get_by_id(react_id)
            r.lower_bound = scen['modifReacts'][react_id][0]
            r.upper_bound = scen['modifReacts'][react_id][1]
    return model

def run_pfba(model):
    """
    Returns a pandas series with fluxes for all reactions in model.
    If infeasible return all fluxes to 0.
    """
    try:
        res = cameo.pfba(model,model.objective).fluxes.to_dict()
        res = {r_id:res[r_id] for r_id in res.keys() if np.abs(res[r_id])>0.00001}
    except:
        res = {}
    return res

def run_fva(model,reaction_id):
    """
    Returns [lower_bound,upper_bound] for a specific reaction
    """
    res = cameo.flux_variability_analysis(model,[reaction_id],fraction_of_optimum=0.5)
    return [res.data_frame['lower_bound'].values[0],res.data_frame['upper_bound'].values[0]]