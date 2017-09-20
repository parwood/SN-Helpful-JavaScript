var cellularUpgradeChecker = Class.create();
cellularUpgradeChecker.prototype = Object.extendsObject(AbstractAjaxProcessor, {
	checkNum: function() {
		var mobileSysID = this.getParameter('sysparm_item');


		if(mobileSysID) {
			var mobileNum = new GlideRecord('u_cmdb_ci_phone_number');
			mobileNum.get(mobileSysID);
			var cellularPackage = {};
			cellularPackage.var1 = mobileNum.getValue('name');
			cellularPackage.var2 = mobileNum.getValue('u_upgrade_date');
			var json = new JSON();
			var data = json.encode(cellularPackage);

		}

		return data;

	},

	getDate: function() {
		var mobileSysID = this.getParameter('sysparm_item');


		if(mobileSysID) {
			var mobileNum = new GlideRecord('u_cmdb_ci_phone_number');
			mobileNum.get(mobileSysID);
			var cellularPackage = {};
			cellularPackage.var1 = mobileNum.getValue('name');
			cellularPackage.var2 = mobileNum.getValue('u_upgrade_date');
			var json = new JSON();
			var data = json.encode(cellularPackage);

		}

		return data;

	},

	type: 'cellularUpgradeChecker'
});
