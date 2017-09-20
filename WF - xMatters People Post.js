var user_id='"'+workflow.scratchpad.idFromGet+'"';
var roles_needed=workflow.scrachpad.role_needed;
var roleForPost = '['+'"Standard User"' + "," +'"'+ roles_needed+'"]';
var requestBody;
var responseBody;
var status;
var sm;

 try {
 var sm = new sn_ws.RESTMessageV2('xMatters People Check', 'post');
 sm.setStringParameterNoEscape('id_num', user_id);
 sm.setStringParameterNoEscape('roles_need', roleForPost);


 response = sm.execute();//Might throw exception if http connection timed out or some issue with sending request itself because of encryption/decryption of password.
 responseBody = response.haveError() ? response.getErrorMessage() : response.getBody();
 status = response.getStatusCode();

}
catch(ex) {
	responseBody = ex.getMessage();
	status = '500';
} finally {
  	requestBody = sm ? sm.getRequestBody():null;
}

gs.info("Post Request Body: " + requestBody);
gs.info("Post Response: " + responseBody);
gs.info("Post HTTP Status: " + status);


var user_id='"' + workflow.scratchpad.idFromGet + '"';
var roles_needed=workflow.scratchpad.role_needed;
var roleForPost = ' ["'+ workflow.scratchpad.roles_combined +']';
var requestBody;
var responseBody;
var status;
var sm;
var role_giving=roleForPost;

 try {
 var sm = new sn_ws.RESTMessageV2('xMatters People Check', 'post');
	 sm.setBasicAuth("smwebservice","xmatters");
	 sm.setHttpTimeout(10000); //In milliseconds. Wait at most 10 seconds for response from http request.
	 sm.setStringParameterNoEscape('id_num', user_id);
	 sm.setStringParameterNoEscape('roles_need', roleForPost);

 response = sm.execute();//Might throw exception if http connection timed out or some issue with sending request itself because of encryption/decryption of password.
 responseBody = response.haveError() ? response.getErrorMessage() : response.getBody();
 status = response.getStatusCode();

}
catch(ex) {
	responseBody = ex.getMessage();
	status = '500';
} finally {
  	requestBody = sm ? sm.getRequestBody():null;
}

gs.info("Post Request Body: " + requestBody);
gs.info("Post Response: " + responseBody);
gs.info("Post HTTP Status: " + status);
