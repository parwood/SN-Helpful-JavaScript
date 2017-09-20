function onBefore(current, previous) {
	//This function will be automatically called when this rule is processed.

	//Declare variables to get the comments last journal entry and the ritm number
	var message = current.comments;
	var ritm = current.sys_id;

	//Query the RITM table to get the info from the RITM number found above
	var target = new GlideRecord('sysapprover_approval');
	target.addQuery('sysapproval', ritm);
  var states = target.addQuery('state', 'Hold');
  states.addOrCondition('state', 'Requested');
	target.query();

	//If last journaled comments exist copy them from approval task comments to RITM comments
	while (target.next()) {

		target[comments].setJournalEntry('message');
		target.update();

	}
}
