//SCRIPT INCLUDE Must be available to all application scopes if using outside of scope.
//SCRIPT INCLUDE Must be client callable.

var getPurchaseOrderData = Class.create();
getPurchaseOrderData.prototype = Object.extendsObject(global.AbstractAjaxProcessor, {

	getPurchaseData: function(){
		var po = this.getParameter('purchase_order');
		if(po){
			var poData = new GlideRecord('x_nuvo_cppm_purchase_order');
			poData.get(po);

			var figures ={};
			figures.perc_draw = poData.percent_drawn.toString();
			figures.dollars = poData.total.amount.toString();
			var json = new global.JSON();
			var data = json.encode(figures);
		}
		return data;
	},

	type: 'getPurchaseOrderData'
});


//USE GlideAjax in Client Script

var po = g_form.getValue('purchase_order');

var ga = new GlideAjax('x_nuvo_eam.getPurchaseOrderData');
ga.addParam('sysparm_name', 'getPurchaseData');
ga.addParam('purchase_order', po);
ga.getXMLAnswer(HelloWorldParse);

function HelloWorldParse(response) {
	var answer = JSON.parse(response);
	if(answer.dollars==''){
		g_form.setValue('po_dollars','0');
	}else{
		g_form.setValue('po_dollars',answer.dollars);
	}
	if(answer.perc_draw==''){
		g_form.setValue('po_curr_draw','0');
	}else{
		g_form.setValue('po_curr_draw',answer.perc_draw);
	}
}
