function debug(msg) {
	var debugVal = false; //set to false to turn off debugging
	var debugSourceSuffix = "*** PortalDataLookupServerScript";
	if (debugVal) {
		gs.log(msg, debugSourceSuffix);
	}
}

initiateLookup();

function initiateLookup() {
	//if there is no active lookup definition, we don't need to do any checks
	var catalogItem = current.getValue("cat_item");
	var portalUtils = new PortalDataLookupUtils();
	var lookupDefinitions = portalUtils.getLookupDefinitions(catalogItem);

	debug("** initiateLookup: Lookup Definition length is: " + lookupDefinitions.length);

	// 	for(var v = 0; v < lookupDefinitions.length; v++) {
	// 		debug("** initiateLookup: lookupDefinitions[v]: " + lookupDefinitions[v]);
	// 	}

	if(lookupDefinitions.length > 0) {
		getLookupData(catalogItem, portalUtils, lookupDefinitions);
	}
}


function getLookupData(catalogItem, portalUtils, lookupDefinitions) {
	var matchers = portalUtils.getMatchers(lookupDefinitions);


	debug("** getLookupData: Matchers length: " + matchers.length);

	for(var i = 0; i < matchers.length; i++) {
		debug("** getLookupData: matchers[i] length: " + matchers[i].length);
		if(matchers[i].length > 1) {
			debug("** getLookupData: there is more than one matcher record for definition: " + matchers[i].definition_sys_id);
			multipleMatcherHandling(matchers[i], portalUtils);

		} else {
			debug("** getLookupData: there is only one matcher record for definition: " + matchers[i].definition_sys_id);
			oneMatcherHandling(matchers[i], portalUtils);
		}
	}
}


function multipleMatcherHandling(matchers, portalUtils) {
	var setterDefinitions = [];
	var sourceVariableValues = [];
	var sourceVariableValue, sourceVariableValLowerCase, matcherTableFieldValue, matcherTableFieldValueLowerCase, matcherTable, matcherDefinition, encodedQuery = "";

	matcherTable = matchers.table;
	matcherDefinition = matchers.definition_sys_id;

	debug("** getMatchers: matchers.length: " + matchers.length);


	for(var t = 0; t < matchers.length; t++) {

		sourceVariableValue = current.variables[matchers[t].source_variable].toString();
		sourceVariableValues[matchers[t].matcher_table_field] = sourceVariableValue;

		debug("** getMatchers: matchers[t] sourceVariableValue: " + sourceVariableValue + ", for sourceVariable: " +  matchers[t].source_variable + ". Definition was: " + matchers.definition_sys_id);

		//verify that table field and value are present, otherwise we won't add this field/value pair to the encodedQuery
		if(matchers[t].matcher_table_field && sourceVariableValue) {
			if (encodedQuery.length > 0) {
				//build a comma separated string of groups if there is more than one
				encodedQuery += ('^' + matchers[t].matcher_table_field+"="+sourceVariableValue);
			}
			else {
				encodedQuery = matchers[t].matcher_table_field+"="+sourceVariableValue;
			}
		} else {
			debug("** getLookupData: buildEncodedQuery, Matcher Table or value missing: " + matcherTable + " - the Matcher field is: " + matchers[t].matcher_table_field + " - the SourceVarVal is: " + sourceVariableValue);
		}

	}

	debug("** getLookupData: data before querying LookupTable:  Matcher Table: " + matcherTable + ". EncQuery: " + encodedQuery);

	if(matcherTable && encodedQuery) {
		var grCatLookupData = new GlideRecord(matcherTable);
		grCatLookupData.addActiveQuery();
		grCatLookupData.addEncodedQuery(encodedQuery);
		grCatLookupData.query();

		if(grCatLookupData.getRowCount() == 0) {
			debug("** getLookupData: Didn't find any record on the custom lookup table ("+matcherTable+") for the following query: " + encodedQuery);
		}

		while(grCatLookupData.next()) {
			var exactMatchArr = [];
			debug("** getLookupData: lookup record found on the custom lookup table ("+matcherTable+"): " + grCatLookupData.getUniqueValue());

			//iterate through every single matcher record, all fields to evaluate to true if the setter should be invoked
			for(var i = 0; i < matchers.length; i++) {
				//exact match handling (note: getValue converts the 'true' boolean to a 0/1 in the object of type string)
				if(matchers[i].exact_match == "1") {
					debug("** getLookupData matcher table field value is " + grCatLookupData.getValue(matchers[i].matcher_table_field) + " : type is " + typeof grCatLookupData.getValue(matchers[i].matcher_table_field));
					debug("** getLookupData source variable value is " + sourceVariableValues[matchers[i].matcher_table_field]  + " : type is " + typeof sourceVariableValues[matchers[i].matcher_table_field]);
					//Save Matcher value to a temp variable to check if it is null or not
					var tempMatcherTableFieldValue = grCatLookupData.getValue(matchers[i].matcher_table_field);
					if(JSUtil.notNil(tempMatcherTableFieldValue)){
						matcherTableFieldValue = grCatLookupData.getValue(matchers[i].matcher_table_field).toString();
						matcherTableFieldValueLowerCase = matcherTableFieldValue.toLowerCase();
						debug("** getLookupData source variable value is " + sourceVariableValues[matchers[i].matcher_table_field]);
						sourceVariableValue = sourceVariableValues[matchers[i].matcher_table_field];
						sourceVariableValLowerCase = sourceVariableValues[matchers[i].matcher_table_field].toLowerCase();

						debug("** getLookupData: Need Exact Match for field: " + matchers[i].matcher_table_field + ". Matcher Table Field Value is: " + matcherTableFieldValueLowerCase + ". SourceVariableValue is: " + sourceVariableValue);

						//only continue if lookup matcher value and variable value are the exact same value
						if(sourceVariableValLowerCase === matcherTableFieldValueLowerCase) {
							exactMatchArr.push(true);
							debug("** getLookupData: There was an exact match between: '" + sourceVariableValLowerCase + "'  and '" + matcherTableFieldValueLowerCase+"'.");

						} else {
							exactMatchArr.push(false);
							debug("** getLookupData: There was no exact match between: '" + sourceVariableValLowerCase + "'  and '" + matcherTableFieldValueLowerCase+"'.");
						}
					} else {
						debug("** getLookupData: Hit a null statement for " + matchers[i].matcher_table_field);
					}
				} else {
					exactMatchArr.push(true);
					debug("** getLookupData: Exact match not required for field: " + matchers[i].matcher_table_field);
				}
			}

			//verify that all exact match values are true, only then we may continue, leverage the JS.every() function to check if all booleans are true
			debug("** getLookupData: exactMatchArr.every(exactMatch): " + exactMatchArr.every(checkExactMatchStatus));
			if(exactMatchArr.every(checkExactMatchStatus)) {
				setterDefinitions.push(
					{
						"dlDefinitionId": matcherDefinition,
						"lookupRecord": grCatLookupData.getUniqueValue(),
						"matcherTable": matcherTable
					});
			}
		}
	}

	//Prepare the setters, before invoking them
	//prepSetters(setterDefinitions, portalUtils);
	debug("** getLookupData: setterDefinitions length before getting setters: " + setterDefinitions.length);
	var setters = portalUtils.getSetters(setterDefinitions);
	invokeSetters(setters);
}

