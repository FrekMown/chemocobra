from personal.settings import BASE_DIR
import os
import numpy as np
import cobra

STATIC_DIR = os.path.join(BASE_DIR, 'static', 'chemocobra')

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
    model = cobra.io.load_json_model(os.path.join(folder_models,scen['baseModelId']+'.json'))
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
    thr = 10E-6
    
    sol = cobra.flux_analysis.parsimonious.pfba(model).fluxes
    return sol[sol.apply(abs)>thr].to_dict()

def run_fva(model,reaction_id,fractionOptimum):
    """
    Returns [lower_bound,upper_bound] for a specific reaction
    """
    # res = cameo.flux_variability_analysis(model,[reaction_id],fraction_of_optimum=fractionOptimum)
    res = cobra.flux_analysis.variability.flux_variability_analysis(model,[reaction_id], 
        fraction_of_optimum=fractionOptimum)
    return {
        'min': res.loc[reaction_id,'minimum'],
        'max': res.loc[reaction_id,'maximum'],
    }

    # return {
    #     'min': res.data_frame['lower_bound'].values[0],
    #     'max': res.data_frame['upper_bound'].values[0]
    # }