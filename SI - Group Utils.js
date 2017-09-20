var IHCgroupUtilsAjax = Class.create();
IHCgroupUtilsAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {

	getGroupMembership: function(){
		//gs.log('****Starting****');
		var userID = this.getParameter('sysparm_user');
		var grpID = this.getParameter('sysparm_group');
		var retAns = "";
		//gs.log('**** ' + userID + ' *********** ' + grpID + ' ' + ' result member****');

		var grMemb = new GlideRecord('sys_user_grmember');
		grMemb.addQuery('user', userID);
		grMemb.addQuery('group', grpID);
		grMemb.query();

		if(grMemb.next()){
			//gs.log('*** TRUE ***');
			//retAns = true;
			return true;
		} else {
			return false;
		}
	},

    type: 'IHCgroupUtilsAjax'
});
