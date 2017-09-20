// Return an array of sys_ids of the catalog items that are of the same
// service line list.

var GetCatalogItems = Class.create();
GetCatalogItems.prototype = {
	initialize: function() {
	},

	GetCatalogItems:function() {
		var gp = '';
		var a = current.cat_item;

		//return everything if the cat_item value is empty
		if(!a)
			return;
		//sc_cat_item has the service line list
		var gr = new GlideRecord('sc_cat_item');
		gr.addQuery('sys_id',a);
		gr.query();

		while(gr.next()) {

			var serLineList = gr.u_service_line_list;
			var gr2 = new GlideRecord('sc_cat_item');
			gr2.addQuery('u_service_line_list',serLineList);
			gr2.query();

			while(gr2.next()) {
				if (gr2.u_service_line_list == gr.u_service_line_list) {
					//build a comma separated string of groups if there is more than one
					gp += (',' + gr2.sys_id);
				}
				else {
					gp = gr.sys_id;
				}
			}
		}
		// return Groups where assigned to is in those groups we use IN for lists
		return 'sys_idIN' + gp;
	},
	type: 'GetCatalogItems'
}
