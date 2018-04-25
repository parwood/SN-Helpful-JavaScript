// Set values for the task in this script.  Use the variable ‘task’ when setting additional values.
// Note: This script is run after the task values are set using the Fields, Template or Values you have specified.

setVariables();

function setVariables() {
    // Set Short description
    task.short_description = current.short_description;

    //Check if there is fulfillment group in the variables
    if (current.variables.fulfillment_group) {
        task.assignment_group = current.variables.fulfillment_group;
    //Check if there is an assigned to in the variables
    } else if (current.variables.assigned_to) {
        //gs.addInfoMessage(“else if for assigned to on form fired”);
        task.assignment_group = current.cat_item.group;
        task.assigned_to = current.variables.assigned_to;
    //Check if there is a fulfillment group on the catalog item
    } else {
        task.assignment_group = current.cat_item.group;
    }

    // Call the setPHIFlag function
    setPHIFlag();
}

function setPHIFlag() {
    // Set PHI Flag
    var phiFlag = current.variables.phi.toString();
    if (phiFlag) {
        task.u_phi = phiFlag.toLowerCase();
    }
}
