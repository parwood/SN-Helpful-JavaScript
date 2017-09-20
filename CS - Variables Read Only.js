function onLoad(){
	if (g_user.hasRole('admin')) {
		//g_form.setVariablesReadOnly(true);
		//g_form.addInfoMessage("Testing Script Run");
		return;
	} else try{
	g_form.setVariablesReadOnly(true);
	//g_form.addInfoMessage("Testing Script Run Not Admin");
   }
   catch(e){}
}
