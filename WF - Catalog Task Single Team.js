function debug(msg) {
    var debugVal = false; //set to false to turn off debugging
    var debugSourceSuffix = “*** Workflow Debug”;
    if (debugVal) {
        gs.log(msg, debugSourceSuffix);
    }
}

// Set values for the task in this script.  Use the variable ‘task’ when setting additional values.
// Note: This script is run after the task values are set using the Fields, Template or Values you have specified.

setVariables();

function setVariables() {
    // Set Short description
    task.short_description = current.short_description;

    //Check and save group and user that are variables on the requested item
    var fulfillmentGroup = ‘’;
    var fulfiller = ‘’;
    var triageGroup = current.variables.triage_group;

    debug(“triage group is ” + triageGroup);
    debug(“fulfillment group is ” + current.variables.fulfillment_group);
    debug(“assigned_to is ” + current.variables.assigned_to);

    if(current.variables.fulfillment_group){
        debug(“fulfillment group exists and is not empty”);
        fulfillmentGroup = current.variables.fulfillment_group;
    }
    if(current.variables.assigned_to){
        debug(“assigned to exists and is not empty”);
        fulfiller = current.variables.assigned_to + ‘’;
    }
    //Check if there is a fulfillment group and fulfiller on the form
    if ((fulfiller != ‘’) && (fulfillmentGroup != ‘’)) {
        debug(“fulfillment group and fulfiller are present”);
        task.assigned_to = fulfiller;
        task.assignment_group = fulfillmentGroup;



    //Check if there is a fulfillment group but no fulfiller
    } else if ((fulfillmentGroup != ‘’) && (fulfiller == ‘’)) {
        debug(“only fulfillment group is present”);
        task.assignment_group = fulfillmentGroup;

    //Check if there is an assigned to but no fulfillment group
    } else if ((fulfiller != ‘’) && (fulfillmentGroup == ‘’)) {
        debug(“Only Assigned to is present”);

        task.assigned_to = current.variables.assigned_to;

    //If no conditions match then assign to triage group listed on form
    } else {
        debug(“else statement fired”);
        task.assignment_group = triageGroup;
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
