(function executeRule(current, previous /*null when async*/) {

	var profileCheck = new GlideRecord('live_profile');
	profileCheck.addQuery('document',current.sys_id);
	profileCheck.query();

	if (!profileCheck.next()){
		var newProfile = new GlideRecord('live_profile');
		newProfile.initialize();
		newProfile.document = current.sys_id;
		newProfile.name = current.name;
		newProfile.insert();
	}

})(current, previous);