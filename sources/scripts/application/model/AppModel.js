/*jshint undef:false */
var AppModel = Class.extend({
	init:function(){


		// source,
		// energy coast, 1 / 3
		// bullet coast,
		// vel, 1 / 3
		// bullet vel,
		// bullet force 1 / 3
		// APP.cookieManager = new CookieManager();
		// console.log(cookieManager.getCookie('totalPoints'));
		// APP.cookieManager.setCookie('totalPoints', 0, 500);
		// console.log(APP);
		// var coins = APP.cookieManager.getSafeCookie('coins');
		// var high = APP.cookieManager.getSafeCookie('highScore');
		// var plays = APP.cookieManager.getSafeCookie('plays');
		// APP.totalCoins = coins?coins:0;
		// APP.highScore = high?high:0;
		// APP.plays = plays?plays:0;
		// APP.currentPoints = 0;
		// // console.log(APP.cookieManager.getSafeCookie('enableds'));
		// var enableds = APP.cookieManager.getSafeCookie('enableds');
		// // console.log(enableds.split(','));
		// var j = 0;
		// if(!enableds){
		// 	console.log('whata');
		// 	enableds = '1';
		// 	for (j = 0; j < this.playerModels.length - 1; j++) {
		// 		enableds+=',0';
		// 	}
		// 	APP.cookieManager.setSafeCookie('enableds', enableds);
		// }else{
		// 	enableds = enableds.split(',');
		// 	for (j = 0; j < this.playerModels.length - 1; j++) {
		// 		console.log(enableds[j]);
		// 		if(enableds[j] === '1'){
		// 			this.playerModels[j].enabled = true;
		// 		}
		// 	}
		// }


	},
	saveScore:function(){

		APP.cookieManager.setSafeCookie('coins', APP.totalCoins);
		APP.cookieManager.setSafeCookie('highScore', APP.highScore);
		APP.cookieManager.setSafeCookie('plays', APP.plays);
		var i = 0;

		this.updateTowels();
		this.updateBurguers();

		var enableds = '1';
		for (i = 1; i < this.playerModels.length; i++) {
			if(this.playerModels[i].enabled){
				enableds+=',1';
			}else{
				enableds+=',0';
			}
		}
		console.log(enableds);
		APP.cookieManager.setSafeCookie('enableds', enableds);

		console.log(APP.cookieManager.getSafeCookie('enableds'));
	},

	zerarTudo:function(){
		APP.totalCoins = 0;
		APP.highScore = 0;
		APP.plays = 0;
		APP.cookieManager.setSafeCookie('enableds', '0');
		APP.cookieManager.setSafeCookie('coins', APP.totalCoins);
		APP.cookieManager.setSafeCookie('highScore', APP.highScore);
		APP.cookieManager.setSafeCookie('plays', APP.plays);

	},
	maxPoints:function(){
		this.currentHorde = 0;
		this.totalPoints = 999999;
		this.totalBirds = 8;
		APP.cookieManager.setCookie('totalPoints', this.totalPoints, 500);
		APP.cookieManager.setCookie('totalBirds', this.totalBirds, 500);


		for (var i = this.playerModels.length - 1; i >= 0; i--) {
			if(this.playerModels[i].toAble <= this.totalPoints){
				this.playerModels[i].able = true;
			}else{
				this.playerModels[i].able = false;
			}
		}
	},
	build:function(){

	},
	destroy:function(){

	},
	serialize:function(){

	}
});