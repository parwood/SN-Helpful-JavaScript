var requestBody;
var responseBody;
var status;
var sm;
var path = workflow.scratchpad.username;
try{
	sm = new sn_ws.RESTMessageV2();  // Might throw exception if message doesn't exist or not visible due to scope.
	sm.setBasicAuth("smwebservice","xmatters");
	sm.setHttpTimeout(10000); //In milliseconds. Wait at most 10 seconds for response from http request.
	sm.setHttpMethod("get");
	sm.setEndpoint("https://intermountain-np.hosted.xmatters.com/api/xm/1/people/" + path);


	response = sm.execute();//Might throw exception if http connection timed out or some issue with sending request itself because of encryption/decryption of password.
	responseBody = response.haveError() ? response.getErrorMessage() : response.getBody();
	status = response.getStatusCode();
} catch(ex) {
	responseBody = ex.getMessage();
	status = '500';
} finally {
	requestBody = sm ? sm.getRequestBody():null;
}
var parser = new JSONParser();
var parsed = parser.parse(responseBody);

gs.info("Request Body: " + requestBody);
gs.info("Response: " + responseBody);
gs.info("HTTP Status: " + status);
gs.info("Parsed ID " + parsed.id);

workflow.scratchpad.idFromGet = parsed.id;

answer = didItWork();
function didItWork(){
	if (status == '200'){
		return "yes";
	} else if (status == '404'){
		return "no";
	} else{
		return "error";
	}
}


var requestBody;
var responseBody;
var uuid;
var roles;
var existing;
var status;
var sm;
var path = workflow.scratchpad.username;
try{
	sm = new sn_ws.RESTMessageV2();  // Might throw exception if message doesn't exist or not visible due to scope.
	sm.setBasicAuth("smwebservice","xmatters");
	sm.setHttpTimeout(10000); //In milliseconds. Wait at most 10 seconds for response from http request.
	sm.setHttpMethod("get");
	sm.setEndpoint("https://intermountain.hosted.xmatters.com/api/xm/1/people/" + path + "?embed=roles");

	response = sm.execute();//Might throw exception if http connection timed out or some issue with sending request itself because of encryption/decryption of password.
	responseBody = response.haveError() ? response.getErrorMessage() : response.getBody();
	status = response.getStatusCode();
var newRole = workflow.scratchpad.role_needed;
var jsonData = JSON.parse(responseBody);
var roles = jsonData.roles.data;
var	existing = "";
	for (i = 0; i < roles.length;i++) {
    var existing = [existing + roles[i].name+'","'];
}
workflow.scratchpad.roles_combined = existing + newRole+'"';
} catch(ex) {
	responseBody = ex.getMessage();
	status = '500';
} finally {
	requestBody = sm ? sm.getRequestBody():null;
}
var parser = new JSONParser();
var parsed = parser.parse(responseBody);

gs.info("Request Body: " + requestBody);
gs.info("Response: " + responseBody);
gs.info("HTTP Status: " + status);
gs.info("Parsed ID " + parsed.id);
gs.info("New Role Is: " + newRole);
gs.info("Existing Roles are: " + existing);
gs.info("UUID is: " + jsonData.id);
gs.info("Combined Roles: " + '"' + workflow.scratchpad.roles_combined);

workflow.scratchpad.idFromGet = parsed.id;

answer = didItWork();
function didItWork(){
	if (status == '200'){
		return "yes";
	} else if (status == '404'){
		return "no";
	} else if (status =='500'){
		return "no";
	}
	else{
		return "error";
	}
}
