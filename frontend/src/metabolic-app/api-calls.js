
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

