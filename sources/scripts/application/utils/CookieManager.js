/*jshint undef:false */
var CookieManager = Class.extend({
	init:function(){

		function getLocalStorage() {
			try {
				if(window.localStorage ){
					return window.localStorage;
				}
			}
			catch (e)
			{
				return undefined;
			}
		}
		this.db = getLocalStorage();

	},
	setCookie:function(cname, cvalue, exdays){
		var d = new Date();
		var days = exdays?exdays:50000;
		d.setTime(d.getTime() + (days*24*60*60*1000));
		var expires = 'expires='+d.toUTCString();
		document.cookie = cname + '=' + cvalue + '; ' + days;
	},
	getCookie:function(name){
		return (name = new RegExp('(?:^|;\\s*)' + ('' + name).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '=([^;]*)').exec(document.cookie)) && name[1];
	},

	setSafeCookie: function (key, value) {
		window.localStorage.setItem(key, value);

		// if(this.db){
		// 	this.db.setItem(key, value);
		// }
		// if(!window.intel){
		// 	return this.setCookie(key, value);
		// }
		// window.intel.security.secureStorage.write(
		// 		function() {console.log('success');},
		// 		function(errorObj) {console.log('fail: code = ' + errorObj.code + ', message = ' + errorObj.message);},
		// 		{'id': key, 'data': value }
		// );
	},

	getSafeCookie: function (key, callback) {
		var value = window.localStorage.getItem(key);
		// alert(value);
		return value;
		// if(this.db){
		// 	this.db.getItem(key);
		// }
		// if(!window.intel){
		// 	return this.getCookie(key);
		// }
		// window.intel.security.secureStorage.read(
		// 		function(instanceID) {
		// 				window.intel.security.secureData.getData(
		// 						function(data) {
		// 								callback(data);
		// 							},
		// 						function(errorObj) {
		// 								console.log('fail: code = ' + errorObj.code + ', message = ' + errorObj.message);
		// 								callback(null);
		// 							},
		// 						instanceID
		// 				);
		// 			},
		// 		function(errorObj) {
		// 				console.log('fail: code = ' + errorObj.code + ', message = ' + errorObj.message);
		// 				callback(null);
		// 			},
		// 		{'id': key}
		// );
	}
});