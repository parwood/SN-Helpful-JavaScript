var GetAvailList = Class.create();
GetAvailList.prototype = {
	initialize: function() {
	},
// Return an array of rows from the List Collector List that have a service line that the logged in user is owner of
// service line list.
	GetAvailList:function() {
		var gp = '';
		var serLineList = current.u_service_line;

		//get list items form List Collector List where service line matches service line from previous query
		var gr2 = new GlideRecord('u_list_collector_lists');
		gr2.addQuery('u_service_line',serLineList);
		gr2.query();
		//gs.addInfoMessage(gr2.getRowCount());

		while(gr2.next()) {
			if (gp.length > 0) {
				gp += (',' + gr2.sys_id);
			}
			else {
				gp = '' + gr2.sys_id;
			}
		}

		// return Groups where assigned to is in those groups we use IN for lists
		return 'sys_idIN' + gp;

	},


// Return a list of SYS_ID for the logged in users group to use as a filter.
	GetGroupList:function() {
		var gp = '';
		var cur_user = gs.getUserID();

		//get list items form List Collector List where service line matches service line from previous query
		var gr2 = new GlideRecord('sys_user_group');
		gr2.addActiveQuery();
		gr2.addQuery('u_alt_group_mgr', cur_user)
		  .addOrCondition('manager', cur_user);
		gr2.query();
		//gs.addInfoMessage(gr2.getRowCount());

		while(gr2.next()) {
			gs.addInfoMessage('GP is ' + gp);
			if (gp.length > 0) {
				gp += (',' + gr2.sys_id);
			}
			else {
				gp = '' + gr2.sys_id;
			}
		}

		// return Groups where assigned to is in those groups we use IN for lists
		return 'sys_idIN^' + gp;

	},

	// Return a list of SYS_ID for the logged in users group to use as a filter.
	IsGroupManager:function() {
		var gp = '';
		var cur_user = gs.getUserID();

		//get list items form List Collector List where service line matches service line from previous query
		var gr2 = new GlideRecord('sys_user_group');
		gr2.addActiveQuery();
		gr2.addQuery('u_alt_group_mgr', cur_user)
		  .addOrCondition('manager', cur_user);
		gr2.query();
		//gs.addInfoMessage(gr2.getRowCount());

		if(gr2.hasNext()){
				gp = false;
			} else {
				gp = true;
			}

		// return Groups where assigned to is in those groups we use IN for lists
		return gp;

	},
	GetClosureCode:function() {
		//gs.addInfoMessage("Fired");
		var gp = '';
		//gs.addInfoMessage("Group ID: "+ group);
		var group_assign = current.assignment_group;
		//gs.addInfoMessage("Group Assign ID: "+ group_assign);

		//get list items form List Collector List where service line matches service line from previous query
		var gr2 = new GlideRecord('u_my_team_closure_categories');
		gr2.addActiveQuery();
		gr2.addQuery('u_group_owned',group_assign);
		gr2.query();
		//gs.addInfoMessage(gr2.getRowCount());

		while(gr2.next()) {
			if (gp.length > 0) {
				gp += (',' + gr2.sys_id);
			}
			else {
				gp = '' + gr2.sys_id;
			}
		}

		// return Groups where assigned to is in those groups we use IN for lists
		return 'sys_idIN' + gp;

	},
	// Return a list of SYS_ID for the logged in users group to use as a filter.
	GetGroupListFilter:function() {
		var cur = gs.getUserID();
		var gaOwner = new GlideAggregate('sys_user_group');
		gaOwner.addQuery('manager', cur)
		.addOrCondition('u_alt_group_mgr', cur);
		gaOwner.addQuery('sys_id', current.u_group_owned);
		gaOwner.addAggregate('COUNT');
		gaOwner.query();
		gaOwner.next();
		return gaOwner.getAggregate('COUNT') > 0;
	},
	GetIssaList:function() {
		var gp = '';
		var issaGroup = current.variables.fulfillment_group.sys_id;

		//get list items form List Collector List where service line matches service line from previous query
		var gr2 = new GlideRecord('sys_user_grmember');
		gr2.addQuery('group',issaGroup);
		gr2.query();
		//gs.addInfoMessage(issaGroup);
		//gs.addInfoMessage(gr2.getRowCount());

		while(gr2.next()) {
			if (gp.length > 0) {
				gp += (',' + gr2.sys_id);
				//gs.addInfoMessage(gr2.sys_id);
			}
			else {
				gp = '' + gr2.sys_id;
				//gs.addInfoMessage(gr2.sys_id);
			}
		}

		// return Groups where assigned to is in those groups we use IN for lists
		return 'sys_idIN' + gp;

	},
	type: 'GetAvailList'
};
