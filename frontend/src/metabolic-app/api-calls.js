
// Runs FVA for a specific reaction given a list of scenarios
export async function runFVAforReaction(reactId, allScens, respfba, fractionOptimum) {
  let promises = allScens.map((scen) => (
    fetch(`metabolic/run_fva/?${scenAsParams(scen)}&reactId=${reactId}&fractionOpt=${fractionOptimum}`)
      .then(response=>response.json())
      .catch(response=>console.log(response))
    ));
  let result = await Promise.all(promises)
  console.log('result1', result);

  let result2 = result.map((res,counter) => (
    {
      scen: allScens[counter].id, 
      min: res.min.toFixed(3)|| 0, 
      pFBA: respfba[allScens[counter].id][reactId].toFixed(3) || 0,
      max: res.max.toFixed(3)|| 0
    }
  ));

  console.log('result2', result);
  return result2;
}

// Get available maps and models
export async function getAvailableModels() {
  let availableModels = await fetch('metabolic/see_available_models')
      .then(response => response.json())
      .catch(response => console.log(response))
  return availableModels;
}
export async function getAvailableMaps() {
  let availableMaps = await fetch('metabolic/see_available_maps')
      .then(response => response.json())
      .catch(response => console.log(response))
  return availableMaps;
}

// Run pfba and returns result
export async function runpFBA(scen) {
  let addr = `metabolic/run_pfba/?${scenAsParams(scen)}`
  let res = await fetch(addr).then(response=>response.json())
  return res;
}

// Converts scen into parameter for API
function scenAsParams(scen) {
  let addr = `baseModelId=${scen.baseModelId}&objective=${scen.objective}`
  if (Object.keys(scen.modifReacts).length>0) {
    let modifReacts = Object.keys(scen.modifReacts).map(reactId => (
      reactId+'/'+scen.modifReacts[reactId].join('/')
    )).join(',');
    addr += `&modifReacts=${modifReacts}`;
  }
  return addr;
}

export async function getMapFromId(mapId) {
  let mapOut = await fetch(`metabolic/get_map/?id=${mapId}`)
    .then(response => response.json())
    .catch(response => console.log(response));
  return mapOut;
}

export async function getModelFromId(modelId,addReactionString=false) {
  let modelOut = await fetch(`metabolic/get_model/?id=${modelId}`)
    .then(response => response.json())
    .then(model => {
      if (addReactionString) {
        let newReactions = [];
        for (let reaction of model.reactions) {
          reaction.reactionString = reactionToString(reaction);
          newReactions.push(reaction);
        }
        model.reactions = newReactions;
      }
      return model
    });
  return modelOut;  
}

function reactionToString(reaction) {
  let reactants=[], products=[], arrow='', out='';
  for (let m_id in reaction.metabolites) {
    if(reaction.metabolites[m_id]===1) products.push(m_id);
    else if (reaction.metabolites[m_id]>0) products.push(reaction.metabolites[m_id]+'*'+m_id);
    else if (reaction.metabolites[m_id]===-1) reactants.push(m_id);
    else reactants.push((-1*reaction.metabolites[m_id])+'*'+m_id);
  }
  if (reaction.lower_bound<0 && reaction.upper_bound>0) arrow = '<==>';
  else if (reaction.lower_bound>=0 && reaction.upper_bound>0) arrow = '-->';
  else if (reaction.lower_bound < 0 && reaction.upper_bound<=0) arrow = '<--'
  else arrow = '=!=';
  out = `${reactants.join(' + ')} ${arrow} ${products.join(' + ')}`;
  // console.log(reaction.id, out);
  return out;
}

