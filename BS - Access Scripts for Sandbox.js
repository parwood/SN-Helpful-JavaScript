//Role granting script
var rec = new GlideRecord('sys_user');
rec.addQuery('active','true');
rec.query();
while(rec.next()){
  //Create a new role relationship record for this user
  var rec1 = new GlideRecord('sys_user_has_role');
  var roleName = '2831a114c611228501d4ea6c309d626d';
  rec1.initialize();
  rec1.user = rec.sys_id;
  rec1.role = roleName;
  rec1.setWorkflow(false);
  rec1.insert();
}

var gr = new GlideRecord("sys_user");
gr.query();
var counting = 1;
while(gr.next())  {scripts
if (gr.active == true){
  gr.user_password.setDisplayValue("password");
  gs.log("updating password for " + gr.user_name);
  gs.print("On Record " + counting);
  counting++;
  gr.update();
  }
}

var gr = new GlideRecord('sys_user');
gr.addActiveQuery();
gr.query();
var counting = 1;
while(gr.next()) {
  if (gr.accumulated_roles.toString().indexOf("") == -1 && gr.active == true) {
   gr.roles = 'admin'
   gs.log("updating roles " + gr.user_name);
   gr.update();
 }
}

var rec = new GlideRecord('sys_user');
rec.addQuery('active','true');
rec.query();
while(rec.next()){
  //Create a new group relationship record for this user
  var rec1 = new GlideRecord('sys_user_grmember');
  var group1 = 'adc8792a4f70220051e5d0af0310c7ce';
  rec1.initialize();
  rec1.user = rec.sys_id;
  rec1.group = group1;
  rec1.insert();
}

var gr = new GlideRecord("sc_cat_item");
gr.query();
var counting = 1;
while(gr.next())  {
if (gr.active == true && gr.sc_catalogs == Hardware && gr.category == printers){
  gs.print("On Record " + counting);
  counting++;
  //gr.update();
  }
}

var rec = new GlideRecord('sys_user');
rec.addQuery('active','true');
rec.query();

usersList = [];
while (usersList.next()){
  usersList.push(rec.sys_id + '');
}

usersList = new ArrayUtil().unique(usersList);

for(var i = 0; i < usersList.length; i++){
var rec1 = new GlideRecord('sys_user_grmember');
rec1.initialize();
rec1.user = usersList[i];
rec1.group= adc8792a4f70220051e5d0af0310c7ce;
rec1.insert();
}

var deleteUsers = new GlideRecord('sys_user_grmember');
deleteUsers.addQuery('group', 'adc8792a4f70220051e5d0af0310c7ce');
deleteUsers.deleteMultiple();


adc8792a4f70220051e5d0af0310c7ce

3e6e284a4f556200af76d0af0310c7da = Incident Self Service Skill
//Skill granting script

var rec = new GlideRecord('sys_user');
rec.addQuery('active','true');
rec.query();
while(rec.next()){
  //Create a new role relationship record for this user
  var rec1 = new GlideRecord('sys_user_has_skill');
  var skillName = '3e6e284a4f556200af76d0af0310c7da';
  rec1.initialize();
  rec1.user = rec.sys_id;
  rec1.skill = skillName;
  rec1.setWorkflow(false);
  rec1.insert();
}


var rec = new GlideRecord('sys_user_has_skill');
rec.query();

recList = [];
while (rec.next()){
  recList.push(rec.user + '');
}
//var countOf = recList.length
//gs.print('Length of Array is ' + countOf);

var rec1 = new GlideRecord('sys_user');
rec1.addQuery('sys_id', 'NOT IN', recList);
rec1.addQuery('active','true');
rec1.query();

while(rec1.next()){
  //Create a new role relationship record for this user
  var rec2 = new GlideRecord('sys_user_has_skill');
  var skillName = '3e6e284a4f556200af76d0af0310c7da';
  rec2.initialize();
  rec2.user = rec1.sys_id;
  rec2.skill = skillName;
  rec2.setWorkflow(false);
  rec2.insert();
}

var gr = new GlideRecord("sys_user");
gr.query();
while(gr.next())  {
  gr.user_password.setDisplayValue("abc123");
  gs.log("updating password for " + gr.user_name);
  gr.update();
}



var gr = new GlideRecord("sys_user");
gr.query();
while(gr.next()) {
  if (gr.accumulated_roles.toString().indexOf(",admin,") == -1) {
   gr.roles = gr.roles + ",admin";
   gr.update();
 }
}

var rec = new GlideRecord('sys_user');
rec.addQuery('active', 'true');
rec.query();
while(rec.next()){
  //Create a new group relationship record for this user
  var rec1 = new GlideRecord('sys_user_grmember');
  rec1.initialize();
  rec1.user = rec.sys_id;
  rec1.group.setDisplayValue('SN Sandbox Admin Group');
  rec1.insert();
  gs.log("updating roles " + rec.user_name);
}
