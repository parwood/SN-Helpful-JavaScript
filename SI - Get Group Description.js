var IHCGetGroupDescAJAX = Class.create();
IHCGetGroupDescAJAX.prototype = Object.extendObject(AbstractAjaxProcessor, {
	getGroupDesc: function() {
		var groupDesc = '';
		var group = this.getParameter('answer');
		alert(this.getParameter('answer'));

		var grp = new GlideRecord('sys_user_group');
		grp.addQuery('name',group);
		grp.query();

		while(grp.next()){
			groupDesc = grp.description;
		}
		return groupDesc;
	},

	getGroupMembership: function(){
		gs.log('****Starting****');
		/*var userID = this.getParameter('sysparm_user');
		var grpID = this.getParameter('sysparm_group');
		var retAns = "";
		gs.log('**** ' + userID + ' *********** ' + grpID + ' ' + ' result member****');*/

		/*var grMemb = new GlideRecord('sys_user_grmember');
		grMemb.addQuery('user', userID);
		grMemb.addQuery('group', grpID);
		grMemb.query();

		if(grMemb.next()){
			gs.log('*** TRUE ***');
			retAns = true;
			return retAns;
		} else {
			return false;
		}*/
	},

	type: 'IHCGetGroupDescAJAX'
});
