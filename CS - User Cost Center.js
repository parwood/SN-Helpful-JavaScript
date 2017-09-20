function onChange(control, oldValue, newValue, isLoading) {
   if (isLoading||newValue=='') {
      return;
   }
	if(typeof ('cost_center') !=='undefined'){

		var grUser = g_form.getReference('requested_for', doAjax1);

	} else if(typeof ('facility_dept_num')!=='undefined'){

		var grUser = g_form.getReference('requested_for', doAjax);

	} else {

		return;
	}

function doAjax1(grUser) {

		var grCost = grUser.cost_center;
		var ga = new GlideAjax("getCostCenter");
		ga.addParam("sysparm_name", "costCenter");
		ga.addParam("sysparm_cost_id", grCost);
		ga.getXMLAnswer(function(answer) {

			if (!answer) {
  			g_form.setValue("cost_center", '');
			}else{
	  		g_form.setValue("cost_center", answer);
 			}
		});
	}

	function doAjax(grUser) {

		var grCost = grUser.cost_center;
		var ga = new GlideAjax("getCostCenter");
		ga.addParam("sysparm_name", "costCenter");
		ga.addParam("sysparm_cost_id", grCost);
		ga.getXMLAnswer(function(answer) {

			if (!answer) {
  			g_form.setValue("facility_dept_num", '');
			}else{
	  		g_form.setValue("facility_dept_num", answer);
 			}
		});
	}



}

//Client Side

function onLoad() {
	// Find the users information
	var grUser = g_form.getReference('variables.requested_for');
	var grCost = grUser.cost_center;
	//g_form.addInfoMessage('User Record ' + grUser + ' User Cost Center ' + grCost);

	//g_form.addInfoMessage('Starting AJAX');
	var ga = new GlideAjax("getCostCenter");
	ga.addParam("sysparm_name", "costCenter");
	ga.addParam("sysparm_cost_id", grCost);
	//g_form.addInfoMessage('Finalizing AJAX');
	ga.getXML(setCostCenter);

	function setCostCenter(response) {
		//g_form.addInfoMessage("getting Info");
		var answer = response.responseXML.documentElement.getAttribute("answer");
		//g_form.addInfoMessage(answer + " cost_center");
		g_form.setValue('cost_center', answer);

	}
}
