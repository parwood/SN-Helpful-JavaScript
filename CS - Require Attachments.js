function onSubmit() {
   //Type appropriate comment here, and begin script below
	var cat_id = gel('sysparm_item_guid').value;
	var gr = new GlideRecord("sys_attachment");
	gr.addQuery("table_name", "sc_cart_item");
	gr.addQuery("table_sys_id", cat_id);
	gr.query();
	if (!gr.next()) {
	alert("You must attach a file to submit this request.");
	return false;
	}
}

function onSubmit() {

	var fldData = g_form.getValue('documentation');
	var noNccn = g_form.getValue('nccn_approved');
	try { //Works in non-portal ui
	var attachments = document.getElementById('header_attachment_list_label');
	if(noNccn == 'no'){
		return;
	}else if(noNccn == 'yes'){
		if(attachments.style.visibility == 'hidden' || attachments.style.display == 'none' && fldData == '') {
			alert('You must attach NCCN reference documents or copy & paste the URL before submitting this request.');
			return false;}
		}
	} catch(e) { //For Service Portal
	var count = getSCAttachmentCount();
	//g_form.addInfoMessage(noNccn + ' value')
	if(noNccn == 'no' || noNccn == 'No'){
		return;
	}else if(noNccn == 'yes' || noNccn == 'Yes');
				if(count <= 0 && fldData == '') {
			alert('You must attach NCCN reference documents or copy & paste the URL before submitting this request.');
			return false;
		}
	}
	}
