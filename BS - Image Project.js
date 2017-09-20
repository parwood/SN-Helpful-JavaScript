var newgr = new GlideRecord ('pc_hardware_cat_item');
newgr.addActiveQuery();
newgr.query();

while (newgr.next()){
gs.print('Added ' + newgr.sys_id + ' to table.');
var newgr1 = new GlideRecord('u_service_portal_image_project');
newgr1.initialize();
newgr1.u_cat_item = newgr.sys_id;
newgr1.u_completed_by.setDisplayValue('Patrick Arwood');
newgr1.insert();
gs.print('Added to table.');
}

var rec = new GlideRecord('sc_cat_item');
rec.addNotNullQeury('model');
rec.addActiveQuery();
rec.query();
while(rec.next()){
  //Create a new group relationship record for this user
  var rec1 = new GlideRecord('u_service_portal_image_project');
  var cat_name = rec.name;
  rec1.initialize();
  rec1.u_cat_item.setDisplayValue(cat_name);
  rec1.u_completed_by.setDisplayValue('Patrick Arwood');
  rec1.insert();
  gs.print('Added ' + rec.sys_id + ' to table.');
}


var newgr = new GlideRecord ('sc_cat_item');
newgr.addNotNullQeury('model');
newgr.addActiveQuery();
newgr.query();

while (newgr.next()){
gs.print('Added ' + newgr.sys_id + ' ' + newgr.name + ' to table.');
var newgr1 = new GlideRecord('u_service_portal_image_project');
newgr1.initialize();
newgr1.u_catalog_item = newgr.sys_id;
newgr1.u_completed_by.setDisplayValue('Patrick Arwood');
newgr1.insertWithReferences();
gs.print('Added to table.');
}

var z = new GlideRecord('sc_request');
z.addActiveQuery();
var q = z.addQuery('requested_for', gs.getUserID());
q.addOrCondition('opened_by', gs.getUserID());
z.orderByDesc('sys_updated_on');
z.setLimit(max);
z.query();
while (z.next()) {
  var ritm = new GlideRecord('sc_req_item');
  ritm.addQuery('request', z.getUniqueValue());
  ritm.query();
  if (!ritm.next())
    continue;

  var a = {};
  $sp.getRecordValues(a, z, 'sys_id,number,sys_updated_on');
  if (ritm.hasNext())
    a.short_description = ritm.getRowCount() + ' requested items';
  else
    a.short_description = ritm.cat_item.getDisplayValue() || ritm.getDisplayValue("short_description");
  a.__table = z.getTableName();
  a.type = 'request';
  a.sortOrder = z.sys_updated_on.getGlideObject().getNumericValue();
  t.items.push(a);
}

var z = new GlideRecord('sc_req_item');
z.addActiveQuery();
var q = z.addQuery('requested_for', gs.getUserID());
q.addOrCondition('opened_by', gs.getUserID());
z.orderByDesc('sys_updated_on');
z.setLimit(max);
z.query();
while (z.next()) {

  var a = {};
  $sp.getRecordValues(a, z, 'sys_id,number,sys_updated_on');
  a.short_description = ritm.cat_item.getDisplayValue() || ritm.getDisplayValue("short_description");
  a.__table = z.getTableName();
  a.type = 'request';
  a.sortOrder = z.sys_updated_on.getGlideObject().getNumericValue();
  t.items.push(a);
}
