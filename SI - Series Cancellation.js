cancelSeriesAction:function(){
  var success = "Your meeting series has been canceled";
  var request = current.room_request;

  var gro = new GlideRecord('x_usdo2_a_rit_occurrences');
  gro.addQuery('room_request', request);
  gro.query();
  //push results to array
  occList = [];

while(gro.next()){
  occList.push(gro.sys_id + '');
}

var groCancel = new GlideRecord('x_usdo2_a_rit_occurrences');
groCancel.addQuery('sys_id', 'IN', occList);
groCancel.query();

while(groCancel.next()){
  groCancel.status = 'Canceled'
  groCancel.update;
}

  return success;

},
