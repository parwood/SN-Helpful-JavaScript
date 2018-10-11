var gr = new GlideRecord('sys_user');
gr.addQuery('u_is_manager_field','true');
gr.addActiveQuery();
gr.query();
manList = [];

while(gr.next()){
manList.push(gr.sys_id +'');
}

var gr2 = new GlideRecord('sys_user_group');
gr2.addQuery('user','IN',manList);
gr2.query();

while(gr2.next()){
