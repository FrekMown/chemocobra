(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{54:function(e,t,n){e.exports=n(97)},59:function(e,t,n){},62:function(e,t,n){},63:function(e,t,n){},67:function(e,t,n){},68:function(e,t,n){},69:function(e,t,n){},70:function(e,t,n){},75:function(e,t,n){},76:function(e,t,n){},95:function(e,t,n){},96:function(e,t,n){},97:function(e,t,n){"use strict";n.r(t);var a=n(0),i=n.n(a),r=n(51),c=n.n(r),o=(n(59),n(26)),s=n(3),l=n.n(s),u=n(8),d=n(9),h=n(10),f=n(12),m=n(11),b=n(13),p=(n(62),i.a.createContext({})),v=(n(63),n(64),n(53)),S=function(e){function t(e){var n;return Object(d.a)(this,t),(n=Object(f.a)(this,Object(m.a)(t).call(this,e))).state={editingReactionId:""},n.inputRefUpperBound=i.a.createRef(),n.inputRefLowerBound=i.a.createRef(),n}return Object(b.a)(t,e),Object(h.a)(t,[{key:"setEditingReaction",value:function(e){this.setState({editingReactionId:e.id})}},{key:"saveEditingReaction",value:function(e){var t=this.inputRefLowerBound.current.value,n=this.inputRefUpperBound.current.value;isNaN(t)||isNaN(n)||(t=Number(t),n=Number(n),t!==e.lower_bound||n!==e.upper_bound?this.context.addModifReactionToScen(this.context.selScenId,e.id,t,n):e.id in this.context.getSelScen().modifReacts&&this.context.removeModifReactionToScen(this.context.selScenId,e.id)),this.setState({editingReactionId:""})}},{key:"cellFunctionLowerLimit",value:function(e){return e.original.id===this.state.editingReactionId?i.a.createElement("input",{type:"text",ref:this.inputRefLowerBound,defaultValue:e.original.lower_bound}):e.original.id in this.props.tableScen.modifReacts?i.a.createElement("span",{style:{color:"red",fontWeight:"bold"}},this.props.tableScen.modifReacts[e.original.id][0]):e.original.lower_bound}},{key:"cellFunctionUpperLimit",value:function(e){return e.original.id===this.state.editingReactionId?i.a.createElement("input",{type:"text",ref:this.inputRefUpperBound,defaultValue:e.original.upper_bound}):e.original.id in this.props.tableScen.modifReacts?i.a.createElement("span",{style:{color:"red",fontWeight:"bold"}},this.props.tableScen.modifReacts[e.original.id][1]):e.original.upper_bound}},{key:"cellFunctionEditLimits",value:function(e){return this.context.getSelScen()===this.props.tableScen?e.original.id===this.state.editingReactionId?i.a.createElement("div",{id:"save-button",onClick:this.saveEditingReaction.bind(this,e.original)}," Save"):i.a.createElement("div",{id:"edit-button",onClick:this.setEditingReaction.bind(this,e.original)}," Edit"):""}},{key:"render",value:function(){var e=[{Header:"Description",columns:[{Header:"ID",accessor:"id",width:80,style:{fontWeight:"bold"}},{Header:"Name",accessor:"name"},{Header:"Reaction",accessor:"reactionString"},{Header:"Genes",accessor:"genes_names"}]},{Header:"Limits",columns:[{Header:"Lower",Cell:this.cellFunctionLowerLimit.bind(this),width:50,filterable:!1,sortable:!1},{Header:"Upper",Cell:this.cellFunctionUpperLimit.bind(this),width:50,filterable:!1,sortable:!1},{Header:"Edit",Cell:this.cellFunctionEditLimits.bind(this),filterable:!1,sortable:!1,width:50}]}],t=[],n=this.props.tableScen.baseModelId;return"noModel"!==n&&Object.keys(this.context.getModel(n).length>0)&&(t=this.context.getModel(this.props.tableScen.baseModelId).reactions),i.a.createElement(v.a,{className:"-striped -highlight",data:t,columns:e,filterable:!0,defaultPageSize:15,noDataText:"Please Choose a Model Above",defaultFilterMethod:function(e,t,n){var a=e.pivotId||e.id;return void 0!==t[a]&&String(t[a]).toLowerCase().includes(e.value.toLowerCase())}})}}]),t}(a.Component);S.contextType=p;var g=function(e){function t(e){var n;return Object(d.a)(this,t),(n=Object(f.a)(this,Object(m.a)(t).call(this,e))).state={createNewScen:!0,newScenId:"New Scenario",newScenBaseModelId:"noModel",newScenObjectiveId:"",objectiveOK:!1,chosenScenId:""},n}return Object(b.a)(t,e),Object(h.a)(t,[{key:"handleChangeCreateScen",value:function(e){this.setState({createNewScen:!this.state.createNewScen})}},{key:"handleChangeScenId",value:function(e){this.setState({newScenId:e.target.value})}},{key:"handleChangeBaseModelId",value:function(){var e=Object(u.a)(l.a.mark(function e(t){return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.setState({newScenBaseModelId:t.target.value}),"noModel"!==t.target.value&&this.context.loadModel(t.target.value);case 2:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()},{key:"handleObjectiveChange",value:function(e){var t=e.target.value,n=!1;this.state.createNewScen&&"noModel"!==this.state.newScenBaseModelId&&(n=this.context.getModel(this.state.newScenBaseModelId).reactions.filter(function(e){return e.id===t}).length>0),this.setState({newScenObjectiveId:t,objectiveOK:n})}},{key:"handleSaveButton",value:function(){var e={id:this.state.newScenId,modifReacts:[],objective:this.state.newScenObjectiveId,baseModelId:this.state.newScenBaseModelId};this.context.addScen(e),this.context.setSelScenId(this.state.newScenId),this.setState({createNewScen:!1}),this.setState({newScenId:"New Scenario",newScenBaseModelId:"noModel",newScenObjectiveId:"",objectiveOK:!1})}},{key:"render",value:function(){var e=this,t={};t=this.state.createNewScen?{id:this.state.newScenId,baseModelId:this.state.newScenBaseModelId,objectiveId:this.state.newScenObjectiveId,modifReacts:[]}:this.context.getSelScen();var n,a=this.state.objectiveOK&&"noModel"!==this.state.newScenBaseModelId,r={};if(this.state.objectiveOK||(r={backgroundColor:"#fc9b8a"}),this.state.createNewScen){var c=[i.a.createElement("option",{value:"noModel",key:"noModel"},"Please Choose a Model")];c.push(this.context.allModelIds.map(function(e){return i.a.createElement("option",{key:e},e)})),n=i.a.createElement("div",{id:"new-scen-form"},i.a.createElement("div",{id:"new-scen-form-title"},"Create Scenario"),i.a.createElement("label",null,"Scenario Name",i.a.createElement("input",{type:"text",value:this.state.newScenId,onChange:this.handleChangeScenId.bind(this)})),i.a.createElement("label",null,"Base Model",i.a.createElement("select",{value:this.state.newScenBaseModelId,onChange:this.handleChangeBaseModelId.bind(this)},c)),i.a.createElement("label",null,"Objective",i.a.createElement("input",{type:"text",value:this.state.newScenObjectiveId,onChange:this.handleObjectiveChange.bind(this),style:r})),i.a.createElement("button",{disabled:!a,onClick:this.handleSaveButton.bind(this)},"Save"))}else{var o=this.context.allScens.map(function(e){return i.a.createElement("option",{key:e.id},e.id)});n=i.a.createElement("label",null,"Choose Scenario:",i.a.createElement("select",{value:this.context.selScenId,onChange:function(t){return e.context.setSelScenId(t.target.value)}},o))}return i.a.createElement("div",{id:"ModelDescription"},i.a.createElement("div",{id:"ModelForm"},i.a.createElement("label",null,"Create new Scenario ?",i.a.createElement("input",{type:"checkbox",value:this.state.createNewScen,onChange:this.handleChangeCreateScen.bind(this),checked:this.state.createNewScen})),n),i.a.createElement("div",{id:"model-table"},i.a.createElement(S,{tableScen:t})))}}]),t}(a.Component);g.contextType=p;var E=g,y=(n(67),n(68),function(e){function t(e){var n;return Object(d.a)(this,t),(n=Object(f.a)(this,Object(m.a)(t).call(this,e))).state={isSelected:!0},n}return Object(b.a)(t,e),Object(h.a)(t,[{key:"handleChangeSelected",value:function(){this.setState(function(e){return{isSelected:!e.isSelected}})}},{key:"handleRemoveScen",value:function(){this.context.removeScen(this.props.scen)}},{key:"render",value:function(){var e=this,t=Object.keys(this.props.scen.modifReacts).map(function(t){return i.a.createElement("li",{key:t},t,": ",e.props.scen.modifReacts[t][0]," ==> ",e.props.scen.modifReacts[t][1])}),n=i.a.createElement("div",null);return this.context.allScens.length>1&&(n=i.a.createElement("div",{id:"scen-element-remove",onClick:this.handleRemoveScen.bind(this)},"X")),i.a.createElement("div",{id:"ScenElement"},i.a.createElement("div",{id:"scen-element-first-row"},i.a.createElement("div",{id:"scen-element-title"},this.props.scen.id),n),i.a.createElement("div",{id:"scen-element-second-row"},i.a.createElement("div",{id:"scen-element-model"},i.a.createElement("span",{style:{fontWeight:"bold"}},"Model:")," ",this.props.scen.baseModelId),i.a.createElement("div",{id:"scen-element-objective"},i.a.createElement("span",{style:{fontWeight:"bold"}},"Objective:")," ",this.props.scen.objective)),i.a.createElement("div",{id:"scen-element-reactions"},i.a.createElement("span",{style:{textAlign:"center",fontWeight:"bold"}},"Modified Reactions:"),t))}}]),t}(a.Component));y.contextType=p;var M=y,k=function(e){function t(){return Object(d.a)(this,t),Object(f.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(b.a)(t,e),Object(h.a)(t,[{key:"render",value:function(){var e=this.context.allScens.map(function(e){return i.a.createElement(M,{key:e.id,scen:e})});return i.a.createElement("div",{id:"ScenOptions"},i.a.createElement("div",{id:"scen-options-title"},"List Scenarios"),i.a.createElement("div",{id:"scen-options-elements"},e))}}]),t}(a.Component);k.contextType=p;var w=k,I=(n(69),function(e){function t(){return Object(d.a)(this,t),Object(f.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(b.a)(t,e),Object(h.a)(t,[{key:"render",value:function(){var e;return e="options"===this.context.page?"Run Model":"Options",i.a.createElement("div",{id:"Navbar"},i.a.createElement("div",{id:"Navbar-switch-button"},i.a.createElement("button",{onClick:this.context.switchMainPage,disabled:0===this.context.allScens.length},e)),i.a.createElement("div",{id:"Navbar-title"},"Metabolic Modelling"),i.a.createElement("div",{id:"Navbar-empty"}))}}]),t}(a.Component));I.contextType=p;var x=I;n(70);function j(e,t,n,a){return O.apply(this,arguments)}function O(){return(O=Object(u.a)(l.a.mark(function e(t,n,a,i){var r,c,o;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=n.map(function(e){return fetch("metabolic/run_fva/?".concat(A(e),"&reactId=").concat(t,"&fractionOpt=").concat(i)).then(function(e){return e.json()}).catch(function(e){return console.log(e)})}),e.next=3,Promise.all(r);case 3:return c=e.sent,console.log("result1",c),o=c.map(function(e,i){return{scen:n[i].id,min:e.min.toFixed(3)||0,pFBA:a[n[i].id][t]||0,max:e.max.toFixed(3)||0}}),console.log("result2",c),e.abrupt("return",o);case 8:case"end":return e.stop()}},e)}))).apply(this,arguments)}function R(){return C.apply(this,arguments)}function C(){return(C=Object(u.a)(l.a.mark(function e(){var t;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("metabolic/see_available_models").then(function(e){return e.json()}).catch(function(e){return console.log(e)});case 2:return t=e.sent,e.abrupt("return",t);case 4:case"end":return e.stop()}},e)}))).apply(this,arguments)}function N(){return _.apply(this,arguments)}function _(){return(_=Object(u.a)(l.a.mark(function e(){var t;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("metabolic/see_available_maps").then(function(e){return e.json()}).catch(function(e){return console.log(e)});case 2:return t=e.sent,e.abrupt("return",t);case 4:case"end":return e.stop()}},e)}))).apply(this,arguments)}function F(e){return B.apply(this,arguments)}function B(){return(B=Object(u.a)(l.a.mark(function e(t){var n,a;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n="metabolic/run_pfba/?".concat(A(t)),e.next=3,fetch(n).then(function(e){return e.json()});case 3:return a=e.sent,e.abrupt("return",a);case 5:case"end":return e.stop()}},e)}))).apply(this,arguments)}function A(e){var t="baseModelId=".concat(e.baseModelId,"&objective=").concat(e.objective);if(Object.keys(e.modifReacts).length>0){var n=Object.keys(e.modifReacts).map(function(t){return t+"/"+e.modifReacts[t].join("/")}).join(",");t+="&modifReacts=".concat(n)}return t}function T(e){return L.apply(this,arguments)}function L(){return(L=Object(u.a)(l.a.mark(function e(t){var n;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("metabolic/get_map/?id=".concat(t)).then(function(e){return e.json()}).catch(function(e){return console.log(e)});case 2:return n=e.sent,e.abrupt("return",n);case 4:case"end":return e.stop()}},e)}))).apply(this,arguments)}function V(e){return H.apply(this,arguments)}function H(){return(H=Object(u.a)(l.a.mark(function e(t){var n,a,i=arguments;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=i.length>1&&void 0!==i[1]&&i[1],e.next=3,fetch("metabolic/get_model/?id=".concat(t)).then(function(e){return e.json()}).then(function(e){if(n){var t=[],a=!0,i=!1,r=void 0;try{for(var c,o=e.reactions[Symbol.iterator]();!(a=(c=o.next()).done);a=!0){var s=c.value;s.reactionString=P(s),t.push(s)}}catch(l){i=!0,r=l}finally{try{a||null==o.return||o.return()}finally{if(i)throw r}}e.reactions=t}return e});case 3:return a=e.sent,e.abrupt("return",a);case 5:case"end":return e.stop()}},e)}))).apply(this,arguments)}function P(e){var t=[],n=[],a="";for(var i in e.metabolites)1===e.metabolites[i]?n.push(i):e.metabolites[i]>0?n.push(e.metabolites[i]+"*"+i):-1===e.metabolites[i]?t.push(i):t.push(-1*e.metabolites[i]+"*"+i);return a=e.lower_bound<0&&e.upper_bound>0?"<==>":e.lower_bound>=0&&e.upper_bound>0?"--\x3e":e.lower_bound<0&&e.upper_bound<=0?"<--":"=!=","".concat(t.join(" + ")," ").concat(a," ").concat(n.join(" + "))}var D=n(25),U=function(e){function t(e){var n;return Object(d.a)(this,t),(n=Object(f.a)(this,Object(m.a)(t).call(this,e))).state={selReactionId:"None",fractOptimum:.9,correctFractOpt:!0,inputfractOptimum:"0.9",dataFVA:{},tab:"info"},n}return Object(b.a)(t,e),Object(h.a)(t,[{key:"componentDidUpdate",value:function(){var e=Object(u.a)(l.a.mark(function e(t,n){return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:n.selReactionId!==this.state.selReactionId&&"None"!==this.state.selReactionId&&this.runFVASelReaction();case 1:case"end":return e.stop()}},e,this)}));return function(t,n){return e.apply(this,arguments)}}()},{key:"runFVASelReaction",value:function(){var e=Object(u.a)(l.a.mark(function e(){var t;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,j(this.state.selReactionId,this.context.allScens,this.context.respfba,.9);case 2:t=e.sent,console.log("resFVA",t),this.setState({dataFVA:t});case 5:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"validateFractOpt",value:function(e){this.setState({inputfractOptimum:e.target.value});var t=!isNaN(e.target.value);if(t){var n=Number(e.target.value);(t=t&&n>0&&n<=1)&&this.setState({fractOptimum:n})}this.setState({correctFractOpt:t})}},{key:"handleReactionChange",value:function(e){this.setState({selReactionId:e.target.value})}},{key:"handleChangeTab",value:function(e){this.setState({tab:e.target.value})}},{key:"render",value:function(){var e,t=["None"].concat(this.context.getReactionsIds()).map(function(e){return i.a.createElement("option",{key:e},e)}),n=this.context.getReactionFromId(this.state.selReactionId);return"info"===this.state.tab?e=i.a.createElement("div",{id:"reaction-infos-table"},i.a.createElement("table",null,i.a.createElement("tbody",null,i.a.createElement("tr",null,i.a.createElement("th",null,"Name:"),i.a.createElement("td",null,n.name)),i.a.createElement("tr",null,i.a.createElement("th",null,"Bounds:"),i.a.createElement("td",null,n.lower_bound," / ",n.upper_bound)),i.a.createElement("tr",null,i.a.createElement("th",null,"Genes:"),i.a.createElement("td",null,n.gene_reaction_rule)),i.a.createElement("tr",null,i.a.createElement("th",null,"Reaction:"),i.a.createElement("td",null,n.reactionString))))):"FVA"===this.state.tab&&(e=i.a.createElement("div",{id:"reaction-json-table"},i.a.createElement(D.JsonToTable,{json:this.state.dataFVA,id:"reaction-json-table"}))),i.a.createElement("div",{id:"ReactionResults"},i.a.createElement("div",{id:"reaction-results-title"},"Reactions Analysis"),i.a.createElement("div",{id:"reaction-results-form"},i.a.createElement("label",null,"Reaction?",i.a.createElement("select",{value:this.state.selReactionId,onChange:this.handleReactionChange.bind(this)},t))),i.a.createElement("div",{id:"reaction-results-radio",onChange:this.handleChangeTab.bind(this)},i.a.createElement("input",{type:"radio",value:"info",name:"radio",defaultChecked:!0})," Infos",i.a.createElement("input",{type:"radio",value:"FVA",name:"radio"})," FVA"),i.a.createElement("div",{id:"reaction-results-infos"},e))}}]),t}(a.Component);U.contextType=p;n(75);var W=function(e){function t(e){var n;return Object(d.a)(this,t),(n=Object(f.a)(this,Object(m.a)(t).call(this,e))).state={selMetaboliteId:"None",tab:"info",metabolite:{},structSVG:""},n}return Object(b.a)(t,e),Object(h.a)(t,[{key:"componentDidUpdate",value:function(){var e=Object(u.a)(l.a.mark(function e(t,n){var a,i,r;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(a=this.state.selMetaboliteId!==n.selMetaboliteId,console.log(a),!a||"None"===this.state.selMetaboliteId||this.state.metabolite==={}){e.next=10;break}return i="chemo/get_svg_metabolite/".concat(this.state.metabolite.id),e.next=6,fetch(i).then(function(e){return e.text()});case 6:r=e.sent,this.setState({structSVG:r}),e.next=11;break;case 10:"None"===this.state.selMetaboliteId&&this.setState({structSVG:""});case 11:case"end":return e.stop()}},e,this)}));return function(t,n){return e.apply(this,arguments)}}()},{key:"handleChangeTab",value:function(e){this.setState({tab:e.target.value})}},{key:"handleMetaboliteChange",value:function(e){var t=e.target.value;"None"===t?this.setState({metabolite:{},structSVG:""}):this.setState({selMetaboliteId:t,metabolite:this.context.getMetaboliteFromId(t)})}},{key:"render",value:function(){var e,t=this,n=["None"].concat(this.context.getMetaboliteIds()).map(function(e){return i.a.createElement("option",{key:e},e)});if("info"===this.state.tab)e=i.a.createElement(i.a.Fragment,null,i.a.createElement("div",{id:"metabolite-infos-table"},i.a.createElement("table",null,i.a.createElement("tbody",null,i.a.createElement("tr",null,i.a.createElement("th",null,"Name:"),i.a.createElement("td",null,this.state.metabolite.name)),i.a.createElement("tr",null,i.a.createElement("th",null,"Formula:"),i.a.createElement("td",null,this.state.metabolite.formula)),i.a.createElement("tr",null,i.a.createElement("th",null,"Structure:"),i.a.createElement("td",{onClick:function(e){return t.handleClickMNX(t.state.metabolite.MNX)}},this.state.metabolite.MNX))))),i.a.createElement("div",{id:"metabolite-structure",dangerouslySetInnerHTML:{__html:this.state.structSVG}}));else if("balance"===this.state.tab){var a={};"None"!==this.state.selMetaboliteId&&(a=this.context.getMetaboliteBalance(this.state.selMetaboliteId,0)),e=i.a.createElement(D.JsonToTable,{json:a,key:"json-table",id:"metabolite-json-table"})}return i.a.createElement("div",{id:"MetaboliteResults"},i.a.createElement("div",{id:"metabolite-results-title"},"Metabolite Analysis"),i.a.createElement("div",{id:"metabolite-results-form"},i.a.createElement("label",null,"Metabolite? :",i.a.createElement("select",{value:this.state.selMetaboliteId,onChange:this.handleMetaboliteChange.bind(this)}," ",n))),i.a.createElement("div",{id:"metabolite-results-radio",onChange:this.handleChangeTab.bind(this)},i.a.createElement("input",{type:"radio",value:"info",name:"metabolite-radio",defaultChecked:!0})," Infos",i.a.createElement("input",{type:"radio",value:"balance",name:"metabolite-radio"})," Balance"),i.a.createElement("div",{id:"metabolite-results-content"},e))}}]),t}(a.Component);W.contextType=p;n(76);var G=n(52),K=(n(95),function(e){function t(e){var n;return Object(d.a)(this,t),(n=Object(f.a)(this,Object(m.a)(t).call(this,e))).state={selMapId:"None",selMap:null},n.escherRef=i.a.createRef(),n}return Object(b.a)(t,e),Object(h.a)(t,[{key:"componentDidMount",value:function(){this.loadEscher()}},{key:"componentDidUpdate",value:function(e,t){this.state.selMapId!==t.selMapId&&this.loadEscher()}},{key:"loadEscher",value:function(){var e=this.context.getSelScen(),t=this.context.getModel(e.baseModelId),n={},a=!0,i=!1,r=void 0;try{for(var c,o=t.reactions[Symbol.iterator]();!(a=(c=o.next()).done);a=!0){var s=c.value;s.id in this.context.respfba[this.context.selScenId]?n[s.id]=this.context.respfba[this.context.selScenId][s.id]:n[s.id]=0}}catch(l){i=!0,r=l}finally{try{a||null==o.return||o.return()}finally{if(i)throw r}}null!==this.escherRef.current&&G.Builder(this.state.selMap,t,null,this.escherRef.current,{never_ask_before_quit:!0,reaction_style:["color","size","text","abs"],reaction_scale:[{type:"min",color:"#c8c8c8",size:12},{type:"max",color:"#66176d",size:20}]}).set_reaction_data([n])}},{key:"handleMapChange",value:function(){var e=Object(u.a)(l.a.mark(function e(t){var n,a;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(n=t.target.value,a={},"None"===n){e.next=8;break}return e.next=5,T(n);case 5:a=e.sent,e.next=9;break;case 8:a=null;case 9:this.setState({selMapId:n,selMap:a});case 10:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()},{key:"handleScenChange",value:function(e){var t=this.context.getScen(e.target.value);this.context.setSelScenId(t.id)}},{key:"render",value:function(){var e=[i.a.createElement("option",{key:"None"},"No map")];e.push(this.context.allMapIds.map(function(e){return i.a.createElement("option",{key:e},e)}));var t=this.context.allScens.map(function(e){return i.a.createElement("option",{key:e.id},e.id)});return i.a.createElement("div",{id:"MetabolicMap"},i.a.createElement("div",{id:"metabolic-map-form"},i.a.createElement("label",null,"Choose Scenario:",i.a.createElement("select",{value:this.context.selScenId,onChange:this.handleScenChange.bind(this)},t)),i.a.createElement("label",null,"Please select a map:",i.a.createElement("select",{onChange:this.handleMapChange.bind(this)},e))),i.a.createElement("div",{id:"metabolic-map-escher",ref:this.escherRef},"Metabolic Map"))}}]),t}(a.Component));K.contextType=p;n(96);var z=function(e){function t(e){var n;return Object(d.a)(this,t),(n=Object(f.a)(this,Object(m.a)(t).call(this,e))).setSelScenId=function(e){n.setState({selScenId:e})},n.getSelScen=function(){return""!==n.state.selScenId?n.state.allScens.filter(function(e){return e.id===n.state.selScenId})[0]:{}},n.addScen=function(e){n.setState(function(t){return{allScens:t.allScens.filter(function(t){return t.id!==e.id}).concat([e])}})},n.removeScen=function(e){n.setState(function(t){return{allScens:t.allScens.filter(function(t){return t.id!==e.id})}})},n.state={allModelIds:[],allMapIds:[],allScens:[],selScenId:"",page:"options",allModels:[],respfba:{}},n}return Object(b.a)(t,e),Object(h.a)(t,[{key:"componentDidMount",value:function(){var e=Object(u.a)(l.a.mark(function e(){var t,n;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,R();case 2:return t=e.sent,e.next=5,N();case 5:n=e.sent,this.setState({allModelIds:t,allMapIds:n});case 7:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"getMetaboliteBalance",value:function(e,t){var n=this,a={},i={},r=!0,c=!1,o=void 0;try{for(var s,l=function(){var t=s.value;i[t.id]={},n.getModel(t.baseModelId).reactions.forEach(function(r){if(e in r.metabolites&&r.id in n.state.respfba[t.id]){var c=r.metabolites[e]*n.state.respfba[t.id][r.id];i[t.id][r.id]=+c.toFixed(2),r.id in a?a[r.id]+=Math.abs(i[t.id][r.id]):a[r.id]=Math.abs(i[t.id][r.id])}})},u=this.state.allScens[Symbol.iterator]();!(r=(s=u.next()).done);r=!0)l()}catch(d){c=!0,o=d}finally{try{r||null==u.return||u.return()}finally{if(c)throw o}}return Object.keys(a).sort(function(e,t){return a[t]-a[e]}).filter(function(e){return a[e]>=t}).map(function(e){var t={reaction:e.length<20?e:e.slice(0,20)+"..."},a=!0,r=!1,c=void 0;try{for(var o,s=n.state.allScens[Symbol.iterator]();!(a=(o=s.next()).done);a=!0){var l=o.value;e in i[l.id]?t[l.id]=i[l.id][e]:t[l.id]=0}}catch(d){r=!0,c=d}finally{try{a||null==s.return||s.return()}finally{if(r)throw c}}return t})}},{key:"getMetaboliteIds",value:function(){var e=this,t=this.state.allScens.map(function(e){return e.baseModelId});t=Array.from(new Set(t));var n=[];return t.forEach(function(t){var a=e.getModel(t).metabolites.map(function(e){return e.id});n=n.concat(a)}),(n=Array.from(new Set(n))).sort(),n}},{key:"getMetaboliteFromId",value:function(e){var t=this,n=this.state.allScens.map(function(e){return e.baseModelId});n=Array.from(new Set(n));var a={};return n.forEach(function(n){var i=t.getModel(n).metabolites.filter(function(t){return t.id===e});i.length>0&&(a=i[0])}),a}},{key:"getReactionFromId",value:function(e){var t=this,n=this.state.allScens.map(function(e){return e.baseModelId});n=Array.from(new Set(n));var a={};return n.forEach(function(n){var i=t.getModel(n).reactions.filter(function(t){return t.id===e});i.length>0&&(a=i[0])}),a}},{key:"getReactionsIds",value:function(){var e=this,t=this.state.allScens.map(function(e){return e.baseModelId});t=Array.from(new Set(t));var n=[];return t.forEach(function(t){var a=e.getModel(t).reactions.map(function(e){return e.id});n=n.concat(a)}),(n=Array.from(new Set(n))).sort(),n}},{key:"addModifReactionToScen",value:function(e,t,n,a){var i=Object.assign({},this.state.allScens.filter(function(t){return t.id===e})[0]);i.modifReacts=Object(o.a)({},i.modifReacts),i.modifReacts[t]=[n,a];var r=this.state.allScens.map(function(e){return e.id===i.id?i:e});this.setState({allScens:r})}},{key:"removeModifReactionToScen",value:function(e,t){var n=Object.assign({},this.state.allScens.filter(function(t){return t.id===e})[0]);n.modifReacts=Object(o.a)({},n.modifReacts),delete n.modifReacts[t];var a=this.state.allScens.map(function(e){return e.id===n.id?n:e});this.setState({allScens:a})}},{key:"getModel",value:function(e){var t=this.state.allModels.filter(function(t){return t.id===e});return t.length>0?t[0]:{}}},{key:"getScen",value:function(e){var t=this.state.allScens.filter(function(t){return t.id===e});return t.length>0?t[0]:{}}},{key:"loadModel",value:function(){var e=Object(u.a)(l.a.mark(function e(t){var n,a;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t in this.state.allModels){e.next=6;break}return e.next=3,V(t,!0);case 3:n=e.sent,a=this.state.allModels.filter(function(e){return e.id!==t}).concat([n]),this.setState({allModels:a});case 6:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()},{key:"switchMainPage",value:function(){var e=Object(u.a)(l.a.mark(function e(){var t,n,a,i,r,c,o,s;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if("options"!==this.state.page){e.next=34;break}this.setState({page:"results"}),t={},n=!0,a=!1,i=void 0,e.prev=6,r=this.state.allScens[Symbol.iterator]();case 8:if(n=(c=r.next()).done){e.next=17;break}return o=c.value,e.next=12,F(o);case 12:s=e.sent,t[o.id]=s;case 14:n=!0,e.next=8;break;case 17:e.next=23;break;case 19:e.prev=19,e.t0=e.catch(6),a=!0,i=e.t0;case 23:e.prev=23,e.prev=24,n||null==r.return||r.return();case 26:if(e.prev=26,!a){e.next=29;break}throw i;case 29:return e.finish(26);case 30:return e.finish(23);case 31:this.setState({respfba:t}),e.next=35;break;case 34:this.setState({page:"options",respfba:{}});case 35:case"end":return e.stop()}},e,this,[[6,19,23,31],[24,,26,30]])}));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e,t=Object(o.a)({},this.state,{allModels:this.state.allModels,loadModel:this.loadModel.bind(this),setSelScenId:this.setSelScenId.bind(this),getSelScen:this.getSelScen.bind(this),addScen:this.addScen.bind(this),removeScen:this.removeScen.bind(this),getModel:this.getModel.bind(this),addModifReactionToScen:this.addModifReactionToScen.bind(this),removeModifReactionToScen:this.removeModifReactionToScen.bind(this),switchMainPage:this.switchMainPage.bind(this),getScen:this.getScen.bind(this),getReactionsIds:this.getReactionsIds.bind(this),getReactionFromId:this.getReactionFromId.bind(this),getMetaboliteIds:this.getMetaboliteIds.bind(this),getMetaboliteFromId:this.getMetaboliteFromId.bind(this),getMetaboliteBalance:this.getMetaboliteBalance.bind(this)});return"options"===this.state.page?e=i.a.createElement("div",{id:"App"},i.a.createElement(x,null),i.a.createElement("div",{id:"App-content"},i.a.createElement(E,null),i.a.createElement(w,null))):"results"===this.state.page&&0===Object.keys(this.state.respfba).length?e=i.a.createElement("div",{id:"App"},i.a.createElement(x,null),i.a.createElement("div",{id:"App-content"},i.a.createElement("div",{className:"slack"},i.a.createElement("span",{className:"slack-dot slack-dot--a"}),i.a.createElement("span",{className:"slack-dot slack-dot--b"}),i.a.createElement("span",{className:"slack-dot slack-dot--c"}),i.a.createElement("span",{className:"slack-dot slack-dot--d"})))):"results"===this.state.page&&Object.keys(this.state.respfba).length===this.state.allScens.length&&(e=i.a.createElement("div",{id:"App"},i.a.createElement(x,null),i.a.createElement("div",{id:"App-content"},i.a.createElement("div",{id:"results-left"},i.a.createElement(U,null),i.a.createElement(W,null)),i.a.createElement(K,null)))),i.a.createElement(p.Provider,{value:t},e)}}]),t}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(i.a.createElement(z,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[54,1,2]]]);
//# sourceMappingURL=main.6caf65fd.chunk.js.map