function checkExactMatchStatus(exactMatch) {
	return exactMatch;
}

//invoke this method, when there is only one matcher record for a definition
function oneMatcherHandling(matchers, portalUtils) {
	var setterDefinitions = [];

	//for(var i=0; i < matchers.length; i++) {

	var sourceVariableValue, sourceVariableValLowerCase, matcherTableFieldValue, matcherTableFieldValueLowerCase, matcherTable = "";
	sourceVariableValue = current.variables[matchers.source_variable].toString(); //need to stringify, otherwise we deal with the object value
	sourceVariableValLowerCase = sourceVariableValue.toLowerCase();
	matcherTable =  matchers.table;
	// make sure we have a lookup table and a matcher field value
	if(matcherTable && matchers.matcher_table_field && sourceVariableValue) {
		var grCatLookupData = new GlideRecord(matcherTable);
		grCatLookupData.addActiveQuery();
		grCatLookupData.addQuery(matchers.matcher_table_field, sourceVariableValue);
		grCatLookupData.query();

		if(grCatLookupData.getRowCount() == 0) {
			debug("** getLookupData: Didn't find any record on the custom lookup table ("+matcherTable+") for field " + matchers.matcher_table_field + " and value: " + sourceVariableValue);
		}

		while(grCatLookupData.next()) {
			debug("** getLookupData: lookup record found on the custom lookup table: " + grCatLookupData.getUniqueValue());

			//exact match handling (note: getValue converts the 'true' boolean to a 0/1 in the object of type string)
			if(matchers.exact_match == "1") {

				matcherTableFieldValue = grCatLookupData.getValue(matchers.matcher_table_field).toString();
				matcherTableFieldValueLowerCase = matcherTableFieldValue.toLowerCase();

				debug("** getLookupData: Need Exact Match for field: " + matchers.matcher_table_field);
				debug("** getLookupData: Matchers source variable value in variable object: " + sourceVariableValue.toLowerCase());

				//only continue if lookup matcher value and variable value are the exact same value
				if(sourceVariableValLowerCase === matcherTableFieldValueLowerCase) {
					setterDefinitions.push(
						{
							"dlDefinitionId": matchers.dl_definition,
							"lookupRecord": grCatLookupData.getUniqueValue(),
							"matcherTable": matcherTable
						});
					debug("** getLookupData: There was an exact match between: '" + sourceVariableValLowerCase + "'  and '" + matcherTableFieldValueLowerCase+"'.");
				} else {
					debug("** getLookupData: There was no exact match between: '" + sourceVariableValLowerCase + "'  and '" + matcherTableFieldValueLowerCase+"'.");
				}
			} else {
				debug("** getLookupData: Exact match not required for field: " + matchers.matcher_table_field);
				setterDefinitions.push(
					{
						"dlDefinitionId": matchers.dl_definition,
						"lookupRecord": grCatLookupData.getUniqueValue(),
						"matcherTable": matcherTable
					});
			}
		}

	} else {
		debug("** getLookupData: Missing Data for looking up the matcher & setter, Lookup Table is: " + matcherTable + " - the Matcher field is: " + matchers.matcher_table_field + " - the SourceVarVal is: " + sourceVariableValue);
	}
	//}

	//Prepare the setters, before invoking them
	//prepSetters(setterDefinitions, portalUtils);

	var setters = portalUtils.getSetters(setterDefinitions);
	invokeSetters(setters);
}

