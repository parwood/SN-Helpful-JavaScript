/*
 * EnterpriseTaUtils is used to process data requests for the Enterprise TA application
 *
 * @author Tony Peraza (NetImpact Strategies)
 * @author Patrick Arwood (NetImpact Strategies)
 * @author Mark Brogna (NetImpact Strategies)
 * @version 1.0
 *
 * METHODS
 * getDates
 * getPayPeriods
 * getEmployeeProfile
 * getPayCode
 * getTotalHoursByCode
 * getTimeCard
 * applyGlobalDefault
 * applyDefault
 * getTimeCodes
 * insertEntry
 * employeeSig
 * timekeeperSig
 * supervisorSig
 * setDefaultTimecard
 * getSignatures
 * getDelegates
 * getRejectReason
 *
 * setCurrentPayPeriod
 * getLocalPayPeriod
 *
 * _getProfile
 * _getIndexOfEntry
 * _getHoursAndCodes
 * _generateDay
 * _getStartDate
 */

var EnterpriseTaUtils = Class.create();
EnterpriseTaUtils.prototype = {
  initialize: function() {},

  /*
   * getPayPeriods returns an array of all payPeriods(x_usdo2_eta_pay_period)
   *
   */
  getPayPeriods: function() {
    var payPeriods = [];
    var ppIndex = 0;
    var pp = new GlideRecord("x_usdo2_eta_pay_period");
    pp.orderBy("start_date");
    pp.query();
    while (pp.next()) {
      var tmpPayPeriod = {};
      tmpPayPeriod.display = pp.display_name.toString();
      tmpPayPeriod.start_date = pp.start_date.toString();
      tmpPayPeriod.end_date = pp.end_date.toString();
      tmpPayPeriod.current = pp.current_period.toString();
      tmpPayPeriod.sys_id = pp.sys_id.toString();
      tmpPayPeriod.index = ppIndex;
      payPeriods.push(tmpPayPeriod);
      ppIndex++;
    }
    return payPeriods;
  },

  /*
   *	getEmployeeProfile returns a profile (x_usdo2_eta_profile) object
   *
   *@param user_sysId the sys_user.sys_id for a user
   */
  getEmployeeProfile: function(user_sysId) {
    var user = new GlideRecord('sys_user');
    user.addQuery('sys_id', user_sysId);
    user.query();
    if (user.next()) {
      return this._getProfile(user);
    } else {
      return {
        "error": "Employee not found"
      };
    }
  },

  /* ******************************************************************************
   * public Pay Period [x_usdo2_eta_pay_period] getLocalPayPeriod([GlideDate date])
   * Returns the pay period for the current local date (logged in user,
   * or system) based on current date or optional date parameter
   * *****************************************************************************/
  getLocalPayPeriod: function(date) {
    gs.debug("getLocalPayPeriod");
    /// Base instantiations
    var find = new GlideDate();
    gs.debug(find);
    var period = new GlideRecord("x_usdo2_eta_pay_period");
    /// Parameters & query
    if (date) {
      find.setValue(date.getByFormat("yyyy-MM-dd"));
    }
    /// TODO: I would like some validation of the date parameter--that it's an actual GlideDate
    period.addEncodedQuery("start_date<=" + find + "^end_date>=" + find);
    period.query();
    return period.next() ? period : -1; /// If we didn't find a pay period return -1
  },
  /* ** *** **** UNIT TEST **** *** ** *
				var util = new EnterpriseTaUtils()
				gs.info(util.getLocalPayPeriod().getValue());
 				*/

  /*
   * _getProfile returns a profile (x_usdo2_eta_profile) object
   *
   * @param	user_gr a sys_user GlideRecord
   */
  _getProfile: function(user_gr) {
    var profile = {};
    profile.supervisor = user_gr.getDisplayValue('manager');
    profile.name = user_gr.getDisplayValue();
    var profileRecord = new GlideRecord('x_usdo2_eta_profile');
    profileRecord.addQuery('employee', user_gr.getUniqueValue());
    profileRecord.query();
    if (profileRecord.next()) {
      var supervisor = profileRecord.getDisplayValue('supervisor');
      //if no supervisor is on employee record default to the manager on user profile
      if (supervisor != "") {
        profile.supervisor = supervisor;
      } else if (supervisor == "") {
        profileRecord.supervisor = ""; //profile.supervisor;
        profileRecord.update();
      }
      profile.timekeeper = profileRecord.getDisplayValue('timekeeper');
      profile.sys_id = profileRecord.getUniqueValue();
      return profile;
    } else {
      profileRecord.initialize();
      profileRecord.employee = user_gr.getUniqueValue();
      profileRecord.supervisor = ""; //profile.supervisor;
      profileRecord.application_access = true;
      profile.sys_id = profileRecord.insert();
    }
    return profile;
  },

  /*
   *	getDates returns an array containing date objects for a given timecard (x_usdo2_eta_timecard_entries)
   *
   * @param start_date A string containing the start date of the timecard
   * @param timecard_sysId The string containing the sys_id of the timecard
   */
  getDates: function(timecard_sysId) {
    var start_date = this._getStartDate(timecard_sysId);
    var gDate = new GlideDate();
    gDate.setValue(start_date);
    var dates = [];
    for (i = 0; i < 14; i++) {
      var hours = this._getHoursAndCodes(timecard_sysId, gDate.getByFormat("yyyy-MM-dd"));
      var date = {
        display: gDate.getByFormat("dd MMM YY"),
        query: gDate.getByFormat("yyyy-MM-dd"),
        totalHours: hours.total,
        entries: hours.entries
      };
      dates.push(date);
      gDate.addDaysLocalTime(1);
    }

    return dates;
  },
  /*
   *	getTotalHoursByCode returns an array containing time_code objects totalled by selected timecard (x_usdo2_eta_timecard_entries)
   *
   * @param dates An array containing date objects of a timecard
   */
  getTotalHoursByCode: function(dates) {
    var arrayUtil = new global.ArrayUtil();
    var entries = []; // array of objects
    var timeCodes = []; // array of strings used to evaluate if time_code already exists

    for (var i = 0; i < dates.length; i++) {
      for (var j = 0; j < dates[i].entries.length; j++) {
        var timeCode = dates[i].entries[j].time_code;
        var hours = dates[i].entries[j].hours;
        var tmpEntry = {
          timeCode: timeCode,
          hours: hours
        };
        // does timeCode exist in array
        var newCode = !arrayUtil.contains(timeCodes, timeCode);

        if (newCode) {
          entries.push(tmpEntry);
          timeCodes.push(timeCode);
        } else {
          var index = this._getIndexOfEntry(tmpEntry, entries);
          entries[index].hours += hours;
        }
      }
    }
    return entries;
  },
  /*
   * _getIndexOfEntry returns an entry object's index within an 'entry object' array
   *
   * @param	entry object (time_code, hours)
   * @param	entries object array
   */
  _getIndexOfEntry: function(entry, entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].timeCode == entry.timeCode) {
        return i;
      }
    }
    return -1; // if timeCode is not found return -1
  },
  /*
   * _getHoursAndCodes returns a day object containing  the totalHours for that day and
   * and array containing each entry object [{hours: X,time_code: Y}]
   *
   * @param timecard_sysId The string containing the sys_id of the timecard
   * @param date a date string formatted "yyyy-MM-dd"
   */
  _getHoursAndCodes: function(timecard_sysId, date) {
    var timeCodes = [];
    var hours = [];
    var shortCodes = [];
    var arrayUtil = new global.ArrayUtil();
    var totalHours = 0;
    var entry = new GlideRecord('x_usdo2_eta_entry');
    entry.addEncodedQuery("time_card=" + timecard_sysId + "^date_of_recordON" + date + "@javascript:gs.dateGenerate('" +
      date + "','start')@javascript:gs.dateGenerate('" + date + "','end')");
    entry.query();
    while (entry.next()) {
      totalHours += entry.hours;
      var newCode = !arrayUtil.contains(timeCodes, entry.time_code.getDisplayValue());

      if (newCode) {
        timeCodes.push(entry.time_code.getDisplayValue());
        hours.push(parseFloat(entry.hours));
        shortCodes.push(entry.time_code.code.toString());
      } else {
        var index = arrayUtil.indexOf(timeCodes, entry.time_code.getDisplayValue());
        hours[index] = hours[index] + entry.hours;

      }
    }
    return this._generateDay(timeCodes, hours, totalHours, shortCodes);
  },

  /*
   * _generateDay returns a day object containing the totalHours for that day and
   * and array containing each entry object [{hours: X,time_code: Y}]
   *
   * @param timeCodes an array contianing all timeCodes for entries
   * @param hours an array containing all hours used in the pay period.
   * @param totalHours the total amount of hours for a payPeriod
   */
  _generateDay: function(timeCodes, hours, totalHours, shortCodes) {
    var day = {};
    day.entries = [];
    if (totalHours == 0 && timeCodes.length == 0) {
      day.total = "--";
    } else {
      day.total = totalHours;
      for (var i = 0; i < timeCodes.length; i++) {
        var tmpEntry = {
          hours: hours[i],
          time_code: timeCodes[i],
          short_code: shortCodes[i]
        };
        day.entries.push(tmpEntry);
      }
    }
    return day;
  },

  /*
   * getTimeCard returns a timecard (x_usdo2_eta_timecard_entries) object
   *
   * @param profile_sysId the sys_id of the profile (x_usdo2_eta_profile)
   * @param payPeriod_sysId the sys_id the payPeriod (x_usdo2_eta_pay_period)
   */
  getTimeCard: function(profile_sysId, payPeriod_sysId) {
    var timecard = {};
    var timecardGR = new GlideRecord("x_usdo2_eta_timecard_entries");
    timecardGR.addEncodedQuery("employee=" + profile_sysId + "^pay_period=" + payPeriod_sysId);
    timecardGR.query();
    if (timecardGR.next()) {
      timecard.sys_id = timecardGR.sys_id.toString();
      timecard.employee_signature = timecardGR.employee_signature.toString();
      timecard.supervisor_signature = timecardGR.supervisor_signature.toString();
      timecard.timekeeper_signature = timecardGR.timekeeper_signature.toString();
      timecard.is_default = timecardGR.is_default.toString();
      timecard.comments = timecardGR.comments.toString();
      timecard.rejected = timecardGR.rejected.toString();
    } else {
      timecardGR.initialize();
      timecardGR.pay_period = payPeriod_sysId;
      timecardGR.employee = profile_sysId;
      var timecard_sysId = timecardGR.insert();
      this.applyDefault(timecard_sysId);
      timecard.sys_id = timecard_sysId;
      timecard.employee_signature = "false";
      timecard.is_default = "false";
    }
    return timecard;
  },
  /*
   * applyDefault applies the default schedule of 8 hour days monday to friday to a
   * given timecard
   *
   * @param timecard_sysId The string containing the sys_id of the timecard (x_usdo2_eta_timecard_entries)
   */
  applyGlobalDefault: function(timecard_sysId) {

    var timeCode = this.getPayCode("Regular Duty");
    //			[S, M, T, W, T, F, S, S, M, T, W, T, F, S]
    var hours = [0, 8, 8, 8, 8, 8, 0, 0, 8, 8, 8, 8, 8, 0];
    var start_date = this._getStartDate(timecard_sysId);

    var gDate = new GlideDate();
    gDate.setValue(start_date);

    for (var i = 0; i < hours.length; i++) {
      var dateOfRecord = gDate.getByFormat("yyyy-MM-dd");

      if (hours[i] > 0) {
        this.insertEntry(timecard_sysId, timeCode, hours[i], dateOfRecord);
      }
      gDate.addDaysLocalTime(1);
    }
  },

  applyDefault: function(timecard_sysId) {
    var myAudit = "[DEBUG:227] timecard_sysId: " + timecard_sysId + "\n";

    // get selected timecard
    var myTimecard = new GlideRecord("x_usdo2_eta_timecard_entries");
    myTimecard.get(timecard_sysId);
    myAudit += "[DEBUG:232] myTimecard.employee: " + myTimecard.employee + "\n";

    // search through employee's timecards for is_default == true
    var timecardGR = new GlideRecord("x_usdo2_eta_timecard_entries");
    timecardGR.addQuery('employee', myTimecard.employee);
    timecardGR.addQuery('is_default', "true");
    timecardGR.query();

    var rowCount = timecardGR.getRowCount();
    myAudit += "[DEBUG:241] timecardGR.getRowCount(): " + rowCount + "\n";

    if (rowCount == 0) {
      myAudit += "[DEBUG:244] Apply Global Default\n";
      this.applyGlobalDefault(timecard_sysId);
    } else {
      myAudit += "[DEBUG:248] Employee Specified Default\n";
      while (timecardGR.next()) {
        var payPeriods = [];

        var gDate = new GlideDate();
        gDate.setValue(timecardGR.pay_period.start_date);
        myAudit += "[DEBUG:254] gDate: " + gDate + "\n";

        // loop through 14 day pay period
        for (var i = 0; i < 14; i++) {
          var entries = [];

          var entryGR = new GlideRecord('x_usdo2_eta_entry');
          entryGR.addQuery('time_card', timecardGR.sys_id);
          entryGR.addQuery('date_of_record', gDate);
          entryGR.orderBy('date_of_record'); // Ascending Order
          entryGR.query();

          myAudit += "[DEBUG:266] entries = " + entryGR.getRowCount() + "\n";
          while (entryGR.next()) {

            var tempEntry = {
              time_code: entryGR.time_code.display_name.toString(),
              time_code_sysId: this.getPayCode(entryGR.time_code.display_name.toString()),
              hours: parseInt(entryGR.hours)
            };

            entries.push(tempEntry);
          }
          payPeriods.push(entries);
          gDate.addDaysLocalTime(1);
        }
        myAudit += "[DEBUG:280] payPeriods: " + payPeriods.length + "\n";

        var timecardDate = new GlideDate();
        timecardDate.setValue(myTimecard.pay_period.start_date);
        //myAudit += "[DEBUG:284] timecardDate: " + timecardDate + "\n";
        for (var dt = 0; dt < payPeriods.length; dt++) {

          myAudit += "[DEBUG:287] currentDate: " + timecardDate + "\n";
          myAudit += "[DEBUG:288] payPeriod.Entries: " + payPeriods[dt].length + "\n";

          for (var e = 0; e < payPeriods[dt].length; e++) {
            myAudit += "(" + dt + ")" + "(" + e + ") code: " + payPeriods[dt][e].time_code_sysId + "; hours: " + payPeriods[dt][e].hours + "\n";
            this.insertEntry(myTimecard.sys_id, payPeriods[dt][e].time_code_sysId, payPeriods[dt][e].hours, timecardDate.getByFormat("yyyy-MM-dd"));
          }
          timecardDate.addDaysLocalTime(1);
        }
      }
    }
    //gs.info(myAudit);
  },
  /*
   *getPayCode returns sys_id of a time code (x_usdo2_eta_time_codes)
   *
   * @param code the code for a timeCode (x_usdo2_eta_time_codes)
   */
  getPayCode: function(code) {
    var timeCode = new GlideRecord('x_usdo2_eta_time_codes');
    timeCode.get('display_name', code);
    return timeCode.sys_id;
  },

  /*
   * _getStartDate returns the start_date of a timecard (x_usdo2_eta_timecard_entries)
   *
   * @param timecard_sysId The string containing the sys_id of the timecard(x_usdo2_eta_timecard_entries)
   */
  _getStartDate: function(timecard_sysId) {
    var timecard = new GlideRecord('x_usdo2_eta_timecard_entries');
    timecard.get('sys_id', timecard_sysId);
    var start_date = timecard.pay_period.start_date;

    return start_date;
  },

  /*
   * getTimeCodes returns an araay of all active timeCodes (x_usdo2_eta_time_codes)
   *
   */
  getTimeCodes: function() {
    var timeCodes = [];
    var code = new GlideRecord('x_usdo2_eta_time_codes');
    code.addQuery("active", "true");
    code.orderBy('display_name');
    code.query();
    while (code.next()) {
      var tmpCode = {
        sys_id: code.sys_id.toString(),
        display_name: code.display_name.toString(),
        code: code.code.toString()
      };
      timeCodes.push(tmpCode);
    }
    return timeCodes;
  },

  /*
   * Inserts a new time entry record (x_usdo2_eta_entry)
   *
   * @param timecard_sysId The string containing the sys_id of the timecard (x_usdo2_eta_timecard_entries)
   * @param timeCode_sysId the string contiang the sysid of a time code (x_usdo2_eta_time_codes)
   * @param hours the number of hours for the new entry
   * @param dateOfRecord the date_of_record for the new entry  formatted "yyyy-MM-dd"
   */
  insertEntry: function(timecard_sysId, timeCode_sysId, hours, dateOfRecord) {
    var entry = new GlideRecord('x_usdo2_eta_entry');
    entry.initialize();
    entry.time_card = timecard_sysId;
    entry.time_code = timeCode_sysId;
    entry.hours = hours;
    entry.date_of_record = dateOfRecord;
    entry.insert();
  },

  /*
   * employeeSig adds or removes a employee signature from a timecard (x_usdo2_eta_timecard_entries)
   *
   * @param timecard_sysId The string containing the sys_id of the timecard
   * @bool if true adds an employee_signature if false removes the employee_signature
   * @name is the name of the employee signing or removing their signature
   */
  employeeSig: function(timecard_sysId, bool, name) {
    var card = new GlideRecord('x_usdo2_eta_timecard_entries');
    card.get("sys_id", timecard_sysId);
    card.employee_signature = bool;
    if (bool == false) {
      card.comments = "Employee Signature Removed: " + name + " " + "removed their timecard signature. This will also remove Supervisor/Timekeeper signatures.";
      card.supervisor_signature = bool;
      card.timekeeper_signature = bool;
    } else if (bool == true) {
      card.comments = "Employee Signature: " + name;
    }
    card.rejected = 'false';
    card.update();
  },

  timekeeperSig: function(timecard_sysId, bool, name, tk) {
    //gs.info("[DEBUG.420] TIMEKEEPER SIGNATURE");
    var delegate = this._isTkDelegate(timecard_sysId, name);
    //gs.info("tk_sig delegate" + delegate);
    if (delegate == false) {
      var card = new GlideRecord('x_usdo2_eta_timecard_entries');
      card.get("sys_id", timecard_sysId);
      card.timekeeper_signature = bool;


      if (bool == false) {
        card.comments = "Timekeeper Signature Removed: " + tk + " " + "removed their timecard signature. This will also remove Employee and Supervisor signatures.";
        card.employee_signature = bool;
        card.supervisor_signature = bool;
        card.rejected = 'true';
      } else if (bool == true) {
        card.comments = "Timekeeper Signature: " + tk;
      }
      card.rejected = 'false';
      card.update();
    } else if (delegate == true) {
      var card = new GlideRecord('x_usdo2_eta_timecard_entries');
      card.get("sys_id", timecard_sysId);
      card.timekeeper_signature = bool;


      if (bool == false) {
        card.comments = "Timekeeper Signature Removed: " + tk + "(as delegate) " + "removed their timecard signature. This will also remove Employee and Supervisor signatures.";
        card.employee_signature = bool;
        card.supervisor_signature = bool;
        card.rejected = 'true';
      } else if (bool == true) {
        card.comments = "Timekeeper Signature: " + tk + "(as delegate)";
      }
      card.rejected = 'false';
      card.update();
    }
  },

  supervisorSig: function(timecard_sysId, bool, name, sup) {
    var delegate = this._isSupDelegate(timecard_sysId, name);
    //gs.info("supervisor signature " + delegate);
    if (delegate == false) {
      var card = new GlideRecord('x_usdo2_eta_timecard_entries');
      card.get("sys_id", timecard_sysId);
      card.supervisor_signature = bool;

      if (bool == false) {
        card.comments = "Supervisor Signature Removed: " + sup + " " + "removed their timecard signature. This will also remove Employee and Supervisor signatures.";
        card.employee_signature = bool;
        card.timekeeper_signature = bool;
        card.rejected = 'true';
      } else if (bool == true) {
        card.comments = "Supervisor Signature: " + sup;
      }
      card.rejected = 'false';
      card.update();
    } else if (delegate == true) {
      var card = new GlideRecord('x_usdo2_eta_timecard_entries');
      card.get("sys_id", timecard_sysId);
      card.supervisor_signature = bool;

      if (bool == false) {
        card.comments = "Supervisor Signature Removed: " + sup + "(as delegate) " + "removed their timecard signature. This will also remove Employee and Supervisor signatures.";
        card.employee_signature = bool;
        card.timekeeper_signature = bool;
        card.rejected = 'true';
      } else if (bool == true) {
        card.comments = "Supervisor Signature: " + sup + "(as delegate)";
      }
      card.rejected = 'false';
      card.update();
    }
  },
  /*
   * setDefaultTimecard sets a timecard (x_usdo2_eta_timecard_entries) as default
   *
   * @param timecard_sysId The string containing the sys_id of the timecard
   */
  setDefaultTimecard: function(timecard_sysId) {
    var card = new GlideRecord('x_usdo2_eta_timecard_entries');
    card.get("sys_id", timecard_sysId);
    card.is_default = true;
    card.update();
  },

  /*
   * getSignatures  returns an array containing an object listing
   * the current state of signatures on a given timecard
   *
   * @param timecard_sysId The string containing the sys_id of the timecard
   */
  getSignatures: function(timecard_sysId) {
    var signatures = [];
    var card = new GlideRecord('x_usdo2_eta_timecard_entries');
    card.addQuery('sys_id', timecard_sysId);
    card.query();
    while (card.next()) {
      signatures.push({
        emp_sig: card.employee_signature.toString(),
        sup_sig: card.supervisor_signature.toString(),
        tk_sig: card.timekeeper_signature.toString()
      });
    }

    return signatures;
  },

  /*
   * Function that returns a list of sys id's for a given user where they are listed as delegate. To be used
   * for the Supervisor and Timekeeper area to handle Delegates. List is originally set to param passed to function
   * which from the widget is the sys id of the logged in user this handles sups and tks who are helping other sup and tk.
   */

  getDelegates: function(user) {
    var user_sids = user;

    var gd = new GlideRecord('x_usdo2_eta_delegates');
    gd.addQuery('delegate', user);
    gd.addQuery('active', 'true');
    gd.query();

    while (gd.next()) {

      user_sids += (',' + gd.supervisor_timekeeper.toString());

    }
    return user_sids;
  },

  /*Function to return the latest rejection reason on the timecard comments
   *journal field. Takes the timecard sys_id as a parameter
   */


  getRejectReason: function(timecard_sysId) {
    var nothing = '';
    var reason = [];
    var card = new GlideRecord('x_usdo2_eta_timecard_entries');
    card.addQuery('sys_id', timecard_sysId);
    card.query();
    while (card.next()) {
      var notes = card.comments.getJournalEntry(-1);
      var search = new global.ArrayUtil();

      var na = notes.split("\n");
      var match = filterItems(na, "REJECTION");

      if (match.length > 0) {
        reason.push({
          reject_reasons: match[0]
        });
        return reason;
      } else {
        return nothing;
      }

    }

    function filterItems(arr, query) {
      return arr.filter(function(el) {
        return el.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      });
    }
  },


  setCurrentPayPeriod: function() {
    var current = this.getLocalPayPeriod();
    if (current + 1) { /// TODO: this is a little too clever...
      current.current_period = true;
      current.update();
    }
  },
  /*Function to return the latest rejection reason on the timecard comments
   *journal field. Takes the timecard sys_id as a parameter
   */


  getEmployeeSignature: function(timecard_sysId) {
    var nothing = '';
    var reason = [];
    var card = new GlideRecord('x_usdo2_eta_timecard_entries');
    card.addQuery('sys_id', timecard_sysId);
    card.query();
    while (card.next()) {
      var notes = card.comments.getJournalEntry(-1);
      var search = new global.ArrayUtil();

      var na = notes.split("\n");
      var match = filterItems(na, "Employee Signature:");

      if (match.length > 0) {
        reason.push({
          employee_signature: match[0]
        });
        return reason;
      } else {
        return nothing;
      }

    }

    function filterItems(arr, query) {
      return arr.filter(function(el) {
        return el.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      });
    }
  },

  getSupervisorSignature: function(timecard_sysId) {
    var nothing = '';
    var reason = [];
    var card = new GlideRecord('x_usdo2_eta_timecard_entries');
    card.addQuery('sys_id', timecard_sysId);
    card.query();
    while (card.next()) {
      var notes = card.comments.getJournalEntry(-1);
      var search = new global.ArrayUtil();

      var na = notes.split("\n");
      var match = filterItems(na, "Supervisor Signature:");

      if (match.length > 0) {
        reason.push({
          supervisor_signature: match[0]
        });
        gs.info("TESTING DEFECTS ENTRY: " + match[0] + ' ' + reason);
        return reason;
      } else {
        return nothing;
      }

    }

    function filterItems(arr, query) {
      return arr.filter(function(el) {
        return el.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      });
    }
  },

  getTimekeeperSignature: function(timecard_sysId) {
    var nothing = '';
    var reason = [];
    var card = new GlideRecord('x_usdo2_eta_timecard_entries');
    card.addQuery('sys_id', timecard_sysId);
    card.query();
    while (card.next()) {
      var notes = card.comments.getJournalEntry(-1);
      var search = new global.ArrayUtil();

      var na = notes.split("\n");
      var match = filterItems(na, "Timekeeper Signature:");

      if (match.length > 0) {
        reason.push({
          timekeeper_signature: match[0]
        });
        return reason;
      } else {
        return nothing;
      }

    }

    function filterItems(arr, query) {
      return arr.filter(function(el) {
        return el.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      });
    }
  },

  _isTkDelegate: function(timecard_sysId, name) {
    var answer = '';

    var emp = '';

    var tc = new GlideRecord('x_usdo2_eta_timecard_entries');
    tc.addQuery('sys_id', timecard_sysId);
    tc.query();

    while (tc.next()) {
      emp = (tc.employee.employee + '');
    }



    var sup = '';
    var tk = '';
    //var delegate_info = [];

    var up = new GlideRecord('x_usdo2_eta_profile');
    up.addQuery('employee', 'IN', emp);
    up.query();

    while (up.next()) {

      if (up.supervisor == name) {
        //gs.info("supervisor is the same");
        //sup=up.supervisor.name;
        //delegate_info.push({supervisor:sup.toString(),
        //delegate:false});
        answer = false;
        //gs.info("Delegate Information" + answer);
      } else if (up.timekeeper == name) {
        //gs.info("timekeeper is the same");
        //tk=up.timekeeper.name;
        //delegate_info.push({timekeeper:tk,
        //delegate:false});
        answer = false;
        //gs.info("Delegate Information" + delegate_info);
      } else {
        //gs.info("neither match");
        //sup =(up.supervisor +'');
        //tk =(up.timekeeper +'');
        answer = true;
      }
    }


    /*var dels = new GlideRecord('x_usdo2_eta_delegates');
    dels.addQuery('delegate',name);
    dels.addQuery('supervisor_timekeeper','IN',sup);
    dels.query();

    while (dels.next()){
    	gs.info("checking supervisor against delegate");
    	delegate_info.push({supervisor:dels.delegate.name,
    		delegate:true});
    	}

    	var delt = new GlideRecord('x_usdo2_eta_delegates');
    	delt.addQuery('delegate',name);
    	delt.addQuery('supervisor_timekeeper','IN',tk);
    	delt.query();

    	while (delt.next()){
    		gs.info("checking timekeeper against delegate");
    		delegate_info.push({timekeeper:delt.delegate.name,
    			delegate:true});
    		}*/

    return answer;
  },
  _isSupDelegate: function(timecard_sysId, name) {
    var answer = '';
    var emp = '';

    var tc = new GlideRecord('x_usdo2_eta_timecard_entries');
    tc.addQuery('sys_id', timecard_sysId);
    tc.query();

    while (tc.next()) {
      emp = (tc.employee.employee + '');
    }



    var sup = '';
    var tk = '';
    //var delegate_info = [];

    var up = new GlideRecord('x_usdo2_eta_profile');
    up.addQuery('employee', 'IN', emp);
    up.query();

    while (up.next()) {
      gs.info("Testing Defects Line 845 TAUtils: " + up.supervisor + ' ' + name);
      if (up.supervisor == name) {
        gs.info("supervisor is the same");
        //sup=up.supervisor.name;
        //delegate_info.push({supervisor:sup.toString(),
        //delegate:false});
        answer = false;
        gs.info("Delegate Information" + answer);
      } else if (up.timekeeper == name) {
        gs.info("timekeeper is the same");
        //tk=up.timekeeper.name;
        //delegate_info.push({timekeeper:tk,
        //delegate:false});
        answer = false;
        gs.info("Delegate Information" + answer);
      } else {
        gs.info("neither match");
        //sup =(up.supervisor +'');
        //tk =(up.timekeeper +'');
        answer = true;
      }
    }


    /*var dels = new GlideRecord('x_usdo2_eta_delegates');
    dels.addQuery('delegate',name);
    dels.addQuery('supervisor_timekeeper','IN',sup);
    dels.query();

    while (dels.next()){
    	gs.info("checking supervisor against delegate");
    	delegate_info.push({supervisor:dels.delegate.name,
    		delegate:true});
    	}

    	var delt = new GlideRecord('x_usdo2_eta_delegates');
    	delt.addQuery('delegate',name);
    	delt.addQuery('supervisor_timekeeper','IN',tk);
    	delt.query();

    	while (delt.next()){
    		gs.info("checking timekeeper against delegate");
    		delegate_info.push({timekeeper:delt.delegate.name,
    			delegate:true});
    		}*/

    return answer;
  },

  type: 'EnterpriseTaUtils'
};
