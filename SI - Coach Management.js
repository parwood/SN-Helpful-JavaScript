var coachManagement = Class.create();
coachManagement.prototype = {
	initialize: function(employee) {
		this.userID = gs.getUserID();
		this.employID = employee;
	},
	getUsersCoached: function() {
		gs.info('***** ' + this.userID + ' UserID');
		gs.info('***** ' + this.employID + ' Employee');
		var grCoach = new GlideAggregate('x_inthe_employee_c_coaching_delegate_table');
		grCoach.addAggregate('COUNT');
		//grCoach.addQuery('active', 'true');
		grCoach.query();
		grCoach.next();
		gs.info('***** ' + grCoach.getAggregate('COUNT') + ' Relations Count');

		return grCoach.getAggregate('COUNT') > 0;

	},
	getValidReasons: function() {
		var managerList = this._getManagerFromCoach();
		var grReasons = new GlideAggregate('x_inthe_employee_c_coaching_reasons_table');
		grReasons.addQuery('u_manager', managerList);
		grReasons.addQuery('active', true);
		grReasons.addAggregate('COUNT');
		grReasons.query();
		grReasons.next();

		return grReasons.getAggregate('COUNT') > 0;

	},
	usrFilter: function(){
		var userList ='';
		var grUser = new GlideRecord('x_inthe_employee_c_coaching_delegate_table');
		grUser.addQuery('u_coach', this.userID);
		grUser.query();
		while (grUser.next()) {
			if (userList.length > 0) {
				userList += (',' + grUser.u_employee);
			}
			else {
				userList = '' + grUser.u_employee;
			}
		}
		return 'manager='+this.userID+'^ORsys_idIN' + userList;
	},

	getReasons: function(){
		var managerList = this._getManagerFromCoach();
		var reasonList = '';
		var grReason = new GlideRecord('x_inthe_employee_c_coaching_reasons_table');
		grReason.addQuery('u_manager', "IN", managerList.join(","));
		grReason.query();
		while (grReason.next()) {
			if (reasonList.length > 0) {
				reasonList += (',' + grReason.sys_id);
			}
			else {
				reasonList = '' + grReason.sys_id;
			}
		}
		gs.info('***** Reason List From Function ' + reasonList);
		return 'u_manager='+this.userID+'^ORsys_idIN' + reasonList;
	},

	_getManagerFromCoach: function(){
		var manager = [];
		var coach = this.userID;

		var grManagerList = new GlideRecord('x_inthe_employee_c_coaching_delegate_table');
		grManagerList.addQuery('active', true);
		grManagerList.addQuery('u_coach', coach);
		grManagerList.query();

		while(grManagerList.next()){

			manager.push(grManagerList.u_employee.manager + "");
		}
		gs.info('***** Manager List From Private Function ' + manager);
		return manager;
	},



	type: 'coachManagement'
};
