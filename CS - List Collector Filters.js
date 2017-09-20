function onLoad() {
   //Type appropriate comment here, and begin script below

	var myListCollector = g_list.get('peoplesoft_environment');
	myListCollector.reset();
	myListCollector.setQuery('u_list=12f2a2a34f272600af76d0af0310c713^u_active=true');

}

function onChange(control, oldValue, newValue, isLoading) {
   //Apply a filter to the list collector variable
   var collectorName = 'roles';
   var filterString = 'u_list=6e6ba0a34fcf5200f5f3d49f0310c7bb^u_active=true';

   //Find and hide the filter header elements (optional)
   //Simple method for items with only one list collector
   //$('ep').select('.row')[0].hide();
   //Advanced method for items with more than one list collector (more prone to upgrade failure)
   //var el = $('container_' + g_form.getControl(collectorName).id).select('div.row')[0].hide();

   //Reset the filter query
   window[collectorName + 'g_filter'].reset();
   window[collectorName + 'g_filter'].setQuery(filterString);
   window[collectorName + 'acRequest'](null);
}
