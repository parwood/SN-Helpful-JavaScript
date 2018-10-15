function($scope, spAppPubSub) {
  /* widget controller */
  var c = this;
  /* Step 3. Accept user input */

  spAppPubSub.onAppSelect($scope,
    function(data) {
      var appSys = data;

      console.log(appSys);
      c.data.application = appSys;
      c.server.update();

      return appSys;
    });
}

function($scope,spAppPubSub) {
   /* widget controller */
   var c = this;

   /* Step 3. Accept user input */
	c.selectApp = function(select_app){
		spAppPubSub.notifyAppSelect(select_app.appSysID);
		console.log(select_app.appSysID);
	}

}

function spAppPubSub($rootScope){
	var selectedApp = "selectedApplication";

	function _publish (applicationSysID){
		$rootScope.$emit(selectedApp,
			{
				appSysID: applicationSysID
			});
	}
	function _subscribe($scope, handler){
		$rootScope.$on(selectedApp, function(event, message){
			handler(message.appSysID);
		});
	}
	return{
		notifyAppSelect: _publish,
		onAppSelect: _subscribe}
	}
