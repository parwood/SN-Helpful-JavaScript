function onChange(control, oldValue, newValue, isLoading) {
	if (newValue == '') {
		// Clear requestor information
		g_form.clearValue('variables.contact_phone');
	} else {
		// Find the users information
		var grUser = g_form.getReference('variables.app_support', setUserInfo);
	}
	
	function setUserInfo(grUser) {
		// Set the users information
		if (grUser.phone) {
			g_form.setValue('variables.contact_phone', grUser.phone);
		} else {
			g_form.clearValue('variables.contact_phone');
		}
	}
}