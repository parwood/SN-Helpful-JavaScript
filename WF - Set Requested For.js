//Set the Requested For field on the Request and the Requested Item Field
// Call the setRequestedFor function
setRequestedFor(current);

function setRequestedFor(current) {

    var requestedFor = current.variables.requested_for;

    if (requestedFor) {
        // Set Requested For on the Request
        var grRequest = new GlideRecord(‘sc_request’);
        grRequest.get(current.request);
        grRequest.requested_for = requestedFor;
        grRequest.update();
        //Set Requested For on the Requested Item from the variable on the form
        current.u_requested_for = requestedFor;
    }
}
