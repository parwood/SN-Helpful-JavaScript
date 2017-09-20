initialize: function() {
  this.lookupDefinitions = [];
  this.debug = false;
  this.debugSourceSuffix = "*** PortalDataLookupUtils";
},

_debug : function(msg) {
  if (this.debug) {
    gs.log(msg, this.debugSourceSuffix);
  }
},


this._debug("** _getVarSetLookupDefinitions: Catalog Item SysID is: " + itemSysId);
