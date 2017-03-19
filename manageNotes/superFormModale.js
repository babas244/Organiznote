function superFormModale(sFormJSON, sTitleOfForm, fCallbackExecute, sOutputType, fCallbackCheckForm) {
	
	displayForm();
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
		var rankInForm = 0;
		for (nameInput in oForm) {
			var FormHTMLType = oForm[nameInput].HTMLType ? oForm[nameInput].HTMLType : "input"
			
			if (FormHTMLType === "radio") {
				alert ("Formulaires radios pas encore pris en charge");
			}
			else {
				var oDOMForm = document.createElement(FormHTMLType);				
			}
			oDOMForm.name = nameInput;
			for (attribute in oForm[nameInput].attributes) {
				oDOMForm[attribute] = oForm[nameInput].attributes[attribute];
			}				

			if (FormHTMLType === "select") {
				for (var k = 0; k < oForm[nameInput].options.length; k++) {
					var eDOMOption = document.createElement("option");
					eDOMOption.text = oForm[nameInput].options[k];
					oDOMForm.options.add(eDOMOption);
				}
			}
			
			oDOMForm.style.display = 'block';
			
			var oDOMFormItemLabel = document.createElement("div");
			oDOMFormItemLabel.id = 'formItem'+ rankInForm; 
			oDOMFormItemLabel.className = "FormItemLabel";
			oDOMFormItemLabel.innerHTML = oForm[nameInput].label; 
			oDOMFormItemLabel.addEventListener('click', function (e) { // à mettre en dehors de la boucle ?
				var displayStyle = e.target.nextSibling.style.display;
				e.target.nextSibling.style.display = displayStyle === "block" ? "none" : "block";
			}, false);
			document.getElementById("superForm").appendChild(oDOMFormItemLabel);
			document.getElementById("superForm").appendChild(oDOMForm);
			oDOMElementBr = document.createElement("Br");
			document.getElementById("superForm").appendChild(oDOMElementBr);
			
			if (rankInForm === 0) {
				oDOMForm.focus();
			}
		rankInForm += 1;
		}
	// build commandbuttons of Form
	oDOMFormCommand = document.createElement("button");
	oDOMFormCommand.id = "cancelForm";
	oDOMFormCommand.className = "formCommands";
	oDOMFormCommand.innerHTML = "Annuler";
	oDOMFormCommand.addEventListener('click', hideSuperFormModale, false);	
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
		for (var i = 0 ; i <  oDOMsuperForm.elements.length ; i++) {
			var oDOMFormElementI = oDOMsuperForm.elements[i];
			//alert (i + "   " + oDOMFormElementI.selectedIndex);
			oForm[oDOMFormElementI.name].value = oDOMFormElementI.selectedIndex!==undefined ? oDOMFormElementI.selectedIndex + 1 : oDOMFormElementI.value; // le sript appellant peut tester les value de l'objet de son côté
			sResponseFormPhpAdress += oDOMFormElementI.name + "=" + oForm[oDOMFormElementI.name].value + "&"
			aResponseFormArray[i] = oForm[oDOMFormElementI.name].value
		}
		sResponseFormPhpAdress = sResponseFormPhpAdress.slice(0,-1);
		if (fCallbackCheckForm) {
			var sResponseCheck = fCallbackCheckForm();
			if ( sResponseCheck === "ok"){ // la function fCallbackCheckForm située hors de superFormModale doit return "ok" si tout va bien et le name de du oForm si il y a un probl�me
				hideSuperFormModale();
				fCallbackExecute(sOutputType === "array" ? aResponseFormArray : sResponseFormPhpAdress);
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
			fCallbackExecute(sOutputType === "array" ? aResponseFormArray : sResponseFormPhpAdress);			
		}
	}

	function resetForm (){
		document.getElementById("superForm").reset();		
	}
	
	function hideSuperFormModale() {
		document.getElementById("frameOfSuperForm").style.display = 'none';
	}	
}