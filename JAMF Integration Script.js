var r = new sn_ws.RESTMessageV2('JAMF Inventory Report', 'GET');
var response = r.execute();
var responseBody = response.getBody();
var httpStatus = response.getStatusCode();

var parser = new JSONParser();
var parsedData = parser.parse(responseBody);
var len = parsedData.computer_reports.length;
gs.print(len);

for (var i = 0; i < len; i++) {
  var obj = parsedData.computer_reports[i];
  var obj2 = JSON.stringify(obj);
  var parsedSecond = JSON.parse(obj2);

  var restGR = new GlideRecord('u_jamf_mac_import'); //Important
  restGR.initialize();
  restGR.u_building = parsedSecond.Building;
  restGR.u_computer_name = parsedSecond.Computer_Name;
  restGR.u_drive_capacity_mb = parsedSecond.Drive_Capacity_MB;
  restGR.u_ip_address = parsedSecond.IP_Address;
  restGR.u_last_check_in = parsedSecond.Last_Check_in;
  restGR.u_last_logged_in_user = parsedSecond.Last_User;
  restGR.u_make = parsedSecond.Make;
  restGR.u_model = parsedSecond.Model;
  restGR.u_number_of_processors = parsedSecond.Number_of_Processors;
  restGR.u_operating_system_build = parsedSecond.Operating_System_Build;
  restGR.u_operating_system_name = parsedSecond.Operating_System_Name;
  restGR.u_operating_system_version = parsedSecond.Operating_System_Version;
  restGR.u_processor_speed_mhz = parsedSecond.Processor_Speed_MHz;
  restGR.u_processor_type = parsedSecond.Processor_Type;
  restGR.u_serial_number = parsedSecond.Serial_Number;
  restGR.u_total_number_of_cores = parsedSecond.Total_Number_of_Cores;
  restGR.u_total_ram_mb = parsedSecond.Total_RAM_MB;
  restGR.u_username = parsedSecond.Username;
  //restGR.sys_import_set = 'sys_id of the import set created in step 3'; //Important
  restGR.insert();

}
