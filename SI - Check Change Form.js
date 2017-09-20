var checkChangeForm = Class.create();
checkChangeForm.prototype = Object.extendsObject(AbstractAjaxProcessor, {
checkRequired : function(){
	gs.log('**** Firing CHECK');
	if(gs.hasRole("itil")&&current.state==1&&(current.approval=='not requested'||current.approval=='rejected')&&!current.cmdb_ci.nil()&&!current.risk.nil()&&!current.impact.nil()&&!current.assignment_group.nil()&&!current.assigned_to.nil()&&!current.description.nil()&&!current.justification.nil()&&!current.implementation_plan.nil()&&!current.u_communication_plan.nil()&&!current.backout_plan.nil()&&!current.u_verification_plan.nil()&&!current.start_date.nil()&&!current.end_date.nil()){
		gs.log('**** CHECK Passed');
		return true;
	}
},
    type: 'checkChangeForm'
});
