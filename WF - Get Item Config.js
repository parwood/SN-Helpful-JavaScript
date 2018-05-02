//"Copyright © 2016. Maryville Technologies ("Maryville"). All Rights Reserved. Permission to use copy, modify or distribute this software or its documentation is governed by the relevant agreement(s) between Maryville and the code-holder."

getCfgInfo();

function getCfgInfo() {
	// set default values:
	workflow.scratchpad.approvalGrp = '';
	workflow.scratchpad.taskShortDesc = '';
	workflow.scratchpad.taskDesc = '';
	workflow.scratchpad.assignmentGrp = '';
	workflow.scratchpad.sla = '';
	workflow.scratchpad.managerApproval='';
	workflow.scratchpad.ismanagerAuto = current.variables.requested_for.manager.u_auto_approval;
	workflow.scratchpad.unlisteditrequest = '';
	//The following is used to override the manager approval. This field is found in the shared variable set with no default value. If the field has any value it is assumed the manager approval is not required.
	workflow.scratchpad.managerapprovaloverride = current.variables.vs_manager_approval_override;

	workflow.scratchpad.useridmanager = current.variables.requested_for.manager.user_name;
	workflow.scratchpad.userssidmanager = current.variables.requested_for.manager;

	//Set the Requested BY and Requested For Manager Name to skip item approval requirement.
	var RequestedForManager = current.variables.requested_for.manager.user_name;
	var RequestedByName = current.variables.requested_by.user_name;
	var RequestForUserName = current.variables.requested_for.user_name;
	workflow.scratchpad.requestedforname = current.variables.requested_for.user_name;
	workflow.scratchpad.userssidmanager = current.variables.requested_for.manager;

	if (RequestForUserName == 'nouserid'){
	workflow.scratchpad.useridmanager = current.variables.req_manager_name.user_name;
	workflow.scratchpad.userssidmanager = current.variables.req_manager_name;

	workflow.scratchpad.ismanagerAuto = current.variables.req_manager_name.u_auto_approval;

	}
	if(current.variables.vs_swfv_ritm_approval_group!=""){
		// guery Group table to get Group ID
		var taskAssignGrpName = current.variables.vs_swfv_ritm_approval_group;
		var grGroup = new GlideRecord('sys_user_group');
		grGroup.addQuery('name',taskAssignGrpName);
		grGroup.addActiveQuery();
		grGroup.query();
		if (grGroup.next()) {
			workflow.scratchpad.approvalGrp = grGroup.getUniqueValue();
		}
	}

	// Get all Catalog Item Config information once
	var catItemCfg = new GlideRecord('u_catalog_item_config');
	catItemCfg.addQuery('u_catalog_item', current.cat_item);
	catItemCfg.query();
	if (catItemCfg.next()) {
		if(workflow.scratchpad.approvalGrp==""){
			workflow.scratchpad.approvalGrp = catItemCfg.u_item_approval_group;
			workflow.scratchpad.ItemApproverGrp = catItemCfg.u_item_approval_group.name;
		}
		workflow.scratchpad.managerApproval = catItemCfg.u_request_approval_needed;
		workflow.scratchpad.taskShortDesc = catItemCfg.u_task_short_description;
		workflow.scratchpad.taskDesc = catItemCfg.u_task_description;
		workflow.scratchpad.assignmentGrp = catItemCfg.u_task_assignment_group;
		workflow.scratchpad.sla = catItemCfg.u_sla;
		workflow.scratchpad.schedule = catItemCfg.u_schedule;
		workflow.scratchpad.itemname = catItemCfg.u_catalog_item.name;
			//current.variables.groupLookup
	}
	if(workflow.scratchpad.itemname == 'Unlisted IT Request'){
	workflow.scratchpad.unlisteditrequest =	current.variables.groupLookup;
	}
	//Set Requested For on the Requested Item from the variable on the form
	current.u_requested_for = current.variables.requested_for;

	if(RequestedByName == RequestedForManager){
	workflow.scratchpad.managerApproval = false;
	}
	//If the Requested By Name is the selected Manager Name. This is for No User ID approvals

	if(RequestedByName == workflow.scratchpad.useridmanager){
	workflow.scratchpad.managerApproval = false;
	}
	//If Manager auto approval is true skip approval
	if (workflow.scratchpad.ismanagerAuto == true){
	workflow.scratchpad.managerApproval = false;
	}
   //If manager approval isn't required do to a value in the catalog item submitted form.
	if (workflow.scratchpad.managerapprovaloverride != ''){
	workflow.scratchpad.managerApproval = false;
	}



}
