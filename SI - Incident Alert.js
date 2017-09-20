// Populates the Notify field on the Incident Alert form to be used for notifications to xMatters

var IncidentAlertNotify = Class.create();
IncidentAlertNotify.prototype = {
    initialize: function() {
    },

	GetAlertGroups:function(){
		var grp = '';
		var a = current.sys_id;

		//if(a)
		var noti = new GlideRecord('contact');
		noti.addQuery('document', a);
		noti.query();
		//push results to array
		notiList = [];

	while(noti.next()){
		notiList.push(noti.group + '');
	}

	var grpname = new GlideRecord('sys_user_group');
	grpname.addQuery('sys_id', 'IN', notiList);
	grpname.query();

	while(grpname.next()){
		grp = grpname.name + ',';
	}

		return grp;

	},

    type:'GetAlertGroups'
};

var a = new IncidentAlertNotify();
gs.addInfoMessage(current.sys_id);
gs.include("IncidentAlertNotify");
  var target = current.sys_id;
var notify = a.GetAlertGroups(target);
gs.addInfoMessage(notify);
current.u_notify = notify;
current.update();
