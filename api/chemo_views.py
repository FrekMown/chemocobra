import api.chemo_functions as chemo_funcs
from rdkit.Chem import MolFromSmiles
from django.http import HttpResponse
import pandas as pd
from chemocobra.settings import STATIC_DIR
import os


def get_svg_metabolite(request,m_id):
    data = pd.read_csv(os.path.join(STATIC_DIR,'chemoinfo','smiles_database.csv'),index_col=0)['smiles']
    mid = '_'.join(m_id.split('_')[:-1])
    if mid in data.index:
        svg = chemo_funcs.moltosvg(MolFromSmiles(data.loc[mid]))
        return HttpResponse(svg)
    else:
        return HttpResponse("No Structure")