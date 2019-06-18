from rdkit.Chem import rdDepictor
from rdkit.Chem.Draw import rdMolDraw2D
from rdkit import Chem

def moltosvg(mol,molSize=(450,150),kekulize=True, show_atom_number=False, **kwargs):
    mc = rdMolDraw2D.PrepareMolForDrawing(Chem.Mol(mol.ToBinary()))
    if kekulize:
        try:
            Chem.Kekulize(mc)
        except:
            mc = Chem.Mol(mol.ToBinary())
    if not mc.GetNumConformers():
        rdDepictor.Compute2DCoords(mc)
    drawer = rdMolDraw2D.MolDraw2DSVG(molSize[0],molSize[1])
    if show_atom_number:
        opts = drawer.drawOptions()
        for i in range(mc.GetNumAtoms()):
            opts.atomLabels[i] = mc.GetAtomWithIdx(i).GetSymbol()+str(i)
    drawer.DrawMolecule(mc, **kwargs)
    drawer.FinishDrawing()
    svg = drawer.GetDrawingText()
    return svg.replace('svg:','')