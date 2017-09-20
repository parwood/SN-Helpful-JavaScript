var dollars ="";
dollars = current.variables.iphone_memory.getDisplayValue();

if(dollars == "128GB - (Employee Pays $200.00)"){
	template.print("You have purchased a mobile phone that requires an extra payment to a cashier in your facility.  You owe $200, please pay this to a cashier in your facility and attach the scanned receipt to your request.");
}
if(dollars == "64GB - (Employee Pays $100.00)"){
	template.print("You have purchased a mobile phone that requires an extra payment to a cashier in your facility.  You owe $100, please pay this to a cashier in your facility and attach the scanned receipt to your request.");
}
if(dollars == "16GB - (Employee Pays $100.00)"){
	template.print("You have purchased a mobile phone that requires an extra payment to a cashier in your facility.  You owe $100, please pay this to a cashier in your facility and attach the scanned receipt to your request.");
}
if(dollars == "64GB - (Employee Pays $200.00)"){
	template.print("You have purchased a mobile phone that requires an extra payment to a cashier in your facility.  You owe $200, please pay this to a cashier in your facility and attach the scanned receipt to your request.");
}
if(dollars == "128GB - (Employee Pays $300.00)"){
	template.print("You have purchased a mobile phone that requires an extra payment to a cashier in your facility.  You owe $300, please pay this to a cashier in your facility and attach the scanned receipt to your request.");
}
