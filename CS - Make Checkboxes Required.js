function onSubmit() {

 // ------------------------------ 
 // Set Checkbox Parameters Here 
 // ------------------------------ 
 // List of Checkboxes 
 var requiredCheckboxList = 'phone_device_agreement_check,payroll_deduction_agreement';
 // Number of checkboxes to be required 
 var requiredCheckboxCount = 2;
 // Section Title 
 var sectionTitle = 'mySection';
 
 // ------------------------------ 
 // Run Script
 // ------------------------------ 
 var response = checkboxCheck(requiredCheckboxList, requiredCheckboxCount);
 if (!response) {
alert('You must click the checkbox marked "I Agree" in each section it appears before submitting your request.');
return false;
 }
}

function checkboxCheck (requiredCheckboxArray, myCount) {
 requiredCheckboxArray = requiredCheckboxArray.split(',');
 var answer = false;
 var match = 0;
 for (i=0; i < requiredCheckboxArray.length; i++) {
if (g_form.getValue(requiredCheckboxArray[i]) == 'true') {
 match ++;
 if (match >= myCount) {
answer = true;
break;
 }
}
 }
 return answer;
}
