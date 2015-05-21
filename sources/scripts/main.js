/*jshint undef:false */
// var meter = new FPSMeter();
function testMobile() {
	return Modernizr.touch;// || window.innerWidth < 600;//true;// Modernizr.touch || window.innerWidth < 600;
}

// var res = {x:window.outerWidth, y: window.outerHeight};
var res = {x:window.innerWidth, y: window.innerHeight};
if(testMobile()){
	res = {x:window.innerWidth, y:window.innerHeight};
}
var resizeProportional = true;

var windowWidth = res.x;
var windowHeight = res.y;

var realWindowWidth = res.x;
var realWindowHeight = res.y;

var gameScale = 1;

var screenOrientation = 'portait';

var windowWidthVar = window.innerWidth;
var windowHeightVar = window.innerHeight;

var gameView = document.getElementById('game');
if(!testMobile()){
	document.body.className = '';
}
// console.log(gameView);

// window.addEventListener('orientationchange', function() {
// 	window.scrollTo(0, 0);
// }, false);

var ratio = 1;

var init = false;

var renderer;
var APP;

var retina = window.devicePixelRatio >= 2 ? 2 : 1;

function isPortait(){
	return window.innerHeight > window.innerWidth;
}

function possibleFullscreen(){
	var elem = gameView;
	return  elem.requestFullscreen || elem.msRequestFullscreen || elem.mozRequestFullScreen || elem.webkitRequestFullscreen;
}

function updateResolution(orientation, scale){
	if(orientation === 'portait'){
		if(screen.height > screen.width){
			windowWidth = screen.width * scale;
			windowWidthVar = screen.width;


			windowHeight =  screen.height * scale;
			windowHeightVar =  screen.height;

			windowHeight =  window.outerHeight * scale;
			windowHeightVar =  window.outerHeight* scale;

			// alert(window.outerWidth+'-'+window.outerHeight);
			// alert(windowWidth+'-'+windowHeight);

			//windowHeight =  window.devicePixelRatio >= 2 ? window.innerHeight * scale : window.outerHeight * scale;//window.outerHeight * scale;

			// windowHeight


			// if(true){//possibleFullscreen()){
			// 	windowHeight =  screen.height * scale;
			// 	windowHeightVar =  screen.height;

			// }else{
			// 	windowHeight =  window.devicePixelRatio >= 2 ? window.innerHeight * scale : window.outerHeight * scale;//window.outerHeight * scale;

			// 	// windowHeight =  window.outerHeight * scale;
			// 	windowHeightVar =  window.outerHeight* scale;
			// }


		}else{
			windowWidth = screen.height * scale;
			windowHeight = screen.width * scale;

			windowWidthVar = screen.height;
			windowHeightVar = screen.width;
		}
	}else{
		if(screen.height < screen.width){
			windowWidth = screen.width * scale;
			windowHeight = screen.height * scale;

			windowWidthVar = screen.width;
			windowHeightVar = screen.height;
		}else{
			windowWidth = screen.height * scale;
			windowHeight = screen.width * scale;

			windowWidthVar = screen.height;
			windowHeightVar = screen.width;
		}
	}
	realWindowWidth = windowWidth;
	realWindowHeight = windowHeight;
}
var isCordova = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
function update() {
	requestAnimFrame(update );
	if(!init){

		var gambs = 0;
		if(isCordova){
			gambs = device.platform.toLowerCase().indexOf('win') > -1 ? 50 :0;//50;
		}

		windowWidth = res.x;
		windowHeight = res.y - gambs;

		realWindowWidth = res.x;
		realWindowHeight = res.y;

		if(testMobile()){
			// updateResolution(screenOrientation, gameScale);
			renderer = PIXI.autoDetectRecommendedRenderer(realWindowWidth, realWindowHeight, {antialias:true, resolution:retina, view:gameView});
		}else{
			renderer = PIXI.autoDetectRenderer(realWindowWidth, realWindowHeight, {antialias:true, resolution:retina, view:gameView});
		}
		retina = 2;
		// alert('init');
		renderer.view.style.width = windowWidthVar+'px';
		renderer.view.style.height = (windowHeightVar + gambs/2)+'px';
		// alert('init1');
		APP = new Application();
		// alert('init2');
		APP.build();
		// alert('init3');
		APP.show();
		init = true;
		// alert(windowWidthVar+' - '+windowHeightVar);
	}

	// meter.tickStart();
	// var tempRation =  (window.innerHeight/windowHeight);
	// var ratioRez = resizeProportional ? tempRation < (window.innerWidth/realWindowWidth)?tempRation:(window.innerWidth/realWindowWidth) : 1;
	// windowWidthVar = realWindowWidth * ratioRez * ratio;
	// windowHeightVar = realWindowHeight * ratioRez * ratio;

	// //proportional
	// if(windowWidthVar > realWindowWidth)
	// {
	// 	windowWidthVar = realWindowWidth;
	// }
	// if(windowHeightVar > realWindowHeight)
	// {
	// 	windowHeightVar = realWindowHeight;
	// }
	if(renderer){
		// :window.innerWidth, y: window.innerHeight


//		renderer.view.style.height = window.innerHeight+'px';
//		renderer.view.style.width = window.innerWidth+'px';


		APP.update();
		renderer.render(APP.stage);
	}
	// meter.tick();
}

