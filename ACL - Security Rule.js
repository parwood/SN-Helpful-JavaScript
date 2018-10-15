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

    /* global GlideAggregate, GlideRecord, gs */
    var parent = new GlideRecord('u_product_support_case');
    parent.get('ad6ce161db560740d9ca72ec0f9619f5');
    var current = new GlideRecord('task');

    (function refineQuery (current, parent) {
      var queries = [];
      var ids = [];
      var query = '';
      // look at incidents where this case is associated;
      var incident = new GlideAggregate('incident');
      incident.addQuery('u_product_support_case', parent.getValue('sys_id'));
      incident.addQuery('problem_idISNOTEMPTY');
      incident.groupBy('problem_id');
      incident.query();
      if (incident.hasNext()) {
        while (incident.next()) {
          // for each incident associated get all problems and problem tasks
          ids.push(incident.getValue('problem_id'));
          query = 'sys_id=' + incident.getValue('problem_id');
          query += '^ORref_problem_task.problem=' + incident.getValue('problem_id');
          queries.push(query);
        }
      } else {
        queries = ['sys_id=-1'];// if no incs, set array to query that results in 0 results
      }
      // gs.print(ids);
      // current.addQuery('sys_idIN' + ids);
      // gs.print(queries.join('^NQ'));
      var task = new GlideAggregate('task');
      task.addQuery(queries.join('^OR'));
      task.groupBy('sys_id');
      task.query();
      while (task.next()) {
        ids.push(task.getValue('sys_id'));
      }
      gs.print(ids);
      current.addQuery('sys_idIN' + ids);
    })(current, parent);
