var gr = new GlideRecord('sys_user');
gr.addActiveQuery();
gr.query();

while (gr.next()) {
  gs.print("***** " + gr.name + " " + gr.phone + " " + gr.phone.indexOf("1"));

  if (gr.phone.indexOf("1") != 1 || gr.phone != '') {
    var newPhone = '+1' + gr.phone;
    gs.print("***** New Phone " + newPhone);
    var gr1 = new GlideRecord('sys_user');
    gr1.get(gr.sys_id);
    gr1.setValue('phone', newPhone);
    gr1.update();
    gs.print("***** phone changed" + gr.phone.indexOf("1"));
  }

}
