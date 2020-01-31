let escherBuilder = null;

function changeMapEscher(scen, model, respfba, selMap) {
  // Create dictionary with data for escher
  console.log({model})
  let reactionData = {}
  for (let reaction of model.reactions) {
    if (reaction.id in respfba[scen.id]) {
      reactionData[reaction.id] = respfba[scen.id][reaction.id];
    }
    else {
      reactionData[reaction.id] = 0;
    }
  }

  if (selMap) {
    escherBuilder.load_map(selMap);
    escherBuilder.set_reaction_data(reactionData);
  }



}

function loadEscher(model) {

    // Options for escher
    let escherOptions = {
      never_ask_before_quit: true,
      // reaction_style: ['color', 'size', 'text', 'abs'],
      reaction_scale: [
        { type: 'min', color: '#c8c8c8', size: 12 },
        { type: 'max', color: '#66176d', size: 20 }
      ],
      enable_keys: false,
      enable_search: false,
      
    };

    if (document.querySelector("#metabolic-map-escher")) {
      // Create escher builder
      escherBuilder = window.escher.Builder(
        null, // map_data
        model, // model_data
        null, // embedded_css
        document.querySelector("#metabolic-map-escher"), // selection
        escherOptions, // options
      );

      // console.log("escherBuilder", escherBuilder);
      // console.log("applying reaction data");
      // if (selMap && escherBuilder ) escherBuilder.set_reaction_data([reactionData]).apply(escherBuilder);

    }
  }

function clearEscher() {
  escherBuilder = null;
}