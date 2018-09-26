var comp_ci = new GlideRecord ('cmdb_ci_computer');
comp_ci.get(producer.asset_tag);

if(com_ci){
  if(producer.activity_type='check_out'){
      comp_ci.assigned_to = producer.
      comp_ci.install_status = producer.
      comp_ci.update();
    }
    if(producer.activity_type='assign_emp'){

    }
    if(producer.activity_type='return_it'){

  }
  if(producer.activity_type='return_pcdc'){

  }
  if(producer.activity_type='retire_asset'){

  }
}
curren.setAbortAction(true);




var gr = new GlideRecord('change_request');
gr.addQuery('number','CHG0044348');
gr.query();

while (gr.next()){
gs.print(gr.sys_id);
var grSysId = gr.sys_id;
var gr1 = new GlideRecord('change_request')
gr1.get(grSysId);
gr1. setValue('approval','approved');
gr1.update();
gs.print(gr.getElement('approval'));
}


var gr = new GlideRecord('sys_user');
gr.addQuery('sys_id','a4fb9e2fdb9cd380f5c356f3ce9619ad');
gr.query();

gs.print(gr.phone);

while(gr.next()){
gs.print("***** " + gr.name + " " + gr.phone + " " + gr.phone.indexOf("+1"));
if(gr.phone.indexOf("+1")==-1){
var newPhone = '+1' + gr.phone;
gs.print("***** New Phone " + newPhone);
var gr1 = new GlideRecord('sys_user');
gr1.get(gr.sys_id);
gr1.setValue('phone',newPhone);
gr1.update();
gs.print("***** phone changed" + gr.phone.indexOf("+1"));
}
}




javascript: new GlideDateTime().getDate().getDisplayValue();
