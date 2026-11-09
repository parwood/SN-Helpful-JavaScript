(function () {
    // Load the business-day schedule
    var schedGr = new GlideRecord('cmn_schedule');
    if (!schedGr.get('name', '8-5 weekdays excluding holidays')) {
        gs.error('Late risk check: schedule not found');
        return;
    }
    var sched = new GlideSchedule(schedGr.getUniqueValue());

    // Noon today, local time
    var today = new GlideDateTime();
    today.setDisplayValueInternal(today.getLocalDate().getValue() + ' 12:00:00');

    // Stop if today is a weekend or holiday
    if (!sched.isInSchedule(today)) {
        return;
    }

    // Move backward one day at a time until 1 business day has been counted
    var targetDate = new GlideDateTime(today);
    var businessDays = 0, guard = 0;
    while (businessDays < 3 && guard++ < 60) {
        targetDate.addDaysLocalTime(-1);
        if (sched.isInSchedule(targetDate)) {
            businessDays++;
        }
    }

    var dateString = targetDate.getLocalDate().getValue(); // yyyy-MM-dd

    var gr = new GlideRecord('risk');
    gr.addEncodedQuery('due_dateON' + dateString + '@javascript:gs.dateGenerate(\'' + dateString + '\',\'start\')@javascript:gs.dateGenerate(\'' + dateString + '\',\'end\')');
    gr.addActiveQuery();
    gr.query();

    while (gr.next()) {
        gs.print(gr.number);
    }
})();