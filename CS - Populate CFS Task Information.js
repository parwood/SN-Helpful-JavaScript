//Set Intermediate Variables to Pull References
function onLoad() {
	var tableName = g_form.getTableName();
	//g_form.addInfoMessage("Table Name " + tableName);
	if (tableName == 'sc_cat_item'||'ni'){
		var item_info = g_form.getUniqueValue();
		g_form.setValue('task_item', item_info);
		//g_form.addInfoMessage('sys_id ' + item_info);
		var cat_item_info = g_form.getReference('task_item', setFirstVar);
	} else {
		var cat_item_info = g_form.getReference('task_item', setFirstVar);
	}
}

//Set Needed Pre-Information
function setFirstVar(cat_item_info) {
	g_form.setValue('models', cat_item_info.model);
	//g_form.addInfoMessage('model ' + cat_item_info.sys_id);
	var model_info = g_form.getReference('models', setVars);
}


//Set Needed Post-Information
function setVars(model_info) {
	if(model_info.u_vendor){g_form.setValue('vendor_information', model_info.u_vendor);
	}else{g_form.showFieldMsg('vendor_information',"Information Not Available",'error',true);
	}

	if(model_info.u_vendor_catalog_number){g_form.setValue('vendor_cat_num', model_info.u_vendor_catalog_number);
	}else{g_form.setValue('vendor_cat_num', "Information Not Available");
	}

	if(model_info.cost){g_form.setValue('cost', model_info.cost);
	}else{g_form.setValue('cost', "Information Not Available");
	}

	if(model_info.u_peoplesoft_catalog_number){g_form.setValue('ppl_sft_cat', model_info.u_peoplesoft_catalog_number);
	}else{g_form.setValue('ppl_sft_cat', "Information Not Available");
	}

	if(model_info.u_peoplesoft_category){g_form.setValue('ppl_sft_category', model_info.u_peoplesoft_category);
	}else{g_form.setValue('ppl_sft_category', "Information Not Available");
	}

	if(model_info.u_peoplesoft_sub_category){g_form.setValue('ppl_sft_sub_cat', model_info.u_peoplesoft_sub_category);
	}else{g_form.setValue('ppl_sft_sub_cat', "Information Not Available");
	}

	if(model_info.comments){g_form.setValue('stocking_comments', model_info.comments);
	}else{g_form.setValue('stocking_comments', "Information Not Available");
	}

	if(model_info.u_purchase_unit){g_form.setValue('purchase_unit', model_info.u_purchase_unit);
	}else{g_form.setValue('purchase_unit', "Information Not Available");
	}

	if(model_info.u_conversion){g_form.setValue('conversion', model_info.u_conversion);
	}else{g_form.setValue('conversion', "Information Not Available");
	}

	if(model_info.manufacturer){g_form.setValue('manufacturer', model_info.manufacturer);
	}else{g_form.showFieldMsg('manufacturer',"Information Not Available",'error',true);
	}

	if(model_info.u_manufacturer_catalog_number){g_form.setValue('manu_cat_num', model_info.u_manufacturer_catalog_number);
	}else{g_form.setValue('manu_cat_num', "Information Not Available");
	}
}
