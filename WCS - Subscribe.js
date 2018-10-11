function($scope, spAppPubSub) {
   /* widget controller */
   var c = this;
   /* Step 3. Accept user input */

spAppPubSub.onAppSelect($scope,
    function (data) {
    var appSys = data;
		console.log(appSys);
		c.data.application = appSys;
		c.server.update();
		return appSys;
 	});
}
