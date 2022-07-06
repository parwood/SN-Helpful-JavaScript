(function executeRule(current, previous /*null when async*/ ) {

	// Add your code here
	var retVal = confirm("Please note that by continuing with this save action you will.\nalso be editing all child tests attached to this parent:");


	if(retVal ==true){

	var children = getChildren();
	updateChildren(children);

	}else{
		return;
	}


	function getChildren(){
		var childList=[];
		var changes = new GlideRecord('x_cask_user_accept_uat_tests');
		changes.addQuery('parent',current.number);
		changes.query();

		while (changes.next()){
			childList.push(changes.sys_id + '');
		}
		return childList;
	}

	function updateChildren(childArray){
		var gru = GlideScriptRecordUtil.get(current);
		var changedFields = gru.getChangedFields(); //Get changed fields with friendly names
		var changedValues = gru.getChanges(); //Get changed field values

		var makeChanges = new GlideRecord('x_cask_user_accept_uat_tests');
		makeChanges.addQuery('sys_id','IN',childArray);
		makeChanges.query();

		while (makeChanges.next()){

			for(var i = 0; i < changedValues.length; i++){
				makeChanges.changedFields[i]=changedValues[i];

			}
			makeChanges.update();
		}
	}

})(current, previous);
