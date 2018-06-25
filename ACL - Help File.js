//Get User Object
var user = gs.getUser();
//Get User SYS ID
var userId = gs.getUserID();
//Get Department SYS ID for GlideRecord Call
var department = user.getRecord().getValue('department');
//Call Glide Record Function passing in department SYS ID
var userCC = userCostCenter(department);

gs.log("*****User Object " + user);
gs.log("*****Department SYS ID " + department);
gs.log("*****User SYS ID " + userId;
gs.log("*****Cost Center retrieved from Department on user record " + userCC);
gs.log("*****Cost Center retrieved from Department field on form " + current.u_group);
gs.log("*****Reviewer from form " + current.u_steering_committee_reviewer);

//Evaluate to determine whether user should be allowed to edit record and return true or false
if ((user.getValue() == current.u_steering_committee_reviewer) && (userCC == current.u_group)) {
  gs.log("*****Entering true");
  answer = true;
} else {
  gs.log("*****Entering false");
  answer = false;
}

//GlideRecord to the department table passing in the department sys_id from the user record
function userCostCenter(dept) {
  gs.log("*****Starting GR")
  //Query the cmn_department table to get sys_id of cost_center
  var gcc = new GlideRecord('cmn_department');
  gs.log("*****Passed Department ID " + dept);
  gcc.addquery('sys_id', dept);
  gcc.query();
  gs.log("*****Pushing Value");
  //Push value of cost_center sys_id into groupCostCenter and return value from function
  while (gcc.next()) {
    gs.log("*****GroupCostCenter " + gcc.cost_center);
    var groupCostCenter = gcc.cost_center.getValue();
    gs.log("*****GroupCostCenter " + groupCostCenter);
    return groupCostCenter;
  }

}
