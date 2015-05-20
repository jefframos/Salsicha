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
		tempWorld = APP.cookieManager.getSafeCookie('maxworld');
		tempLevel = APP.cookieManager.getSafeCookie('maxlevel');

		APP.maxWorld = (!tempWorld || tempWorld !== 'undefined' )?tempWorld:0;
		APP.maxLevel = (!tempLevel || tempLevel !== 'undefined' )?tempLevel:1;

		console.log(APP.maxWorld, APP.maxLevel, APP.cookieManager.getSafeCookie('maxworld'));
		var allHighscores = [];
		for (var i = 0; i < LEVELS.length; i++) {
			tempHigh = APP.cookieManager.getSafeCookie('highscores'+i);
			if(tempHigh){
				tempHigh = tempHigh.split(',');
				for (var j = 0; j < tempHigh.length; j++) {
					if(LEVELS[i][j]){
						LEVELS[i][j][1].highscore = parseInt(tempHigh[j]);
					}
				}
			}
		}
	},
	saveWorld:function(){
		APP.maxWorld = parseInt((APP.currentWorld) > APP.maxWorld ? (APP.currentWorld) : APP.maxWorld);
		APP.cookieManager.setSafeCookie('maxworld', APP.maxWorld);
		APP.cookieManager.setSafeCookie('maxlevel', 0);
	},
	saveScore:function(){
		APP.maxLevel = parseInt((APP.currentLevel) > APP.maxLevel ? (APP.currentLevel) : APP.maxLevel);
		if(APP.currentLevel < 0){
			APP.currentLevel = 0;
		}

		APP.cookieManager.setSafeCookie('maxlevel', APP.maxLevel);
		var tempHigh = LEVELS[APP.currentWorld][APP.currentLevel].highscore;
		LEVELS[APP.currentWorld][APP.currentLevel][1].highscore = APP.points > tempHigh ? APP.points : APP.points;
		var allHighscores = [];
		for (var i = 0; i < LEVELS.length; i++) {
			tempLevelHigh = [];
			for (var j = 0; j < LEVELS[i].length; j++) {
				tempLevelHigh.push(LEVELS[i][j][1].highscore);
			}
			APP.cookieManager.setSafeCookie('highscores'+i, tempLevelHigh.toString());
		}
		console.log('salvou isso', APP.maxWorld,APP.maxLevel);
	},

	zerarTudo:function(){
		APP.cookieManager.setSafeCookie('maxworld', 0);
		APP.cookieManager.setSafeCookie('maxlevel', 0);
		for (var i = 0; i < LEVELS.length; i++) {
			tempLevelHigh = [];
			for (var j = 0; j < LEVELS[i].length; j++) {
				tempLevelHigh.push(0);
			}
			APP.cookieManager.setSafeCookie('highscores'+i, tempLevelHigh.toString());
		}

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