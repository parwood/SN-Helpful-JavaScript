var getCostCenter = Class.create();
getCostCenter.prototype = Object.extendsObject(AbstractAjaxProcessor, {
	costCenter: function() {
		//gs.addInfoMessage("Entering Function");
		var costId = this.getParameter('sysparm_cost_id');
		//gs.addInfoMessage(costId + " cost_center server side");

		var gr = new GlideRecord('cmn_cost_center');
		gr.addQuery('sys_id',costId);
		gr.query();

		if(gr.next()){
			//gs.log(gr.u_cost_center);
			var costCenterNum = gr.u_cost_center
			return costCenterNum;
		}else{
			//gs.log('null cost center');
			return costCenterNum;
		}

		},

		type: 'getCostCenter'
	});