var initialize = function(){
	// alert('initia');
	PIXI.BaseTexture.SCALE_MODE = PIXI.scaleModes.NEAREST;
	requestAnimFrame(update);
};

var isfull = false;
function fullscreen(){
	if(isfull){
		return;
	}
	var elem = gameView;
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.msRequestFullscreen) {
		elem.msRequestFullscreen();
	} else if (elem.mozRequestFullScreen) {
		elem.mozRequestFullScreen();
	} else if (elem.webkitRequestFullscreen) {
		elem.webkitRequestFullscreen();
	}

	updateResolution(screenOrientation, gameScale);

	isfull = true;
}

// alert(window.intel);

// window.intel = true;
// window.console.log = function(){};
// initialize();
function registerAdEvents() {
	// alert('register');
	document.addEventListener('onReceiveAd', function(){alert('onReceiveAd');});
    document.addEventListener('onFailedToReceiveAd', function(data){alert(JSON.stringify(data));});
    document.addEventListener('onPresentAd', function(){alert('onPresentAd');});
    document.addEventListener('onDismissAd', function(){ alert('onDismissAd');});
    document.addEventListener('onLeaveToAd', function(){ alert('onLeaveToAd');});
    document.addEventListener('onReceiveInterstitialAd', function(){ alert('onReceiveInterstitialAd');});
    document.addEventListener('onPresentInterstitialAd', function(){ alert('onPresentInterstitialAd');});
    document.addEventListener('onDismissInterstitialAd', function(){ alert('onDismissInterstitialAd');});
}

function deviceReady(){
	initialize();
}
var apps = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
if ( apps ) {
    // PhoneGap application
    document.addEventListener('deviceready',deviceReady);
} else {
    // Web page
 //    res = {x:window.outerWidth, y: window.outerHeight};
 //    if(!testMobile()){
	//     res = {x:window.innerWidth, y: window.innerHeight};

	//     windowWidth = res.x;
	// 	windowHeight = res.y;

	// 	realWindowWidth = res.x;
	// 	realWindowHeight = res.y;

	// }
	// if(testMobile()){
	// 	updateResolution('portait', 2);
	// }
	// alert(res.x+' - '+res.y);

    setTimeout(deviceReady, 500);
    // deviceReady();
}

// document.addEventListener('deviceready', function() {
// 	// alert(admobAd);
// 	// window.plugins.AdMob.setOptions( {
//  //        publisherId: 'ca-app-pub-9306461054994106/4577256772',
//  //        interstitialAdId: 'ca-app-pub-9306461054994106/6053989976',
//  //        bannerAtTop: false, // set to true, to put banner at top
//  //        overlap: false, // set to true, to allow banner overlap webview
//  //        offsetTopBar: false, // set to true to avoid ios7 status bar overlap
//  //        isTesting: false, // receiving test ad
//  //        autoShow:true
//  //    });
// 	// registerAdEvents();
// 	// window.plugins.AdMob.requestAd(true,function(){},function(e){alert(JSON.stringify(e));});
// 	// window.plugins.AdMob.createBannerView();
// 	// window.plugins.AdMob.showAd(true,function(){},function(e){alert(JSON.stringify(e));});
// 	// window.plugins.AdMob.createBannerView();
// 	// window.plugins.AdMob.createInterstitialView();

// 	// window.plugins.AdMob.showAd(true,function(){},function(e){
// 	// 	//alert(JSON.stringify(e));
// 	// });
// 	// admobAd.initBanner('ca-app-pub-9306461054994106/3948461573', admobAd.AD_SIZE.BANNER.width, admobAd.AD_SIZE.BANNER.height);//create admob banner
// 	// admobAd.showBannerAbsolute(0,0);//show banner at absolute position

// 	initialize();
// });

// };
// (function() {
// 	var App = {
// 		init: function () {
// 			if(window.intel !== undefined){
// 				document.addEventListener('deviceready', function() {
// 					alert('device ready');
// 					initialize();
// 				});
// 			}else{
// 				initialize();
// 			}
// 		}
// 	};
// 	App.init();
// })();