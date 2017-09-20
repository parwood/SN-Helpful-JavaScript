function onCondition() {
	//Gather Variables Necessary for Passing to Script Include
	var user_inf = g_user.userID;
	var grp_inf = g_form.getValue('assignment_group');

	//Call GlideAjax Script Include and addParam
	var ga = new GlideAjax("CheckIsMemberOf");
	ga.addParam("sysparm_name", "AssignGroup");
	ga.addParam("sysparm_usr", user_inf);
	ga.addParam("sysparm_grp", grp_inf);
	ga.getXML(setFieldSettings);

	//Use response to set proper field attributes
	function setFieldSettings(response) {
		var answer = response.responseXML.documentElement.getAttribute("answer");
		if(grp_inf=='e3f0354d4f1f4200af76d0af0310c76e'){
			if(answer==true||g_user.hasRole('admin')){
				g_form.setDisplay('data_center_start', true);
				g_form.setMandatory('dc_num_u', true);
				g_form.setMandatory('dc_row', true);
				g_form.setMandatory('dc_rack', true);
				g_form.setMandatory('dc_unit_number', true);
				g_form.setMandatory('dc_cab_loc', true);
				g_form.setDisplay('network_start', false);
				g_form.setMandatory('net_ip_assignment', false);
				g_form.setMandatory('net_ip_assignment', false);
				g_form.setMandatory('net_vlan', false);
				g_form.setMandatory('net_qos', false);
				g_form.setMandatory('net_switch_port', false);
				g_form.setMandatory('net_cabling', false);
				g_form.setMandatory('net_switch_cab', false);
				g_form.setMandatory('net_loc', false);

			}else{
				return;
			}

		}else{
			return;
		}
	}
}

/*---------------------------------------------------------------------*/

function onCondition() {
	//Gather Variables Necessary for Passing to Script Include
	var user_inf = g_user.userID;
	var grp_inf = g_form.getValue('assignment_group');

	//Call GlideAjax Script Include and addParam
	var ga = new GlideAjax("CheckIsMemberOf");
	ga.addParam("sysparm_name", "AssignGroup");
	ga.addParam("sysparm_usr", user_inf);
	ga.addParam("sysparm_grp", grp_inf);
	ga.getXML(setFieldSettings);

	//Use response to set proper field attributes
	function setFieldSettings(response) {
		var answer = response.responseXML.documentElement.getAttribute("answer");
		if(grp_inf=='fbf0354d4f1f4200af76d0af0310c781'){
			if(answer==true||g_user.hasRole('admin')){
				g_form.setDisplay('data_center_start', true);
				g_form.setReadOnly('dc_num_u', true);
				g_form.setReadOnly('dc_row', true);
				g_form.setReadOnly('dc_rack', true);
				g_form.setReadOnly('dc_unit_number', true);
				g_form.setReadOnly('dc_cab_loc', true);
				g_form.setDisplay('network_start', true);
				g_form.setMandatory('net_cabling', true);
				g_form.setMandatory('net_ip_assignment', true);
				g_form.setMandatory('net_loc', true);
				g_form.setMandatory('net_qos', true);
				g_form.setMandatory('net_switch_cab', true);
				g_form.setMandatory('net_switch_name', true);
				g_form.setMandatory('net_switch_port', true);
				g_form.setMandatory('net_vlan', true);

			}else{
				return;
			}

		}else {
			g_form.setDisplay('data_center_start', false);
			g_form.setDisplay('network_start', false);
		}
	}
}
