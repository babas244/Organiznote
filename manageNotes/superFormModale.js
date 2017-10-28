function superFormModale(sFormJSON, sTitleOfForm, fCallbackExecute, sOutputType, fCallbackCheckForm) {
	
	//alert (sFormJSON);
	
	if (!IsJSONValid(sFormJSON)) {
		alert ("Erreur inattendue...\n\nLe formulaire ne peut pas être affiché car la chaîne qui l'ouvre n'est pas valide.")
		return "";
	}
	displayForm();
	// il faut un test ici pour vérifier que tous les "name" reçus sont uniques
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
			
			if (FormHTMLType === "radio") {
				alert ("Formulaires radios pas encore pris en charge");
			}
			else {
				var oDOMForm = document.createElement(FormHTMLType);				
			}
			oDOMForm.name = oForm[rankInForm].name;

			if (FormHTMLType === "select") {
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
			
			var oDOMFormItemLabel = document.createElement("div");
			oDOMFormItemLabel.id = 'formItem'+ rankInForm; 
			oDOMFormItemLabel.className = "FormItemLabel";
			oDOMFormItemLabel.innerHTML = oForm[rankInForm].label; 
/* 			oDOMFormItemLabel.addEventListener('click', function (e) { // à mettre en dehors de la boucle ?
				var displayStyle = e.target.nextSibling.style.display;
				e.target.nextSibling.style.display = displayStyle === "block" ? "none" : "block";
			}, false);
 */			document.getElementById("superForm").appendChild(oDOMFormItemLabel);
			document.getElementById("superForm").appendChild(oDOMForm);
			oDOMElementBr = document.createElement("Br");
			document.getElementById("superForm").appendChild(oDOMElementBr);
			
			/* if (rankInForm === 0) {
				oDOMForm.focus();
			} */	
		}
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
		var sResponseFormPhpAdress = "";
		var aResponseFormArray = [];
		var sResponseFormJson = '{';
		var rankInForm;
		var responseSuperFormModale;
		for (var i = 0 ; i <  oDOMsuperForm.elements.length ; i++) {
			var oDOMFormElementI = oDOMsuperForm.elements[i];
			//alert (i + "   " + oDOMFormElementI.selectedIndex);
			//alert (oDOMFormElementI.name); 
			/* déterminer ici le rankInForm de name parce qu'il pourrait être différent de i ???
			rankInForm = 0;
			isRank = false;
			while (!isRank) {
			} */
			
			oForm[i].value = oDOMFormElementI.selectedIndex!==undefined ? oDOMFormElementI.selectedIndex : oDOMFormElementI.value; // le sript appellant peut tester les value de l'objet de son côté
			sResponseFormPhpAdress += oDOMFormElementI.name + "=" + oForm[i].value + "&";
			aResponseFormArray[i] = oForm[i].value;
			sResponseFormJson += '"'+ oDOMFormElementI.name + '":"' + oForm[i].value +'",';
		}
		sResponseFormPhpAdress = sResponseFormPhpAdress.slice(0,-1);
		sResponseFormJson = sResponseFormJson.slice(0,-1)+'}';	
		switch (sOutputType) {
			case "array":
				responseSuperFormModale = aResponseFormArray;
			break;
			case "php":
				responseSuperFormModale = sResponseFormPhpAdress;
			break;
			case "json":
				responseSuperFormModale = sResponseFormJson;
			break;				
		}	
		
		if (fCallbackCheckForm) {
			var sResponseCheck = fCallbackCheckForm();
			if ( sResponseCheck === "ok"){ // la function fCallbackCheckForm située hors de superFormModale doit return "ok" si tout va bien et le name de du oForm si il y a un probl�me
				hideSuperFormModale();
				fCallbackExecute(responseSuperFormModale);
			}
			else {
				var k = -1; 
				for (var j = 0; j < oDOMsuperForm.elements.length ; j++) { 
					if (sResponseCheck === oDOMsuperForm.elements[j].name) {
						k = j - 1; 
					}
				}
				oDOMsuperForm.elements[k+1].focus(); // par défaut si k est resté à 1, le focus est placé @sur l'élément[0].
			}
		}	
		else {
			hideSuperFormModale();
			fCallbackExecute(responseSuperFormModale);			
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