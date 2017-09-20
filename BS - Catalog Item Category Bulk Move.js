/*Add Service Catalog to the list of catalogs to each item in a particular category*/
var gr = new GlideRecord("sc_cat_item");
gr.addQuery('active', 'true');
gr.addQuery('category', '30ad36ed4f7c1200af76d0af0310c7e5');
gr.query();
gs.addInfoMessage(gr.getRowCount());
var counting = 1;
	
	while(gr.next())  {
		gr.setDisplayValue('sc_catalogs','Hardware,Service Catalog');
 		gr.update();
		gs.log("On Record " + counting);
		counting++;
	}

/*Add the proper category to the list of categories for each catalog item in a particular category*/	
var gr = new GlideRecord('sc_cat_item');  
gr.addQuery('active', 'true');
gr.addQuery('category', '30ad36ed4f7c1200af76d0af0310c7e5');  
gr.query();  
gs.addInfoMessage(gr.getRowCount());
var counting = 1;

	while(gr.next()){  
		//Create a new group relationship record for this user  
		var rec1 = new GlideRecord('sc_cat_item_category');  
		rec1.initialize();  
		rec1.sc_cat_item = gr.sys_id;  
		rec1.sc_category.setDisplayValue('219997044fe11600f5f3d49f0310c7f8');  
		rec1.insert();  
		gs.log("On Record " + counting);
		counting++;
	} 