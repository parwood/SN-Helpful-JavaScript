/*
 *   Parallel Approval Steps for Catalog Path Management
 *   --------------------------------------
 *   @author Jacob McCollum
 *   @date 01/13/2016
 *   @description - utility methods for the parallelized path workflows
 *
 *   This script gathers all the approval steps for this path and groups them
 *   into sequenced steps based on their order
 */


(function(){
	// We'll need utility functions, so we'll initialize a utility object
	var PPU = new CWTParallelPathUtils();
	// Call the utility method to collect a list of approval steps
	var steps = PPU.getPathSteps("u_approver_step", current.variables.approver_fulfiller_path.sys_id);

	// If we've got even one step, we'll convert it to a JSON string and set it in the scratchpad
	// (if not, we don't have to set the scratchpad value at all, since it will be null when we check it later
	//     and null evaluates to false when using coercive equality check (==) )
	if(steps.length) workflow.scratchpad.approval_steps = JSON.stringify(steps);

	//gs.log("CWTParallelPaths -->" + "Approval steps for " + current.getValue("number") + ": " + workflow.scratchpad.approval_steps);
})();
