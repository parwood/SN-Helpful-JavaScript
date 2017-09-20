var comma_delimited = grp_apps.length ? grp_apps.join(",") : '';


// maximum number of entries in this Menu
var max = 10;

var t = data;  // shortcut
t.items = [];

var u = gs.getUser().getID();

// use record watchers to tell header when to update dropdown counts
t.record_watchers = [];
t.record_watchers.push({'table':'service_task','filter':'active=true^opened_by=' + u});
t.record_watchers.push({'table':'incident','filter':'active=true^caller_id='+ u +'^ORopened_by=' + u});
t.record_watchers.push({'table':'sc_request','filter':'active=true^requested_for=' + u +'^ORrequest.opened_by=' + u});

var st = new GlideRecord('service_task');
if (st.isValid()) {
  st.addActiveQuery();
  st.addQuery('opened_by',gs.getUserID());
  st.orderByDesc('sys_updated_on');
  st.setLimit(max);
  st.query();
  while (st.next()) {
    var a = {};
    $sp.getRecordValues(a, st, 'short_description,sys_id,number,sys_updated_on');
    if (st.short_description.nil())
      a.short_description = "(No description)";
    a.__table = st.getTableName();
    a.type = 'record';
    a.sortOrder = st.sys_updated_on.getGlideObject().getNumericValue();
    t.items.push(a);
  }
}

var z = new GlideRecord('incident');
z.addActiveQuery();
z.addQuery('state', '!=', '6');
var orz = z.addQuery('assigned_to', gs.getUserID());
orz.addOrCondition('caller_id', gs.getUserID());
z.orderByDesc('sys_updated_on');
z.setLimit(max);
z.query();
while (z.next()) {
  var a = {};
  $sp.getRecordValues(a, z, 'short_description,sys_id,number,sys_updated_on');
  if (z.short_description.nil())
    a.short_description = "(No description)";
  a.__table = z.getTableName();
  a.type = 'record';
  a.sortOrder = z.sys_updated_on.getGlideObject().getNumericValue();
  t.items.push(a);
}

var z = new GlideRecord('sc_req_item');
z.addActiveQuery();
var q = z.addQuery('u_requested_for',gs.getUserID());
q.addOrCondition('request.opened_by', gs.getUserID());
z.orderByDesc('sys_updated_on');
z.setLimit('30');
z.query();
gs.print(z.getRowCount());
while (z.next()) {

  var a = {};
  $sp.getRecordValues(a, z, 'sys_id,number,sys_updated_on');
  a.short_description = z.cat_item.getDisplayValue() || z.getDisplayValue("short_description");
  a.__table = z.getTableName();
  a.type = 'request';
  a.sortOrder = z.sys_updated_on.getGlideObject().getNumericValue();
  t.items.push(a);
}

t.items.sort(function(a, b) {
  return b.sortOrder - a.sortOrder;
});
t.items = t.items.slice(0, max); // only want first 30
t.count = t.items.length;

var link = {title: gs.getMessage('View all tickets'), type: 'link', href: '?id=requests', items: []};
t.items.unshift(link); // put 'View all requests' first
