var aResponseFormArray = [];

function superFormModale(sFormJSON, sTitleOfForm, fCallbackExecute, fCallbackCheckForm) {
	
	//alert (sFormJSON);
	
	if (!IsJSONValid(sFormJSON)) {
		alert ("Erreur inattendue...\n\nLe formulaire ne peut pas être affiché car la chaîne qui l'ouvre n'est pas valide.")
		return "";
	}
	displayForm();
	// il faut un test ici pour vérifier que tous les "name" reçus (autres que ceux des radios) sont uniques 
	buildForm();
	
	function displayForm() {
		oDOMModale = document.createElement("div");
		oDOMModale.id = "frameOfSuperForm";
		document.body.appendChild(oDOMModale);
		
		oDOMActiveWindow = document.createElement("div");
		oDOMActiveWindow.id = "activeWindow";
		oDOMModale.appendChild(oDOMActiveWindow);
		
		oDOMTitleForm = document.createElement("div");
		oDOMTitleForm.id = "titleOfForm";
		oDOMTitleForm.innerHTML = sTitleOfForm;
		oDOMActiveWindow.appendChild(oDOMTitleForm);		

		oDOMElementBr = document.createElement("Br");
		oDOMActiveWindow.appendChild(oDOMElementBr);

		oDOMForm = document.createElement("form");
		oDOMForm.id = "superForm";
		oDOMActiveWindow.appendChild(oDOMForm);		
	}
	
	function buildForm() {
		oForm = JSON.parse(sFormJSON);
		
		for (var rankInForm = 0 ; rankInForm < oForm.length ; rankInForm++) {
			var FormHTMLType = oForm[rankInForm].HTMLType ? oForm[rankInForm].HTMLType : "input"
			
			var oDOMForm = document.createElement(FormHTMLType);				
			
			oDOMForm.name = oForm[rankInForm].name;

			if (FormHTMLType === "select") { // si de type select
				for (var k = 0; k < oForm[rankInForm].options.length; k++) {
					var eDOMOption = document.createElement("option");
					eDOMOption.text = oForm[rankInForm].options[k];
					oDOMForm.options.add(eDOMOption);
				}
			}
			
			for (attribute in oForm[rankInForm].attributes) {
				oDOMForm[attribute] = oForm[rankInForm].attributes[attribute];
			}				

			oDOMForm.style.display = 'block';
			
			if (oForm[rankInForm].attributes.type === undefined) { // donc si tout type de form autre que radio 
				var oDOMFormItemLabel = document.createElement("div");
				oDOMFormItemLabel.id = 'formItem'+ rankInForm; 
				oDOMFormItemLabel.className = "FormItemLabel";
				oDOMFormItemLabel.innerHTML = oForm[rankInForm].label; 
				document.getElementById("superForm").appendChild(oDOMFormItemLabel);
				document.getElementById("superForm").appendChild(oDOMForm);
			}
			else if (oForm[rankInForm].attributes.type === "radio") {
				if (oForm[rankInForm].labelForAllRadioList !== undefined) { // on affiche le label de la liste une seule fois
					var oDOMFormItemLabel = document.createElement("div");
					oDOMFormItemLabel.id = 'formItem'+ rankInForm; 
					oDOMFormItemLabel.className = "FormItemLabel";
					oDOMFormItemLabel.innerHTML = oForm[rankInForm].labelForAllRadioList;
					document.getElementById("superForm").appendChild(oDOMFormItemLabel);			
				}
				if (oForm[rankInForm].checked) {
					oDOMForm.checked = true;
				}
				document.getElementById("superForm").appendChild(oDOMForm);
				var oDOMRadioLabel = document.createElement("label");
				oDOMRadioLabel.htmlFor = oForm[rankInForm].attributes.id; 
				oDOMRadioLabel.className = "RadioLabelInForm";
				oDOMRadioLabel.style.backgroundColor = oForm[rankInForm].labelBackgroundColor;
				oDOMRadioLabel.innerHTML = oForm[rankInForm].label; 
				
				document.getElementById("superForm").appendChild(oDOMRadioLabel);
			}			
			if (rankInForm === 0 && oForm.length===1) {
				oDOMForm.focus();
			}

		}
		oForm = [];
	// build commandbuttons of Form
	oDOMFormCommand = document.createElement("button");
	oDOMFormCommand.id = "cancelForm";
	oDOMFormCommand.className = "formCommands";
	oDOMFormCommand.innerHTML = "Annuler";
	oDOMFormCommand.addEventListener('click', cancelForm, false);	
	oDOMActiveWindow.appendChild(oDOMFormCommand);

	oDOMFormCommand = document.createElement("button");
	oDOMFormCommand.id = "initializeForm";
	oDOMFormCommand.className = "formCommands";
	oDOMFormCommand.innerHTML = "Réinitialiser";
	oDOMFormCommand.addEventListener('click', resetForm, false);	
	oDOMActiveWindow.appendChild(oDOMFormCommand);
	
	oDOMFormCommand = document.createElement("button");
	oDOMFormCommand.id = "submitForm";
	oDOMFormCommand.className = "formCommands";
	oDOMFormCommand.innerHTML = "Envoyer";
	oDOMFormCommand.addEventListener('click', submitForm, false);	
	oDOMActiveWindow.appendChild(oDOMFormCommand);
	}

	document.getElementById("superForm").addEventListener("submit", function(e) {
		e.preventDefault();
		submitForm();
	}, false);
		
	function submitForm() {	
		var oDOMsuperForm = document.getElementById("superForm");
		var rankInForm = 0;
		var sCurrentNameRadioList = "";
		var isFirstElement = true;
		var isValueInRadioListfound = false;
		for (var i = 0 ; i <  oDOMsuperForm.elements.length ; i ++) { // on boucle dans la réponse du submit
			var oDOMFormElementI = oDOMsuperForm.elements[i];
			
			if (oDOMFormElementI.type === "radio") { // cas des boutons radio
				if (oDOMFormElementI.name!==sCurrentNameRadioList) {
					if  (isFirstElement) { // le premier élément n'a pas déjà un name, on lui en donne un
						sCurrentNameRadioList = oDOMFormElementI.name;
						isFirstElement = false;
					}
					else { // c'est donc une vraie nouvelle liste radio
						isValueInRadioListfound = false;
					}
				}
				if (oDOMFormElementI.checked) { // on cherche le button radio qui est celui sélectionné
					aResponseFormArray[rankInForm] = oDOMFormElementI.value; 
					rankInForm++;
					isValueInRadioListfound = true;
				}	
			}
			else if (oDOMFormElementI.selectedIndex!==undefined) { // cas des listes déroulantes
				aResponseFormArray[rankInForm] = oDOMFormElementI.selectedIndex;
				rankInForm++;
			} 
			else { //cas autres que button radio et element select				
				aResponseFormArray[rankInForm] = oDOMFormElementI.value;
				rankInForm++;
			}
		}

		if (fCallbackCheckForm) {
			var sResponseCheck = fCallbackCheckForm(aResponseFormArray);
			if ( sResponseCheck === "ok"){ // la function fCallbackCheckForm située hors de superFormModale doit return "ok" si tout va bien et le name de du oForm si il y a un probl�me
				hideSuperFormModale();
				fCallbackExecute(aResponseFormArray);
			}
			else {
				var k = -1; 
				for (var j = 0; j < oDOMsuperForm.elements.length ; j++) { 
					if (sResponseCheck === oDOMsuperForm.elements[j].name) {
						k = j - 1; 
					}
				}
				oDOMsuperForm.elements[k+1].focus(); // par défaut si k est resté à -1, le focus est placé @sur l'élément[0].
			}
		}	
		else {
			hideSuperFormModale();
			fCallbackExecute(aResponseFormArray);			
		}
	}
	
	function resetForm (){
		document.getElementById("superForm").reset();		
	}
	
	function hideSuperFormModale() {
		document.body.removeChild(document.getElementById("frameOfSuperForm"));
	}
	
	function cancelForm() {
		hideSuperFormModale();
		fCallbackExecute("");
	}
}