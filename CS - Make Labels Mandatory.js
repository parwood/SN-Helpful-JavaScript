//DOM Manipulation - will not work in portal.

function onLoad(){
   var mandatoryLabel = 'Please Check I Agree to Submit';
   //Get all of the LABEL tag elements and check for a matching label
   $$('label').each(function(labels) {
      if(labels.innerHTML.indexOf(mandatoryLabel) > -1){
         //Set the 'mandatory' class name for the label element
         labels.previousSibling.className = 'mandatory';
      }
   });
}
