function onChange(control, oldValue, newValue, isLoading) {
	if (newValue == '') {
		// Clear requestor information
		g_form.clearValue('variables.employee_name');
		g_form.clearValue('variables.employee_number');
		g_form.clearValue('variables.facility_dept_num');
	} else {
		// Find the users information
		var grUser = g_form.getReference('variables.requested_for', setUserInfo);
	}
	
	function setUserInfo(grUser) {
		// Set the users information
		if (grUser.phone) {
			g_form.setValue('variables.employee_name', grUser.name);
			g_form.setValue('variables.employee_number', grUser.u_employee_id);
		} else {
			g_form.clearValue('variables.employee_name');
			g_form.clearValue('variables.employee_number');
			g_form.clearValue('variables.facility_dept_num');
		}
	}
}