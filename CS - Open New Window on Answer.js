function onChange(control, oldValue, newValue, isLoading) {
	if (isLoading) {
		return;
	}
	if (newValue == 'No') {
		kbOpen();
	} else {
		g_form.hideFieldMsg('options',true);
	}
}
function kbOpen() {
	
	var realUrl = window.location.protocol + '//' + window.location.host + '/' + './com.glideapp.servicecatalog_cat_item_view.do?v=1&sysparm_id=b9987e834ff0d200af76d0af0310c726';
	
	alert('You must first order and receive the scanner.  You will now be redirected to the scanner order page.');
	
	window.location = realUrl;
	
}

function onChange(control, oldValue, newValue, isLoading) {
	if (isLoading) {
		return;
	}
	if (newValue == 'No') {
		kbOpen();
	} else {
		g_form.hideFieldMsg('options',true);
	}
}
function kbOpen() {
	
	var realUrl = window.location.protocol + '//' + window.location.host + '/' + './com.glideapp.servicecatalog_category_view.do?sysparm_parent=eb8d36ed4f7c1200af76d0af0310c73b';
	
	alert('You must first order and receive the scanner.  You will now be redirected to the scanner order page.');
	
	//window.location.href = realUrl;
	getTopWindow().NavPageManager.get().getPane('gsft_main').loadLinkFromUrl('realUrl');
	
}