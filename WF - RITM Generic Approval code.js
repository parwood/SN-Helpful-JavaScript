var catItem = current.cat_item;
var user = current.variables.requested_for;
//gs.addInfoMessage("Cat item is " + catItem);
//gs.addInfoMessage("User is " + user);

workflow.scratchpad.answer = checkMgrBypass();

//Check the catalog item requested and if the requested for is in the fulfillment group
//Bypass Mgr approval if true
function checkMgrBypass(){
	if(catItem == '060e40894f8ca600af76d0af0310c793'){ //Generic Request
		var grMember = new GlideRecord('sys_user_grmember');
		grMember.addQuery('user', user);
		grMember.addQuery('group', '86091e154ff24200336ad49f0310c731'); //iCentra Acute Scheduling;
		grMember.query();
		if(grMember.next()){
			//gs.addInfoMessage("GlideRecord returned yes");
			current.work_notes = "Manager Approval has been bypassed based on Requested For's group membership(s)";

			return 'yes';
		}else {
			//gs.addInfoMessage("Glide Record was NOT found");
			return 'no';
		}
	} else {
		//gs.addInfoMessage("Catalog Item does not qualify for bypass");
		return 'no';
	}



}

var catItem = current.cat_item;
var user = current.variables.requested_for;
//gs.addInfoMessage("Cat item is " + catItem);
//gs.addInfoMessage("User is " + user);

workflow.scratchpad.answer = checkMgrBypass();

//Check the catalog item requested and if the requested for is in the fulfillment group
//Bypass Mgr approval if true
function checkMgrBypass(){
	if(catItem == '060e40894f8ca600af76d0af0310c793'){ //Generic Request
		var grMember = new GlideRecord('sys_user_grmember');
		grMember.addQuery('user', user);
		grMember.addQuery('group', '86091e154ff24200336ad49f0310c731'); //iCentra Acute Scheduling;
		grMember.query();
		if(grMember.next()){
			//gs.addInfoMessage("GlideRecord returned yes");
			current.work_notes = "Manager Approval has been bypassed based on Requested For's group membership(s)";

			return 'yes';
		}else {
			//gs.addInfoMessage("Glide Record was NOT found");
			return 'no';
		}
	} else if(catItem == 'e1af87e74ff78200af76d0af0310c775'){ //Generic Request
		var grMember = new GlideRecord('sys_user_grmember');
		grMember.addQuery('user', user);
		grMember.addQuery('group', '01f0f14d4f1f4200af76d0af0310c752'); //iCentra Acute Scheduling;
		grMember.query();
		if(grMember.next()){
			//gs.addInfoMessage("GlideRecord returned yes");
			current.work_notes = "Manager Approval has been bypassed based on Requested For's group membership(s)";

			return 'yes';
		}else {
			//gs.addInfoMessage("Glide Record was NOT found");
			return 'no';
		}
	} else {
		//gs.addInfoMessage("Catalog Item does not qualify for bypass");
		return 'no';
	}
}
