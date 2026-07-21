var recordCount = '';

var userRecord = new GlideRecord('sys_user');
userRecord.query();

while (userRecord.next()){
	var profileCheck = new GlideRecord('live_profile');
	profileCheck.addQuery('document',userRecord.sys_id);
	profileCheck.query();

	if (!profileCheck.next()){
		var newProfile = new GlideRecord('live_profile');
		newProfile.initialize();
		newProfile.document = userRecord.sys_id;
		newProfile.name = userRecord.name;
		newProfile.insert();
		recordCount++;
	}
}

gs.info('Number of profiles created: ' + recordCount);