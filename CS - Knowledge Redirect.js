function onChange(control, oldValue, newValue, isLoading) {
   var choice = g_form.getValue('', notes);
}
function notes(choice) { //reference is passed into callback as first arguments
  if (newValue = 'new_code'){
    g_form.setValue('billing_code','new_code');
}else if(newValue = 'existing_code'){
g_form.setValue('billing_code','existing_code');
}else{
g_form.hideFieldMsg('options',true);
}
}



function onChange(control, oldValue, newValue, isLoading) {

   if (!isLoading) {
      if (newValue) {
         if (newValue != oldValue) {
            if (g_form.getValue('options' = 'education') {
              g_form.showFieldMsg('options',"<a href=https://intermountain.service-now.com/$knowledge.do>Click here</a>",'info',true);
            } else {
			g_form.hideFieldMsg('options',true);
			}
         }
      }
   }
}

function onChange(control, oldValue, newValue, isLoading) {
   var choice = g_form.getValue('options', notes); // doAlert is our callback function
}
function notes(choice) { //reference is passed into callback as first arguments
  if (newValue = 'education'){
    g_form.showFieldMsg('options',"<a href=https://intermountain.service-now.com/$knowledge.do>Click here</a>",'info',true);
}
else{
g_form.hideFieldMsg('options',true);
}
};



function onChange(control, oldValue, newValue, isLoading) {

   if (!isLoading) {
      if (newValue) {
         if (newValue != oldValue) {
            if (g_form.getValue('options' = 'education') {
              g_form.showFieldMsg('options',"<a href=https://intermountain.service-now.com/$knowledge.do>Click here</a>",'info',true);
            } else {
			g_form.hideFieldMsg('options',true);
			}
         }
      }
   }
}
