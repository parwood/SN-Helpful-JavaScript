// This script needs to set answer to 'yes' or 'no' to indicate the state of the activity.
//

// This script needs to set answer to 'yes' or 'no' to indicate the state of the activity.
//
// For example,
//
answer = ifScript();

function ifScript() {


	if (JSUtil.toBoolean(workflow.scratchpad.managerApproval)) {
		return 'yes';
	}
	return 'no';
}