//invoke all relevant setters
function invokeSetters(setters) {
	var lookupSetterValue = "";

	for(var i = 0; i < setters.length; i++) {
		var grLookupRecord = new GlideRecord(setters[i].table);
		if(grLookupRecord.get(setters[i].lookup_record)) {
			if(setters[i].matcher_table_field && grLookupRecord.getValue(setters[i].matcher_table_field)) {
				debug("** invokeSetters: invokeSetters, setter.matcher_table_field: " + setters[i].matcher_table_field + ". Always replace: " + setters[i].always_replace);

				//If "Always Replace" is true for that variable, we will write this value into the variable object, even if there is already a value
				if(setters[i].always_replace == "1") {
					lookupSetterValue = grLookupRecord.getValue(setters[i].matcher_table_field);
					current.variables[setters[i].source_variable] = lookupSetterValue.toString();

					debug("** invokeSetters: Always replace is turned on for field: " + setters[i].matcher_table_field + ". Setter value will be: " + grLookupRecord.getDisplayValue(setters[i].matcher_table_field) + ". The setters[i].source_variable is: " + setters[i].source_variable + ". The LookupRecord is: " + grLookupRecord.getUniqueValue() + " (LookupTable is: " + setters[i].table + ")");
				} else {
					if(!current.variables[setters[i].source_variable]) {
						lookupSetterValue = grLookupRecord.getValue(setters[i].matcher_table_field);
						current.variables[setters[i].source_variable] = lookupSetterValue.toString();
						debug("** invokeSetters: Using setter ["+setter[i].sys_id+"]. The following field is empty:" +  setters[i].source_variable);
					} else {
						debug("** invokeSetters: Cannot use setter ["+setter[i].sys_id+"], because the variable already has a value and always replace is turned off: " +  setters[i].source_variable + " - value is: " + current.variables[setters[i].source_variable] +". Lookup record was: "+  setters[i].lookup_record);
					}
				}
			} else {
				debug("** invokeSetters: Missing Data for looking up the setter, source var: " + setters[i].matcher_table_field + " - source var value: " + grLookupRecord.getValue(setters[i].matcher_table_field));
			}
		} else {
			debug("** invokeSetters: Lookup Record not found, sys_id was: " + setters[i].lookup_record);
		}
	}
}

//get only setter definitions, when at least one of the matchers from the lookup definition applies. filter out duplicates (for loop is faster then array.filter()).
//@TODO: find out if we still need this, now that there can be only one matcher definition for each matcher lookup def (should there be more than 1 matcher def, than this is an AND, so those are not processed sequentially)
/*function prepSetters(definitions, portalUtils) {
	debug("** prepSetters: PrepSetters Start: " + definitions.length);

	for(var z = 0; z < definitions.length; z++) {
		debug("** prepSetters: input definitions - definition[z].dlDefinitionId: " + definitions[z].dlDefinitionId + ". lookupRecordId: " + definitions[z].lookupRecord);
	}

	var seenDefinitions = {};
	var setterLookups = [];
	var defLength = definitions.length;
	var j = 0;
	for(var i = 0; i < defLength; i++) {

		var definitionId = definitions[i].dlDefinitionId;
		var lookupId = definitions[i].lookupRecord;

		debug("** prepSetters: seenDefinitions["+definitionId+"-"+lookupId+"]: " + seenDefinitions[definitionId+"-"+lookupId]);

		//we need to check if the combination of the definition sys_id AND the record lookup id to identify a duplicate
		if(seenDefinitions[definitionId+"-"+lookupId] !== 1) {
			seenDefinitions[definitionId+"-"+lookupId] = 1;

			var setter = {};
			setter.dlDefinitionId = definitionId;
			setter.lookupRecord = definitions[i].lookupRecord;
			setter.matcherTable = definitions[i].matcherTable;
			setterLookups.push(setter);
		}
	}

	debug("** prepSetters: PrepSetters End, without duplicate definitions sys_ids: " + setterLookups.length);
	for(var x = 0; x < setterLookups.length; x++) {
		debug("** prepSetterse: setterLookups[x].dlDefinitionId: " + setterLookups[x].dlDefinitionId + " / lookupRecordId: " + setterLookups[x].lookupRecord);
	}

	//get all relevant setter records from the server via the PortalDataLookupUtils Script Include
	var setters = portalUtils.getSetters(setterLookups);
	invokeSetters(setters);
}*/
