var gr = new GlideRecord('sys_user');
gr.addQuery('u_is_manager_field', 'true');
gr.addActiveQuery();
gr.query();
manList = [];

while (gr.next()) {
  manList.push(gr.sys_id + '');
}

var gr2 = new GlideRecord('sys_user_grmember');
gr2.addQuery('user', 'IN', manList);
gr2.addQuery('group', '8d7e5992db7cfa40764a7deaae96199d');
gr2.query();
manGroupList = [];

while (gr2.next()) {
  manGroupList.push(gr2.user + '');
}

i = 0;

while (manGroupList.next()) {
  var gr3 = new GlideRecord('sys_user_grmember');
  gr3.initialize();
  gr3.user = manGroupList.user[i];
  gr3.group = 'f9d71c13dba0e3484a9f5dd5ce961920';
  gr3.insert();
  i = i+1;
}

var gr = new GlideRecord('sys_user_grmember');
gr.addQuery('user','');
gr.addQuery('group','f9d71c13dba0e3484a9f5dd5ce961920');
gr.query();
gr.next();
gr.deleteMultiple();



var gr = new GlideRecord('sys_user');
gr.addQuery('u_is_manager_field', 'true');
gr.addActiveQuery();
gr.query();

while (gr.next()){
  var gr2 = new GlideRecord('sys_user_grmember');
  gr2.addQuery('user', gr.sys_id);
  gr2.addQuery('group', '8d7e5992db7cfa40764a7deaae96199d');
  gr2.query();

  while(gr2.next()){
    var gr3 = new GlideRecord('sys_user_grmember');
    gr3.initialize();
    gr3.user = gr2.user;
    gr3.group = 'f9d71c13dba0e3484a9f5dd5ce961920';
    gr3.insert();
    gs.print(gr3.user + ' added to group ' + gr3.group);
  }
}
