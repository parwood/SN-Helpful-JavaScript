var user = gs.getUserID();
var department = user.getRecord().getValue('department');
var userCC = userCostCenter(department);


gs.log("*****Cost Center retrieved from Department on user record " + gropuCostCenter);
gs.log("*****Cost Center retrieved from Department field on form " + current.group.cost_center);

if ((user == current.u_steering_committee_reviewer) && (groupCostCenter == current.group.cost_center)) {
  gs.log("*****Entering true");
  answer = true;
} else {
  gs.log("*****Entering false");
  answer = false;
}

function userCostCenter(department) {
  var gcc = new GlideRecord('cmn_department');
  gcc.addquery('sys_id', department);
  gcc.query();

  while (gcc.next) {
    var groupCostCenter = gcc.cost_center;

  }
  return groupCostCenter;
}
