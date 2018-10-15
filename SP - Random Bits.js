02822c1edbfb2200764a7deaae961928
02852275dbde03044a9f5dd5ce961967


data.update.push({
				'last_update': grApps.u_dr_plan_last_updated.toString(),
				'date_status':'fa fa-2x fa-calendar-o text-danger'
			});
			data.exercise.push({
				'last_exercise': grApps.u_dr_plan_last_exercised.toString(),
				'date_status':'fa fa-2x fa-calendar-o text-danger'
			})


(function() {

	/* Step 1. Load initial data from the server */
			/* populate the 'data' object */
			/* e.g., data.table = $sp.getValue('table'); */

	if(!input) {
		var app_table = options.table;
		var application = options.application;
		var current_time = new Date();

		data.apps = [];
		var grApps = new GlideRecord('u_disaster_recovery_dashboard');
		grApps.addQuery('it_sys_id','86822c1edbfb2200764a7deaae961924');
		grApps.query();

		while (grApps.next()){
			var zerto = grApps.comp_u_dr_replication_date;
			var zerto_date = new Date(zerto.toString());
			var diff_zerto = current_time - zerto_date;

			data.apps.push({
				'name': grApps.cirel_child.name.toUpperCase(),
				'date_info': diff_zerto,
				'date_status':'fa fa-2x fa-calendar-o text-danger'
			});
		}
	}



	/* Step 4. Process user input */

	if(input) {
		var app_table = options.table;
		var application = data.sys_id;

		data.apps = [];
		var grApps = new GlideRecord(app_table);
		grApps.addQuery('parent',application);
		grApps.query();
		grAppsList = [];

		while (grApps.next()){
			grAppsList.push(grApps.child.sys_id+'');
		}

		var grApps2 = new GlideRecord('cmdb_ci')
		grApps2.addActiveQuery();
		grApps2.addQuery('sys_id','IN',grAppsList);
		grApps2.query();

		while (grApps2.next()){
			data.apps.push({
				'name': grApps2.name.toLowerCase(),
				'sys_id': grApps2.os_domain
			});
		}
	}

})();

<form>
    <div class="datagrid" ng-if="data.apps">
      <table>
        <thead>
          <tr>
            <th>Server Name</th>
            <th>Server Status</th>
          </tr>
        </thead>
      	<tbody>
          <tr ng-repeat="s in data.apps">
            <td >{{s.name}}</td>
            <td><i class="{{s.date_status}}" style="text-align:center">{{s.date_info}}</i></td>
          </tr>
        </tbody>
      </table>
    </div>
</form>
 class="table table-sm"
.datagrid table {
  border-collapse: collapse;
  text-align: left;
  width: 100%;
}

.datagrid {
  background: #fff;
  overflow: hidden;
  border: 1px solid #8C8C8C;
  border-radius: 5px;
  width: 100%;
}

.datagrid table td, .datagrid table th {
  padding: 5px 10px;
}

.datagrid table thead th {
  background: #0099d8;
  color:#FFFFFF;
  border-left: 1px solid #A3A3A3;
}

.datagrid table thead th:first-child {
  border: none;
}

.datagrid table tbody td {

  border-left: 1px solid #DBDBDB;

}
.datagrid table tbody td i{
  margin-left: 15px;

}

function(spAppPickerPubSub) {
  /* widget controller */
  var c = this;

	spAppPickerPubSub.onAppSelect(function($application, data){
		var selectedApp = _.find(c.data.app,
								function(input){
			return input.sys_id.value == data.sys_id;
		})
		selectedApp.active=true;
	});


}




<div class="tooltip"><i class="{{s.date_status}}" style="text-align:center"></i>
  <span class="tooltiptext">Tooltip text</span>
</div>
