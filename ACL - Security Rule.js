//This script belongs in the advanced script portion of an ACL

//We call a script include and pass variables to it
var manager = new CWTAccessManager(current.u_service_line);
var owner = manager.is_service_line_owner();

//For this particular script, if it's a new record it's always true
if (current.isNewRecord() )
    answer = true;
//If it's a valid record, and the result of var owner is true then it's true
else if (current.isValidRecord() && owner == true)
    answer = true;
//Otherwise it's false
else
    answer = false;
