/*jshint undef:false */
var GameScreen = AbstractScreen.extend({
	init: function (label) {
		this._super(label);
		this.isLoaded = false;
		this.fistTime = false;
		APP.points = 0;
		if(APP.cookieManager.getSafeCookie('highscore')){
			APP.highscore = APP.cookieManager.getSafeCookie('highscore');
		}else{
			APP.cookieManager.setSafeCookie('highscore', 0);
			APP.highscore = 0;
		}


		APP.audioController.playAmbientSound('loop');
		// APP.vecColors = [0xD031F2,0xFF562D,0x9E1EE8,0x5AF271];
  //       APP.vecColorsS = ['#D031F2','#FF562D','#9E1EE8','#5AF271'];
  //       APP.vecPerfects = ['PERFECT!', 'AWESOME!', 'AMAZING!', 'GOD!!!'];
  //       APP.vecGood = ['GOOD', 'COOL', 'YO', 'NOT BAD'];
  //       APP.vecError = ['NOOOO!', 'BAD', '=(', 'NOT'];
  //       APP.currentColorID = Math.floor(APP.vecColors.length * Math.random());

  //       APP.backColor = APP.vecColors[APP.currentColorID];

		APP.mute = true;
		Howler.mute();

	},
	destroy: function () {
		this._super();
	},
	build: function () {
		this._super();
		var assetsToLoader = [];
		// var assetsToLoader = ['dist/img/atlas.json'];
		// this.loader = new PIXI.AssetLoader(assetsToLoader);
		if(assetsToLoader !== undefined && assetsToLoader.length > 0 && !this.isLoaded){
			this.initLoad();
		}else{
			this.onAssetsLoaded();
		}
		this.pinVel = {x:0, y:0};
		// console.log('buid');
		this.addSoundButton();
	},
	onProgress:function(){
		this._super();
	},
	onAssetsLoaded:function()
	{
		this.initApplication();
	},
	
	initApplication:function(){
		
		var self = this;
		

		if(!this.background){
			this.background = new PIXI.Graphics();
			this.background.beginFill(APP.backColor);
			this.background.drawRect(0,0,windowWidth, windowHeight);
			this.addChild(this.background);
		}else{
			this.addChild(this.background);

		}
		
		if(!this.interactiveBackground){
			this.interactiveBackground = new InteractiveBackground(this);
			this.interactiveBackground.build();
			this.addChild(this.interactiveBackground);
		}else{
			this.addChild(this.interactiveBackground);

		}
		// this.changeColor();
		// this.background.alpha = 0;


		this.hitTouch = new PIXI.Graphics();
		this.hitTouch.interactive = true;
		this.hitTouch.beginFill(0);
		this.hitTouch.drawRect(0,0,windowWidth, windowHeight);
		
		this.hitTouch.alpha = 0;
		this.hitTouch.hitArea = new PIXI.Rectangle(0, 40, windowWidth, windowHeight);

		this.tapDown = false;

		// this.hitTouch.touchend = this.hitTouch.mouseup = function(touchData){
			
		// };

		this.hitTouch.touchstart = this.hitTouch.mousedown = function(touchData){
			var angle = Math.atan2(touchData.global.y - self.player.getPosition().y, (touchData.global.x) - self.player.getPosition().x) * 180 / Math.PI;
			//console.log(angle);
			if(angle > -135 && angle < -45){
				self.player.stretch('UP');
			}else if(angle > -45 && angle < 45){
				self.player.stretch('RIGHT');
			}else if(angle > 45 && angle < 135){
				self.player.stretch('DOWN');
			}else{
				self.player.stretch('LEFT');
			}
		};
		this.updateable = true;


		document.body.addEventListener('keyup', function(e){
			console.log(e.keyCode);
			if(e.keyCode === 32 || e.keyCode === 40){
				self.tapDown = false;
				self.shoot((APP.force / 30) * windowHeight * 0.1);
			}
		});
		document.body.addEventListener('keydown', function(e){
			if(e.keyCode === 32 || e.keyCode === 40){
				self.tapDown = true;
			}
		});


		if(APP.withAPI){
			GameAPI.GameBreak.request(function(){
				self.pauseModal.show();
			}, function(){
				self.pauseModal.hide();
			});
		}

		this.layerManager = new LayerManager();
		this.layerManager.build('Main');

		this.addChild(this.layerManager);

		//adiciona uma camada
		this.layer = new Layer();
		this.layer.build('EntityLayer');
		this.layerManager.addLayer(this.layer);




		this.coinsLabel = new PIXI.Text('0', {align:'center',font:'72px Vagron', fill:'#FFFFFF', wordWrap:true, wordWrapWidth:500});
		// scaleConverter(this.coinsLabel.height, windowHeight, 0.2, this.coinsLabel);
		this.coinsLabel.resolution = retina;
		this.coinsLabel.alpha = 0;
		this.addChild(this.coinsLabel);

		this.crazyContent = new PIXI.DisplayObjectContainer();
		this.addChild(this.crazyContent);
		

		this.loaderBar = new LifeBarHUD(windowWidth, 30, 0, 0xFFFFFF, 0xFFFFFF);
		this.addChild(this.loaderBar.getContent());
		this.loaderBar.getContent().position.x = 0;//windowWidth / 2 - this.loaderBar.getContent().width / 2;
		this.loaderBar.getContent().position.y = 0;//windowHeight / 1.1;
		this.loaderBar.updateBar(0, 100);
		this.loaderBar.getContent().alpha = 0;

		this.initLevel();
		// this.endGame = true;
		// if(!this.fistTime){
		// 	this.changeColor(true, true);
		// 	this.openEndMenu();

		// 	this.fistTime = true;
		// }else{
		// 	this.initLevel();
		// }
		this.startLevel = false;
		this.debugBall = new PIXI.Graphics();
	},

	collideWall:function(){
		var timeline = new TimelineLite();
		var tempTrail = null;
		for (var i = 0; i < this.trails.length; i++) {
			tempTrail = this.trails[i].trail;
			if(this.trails[i].type === 'HORIZONTAL'){
				timeline.append(TweenLite.to(tempTrail, Math.abs(tempTrail.width) / 1000, {width:0, x:tempTrail.position.x + tempTrail.width, ease:'easeNone'}));
			}else{
				timeline.append(TweenLite.to(tempTrail,  Math.abs(tempTrail.height) / 1000, {height:0, y:tempTrail.position.y + tempTrail.height, ease:'easeNone'}));
			}
		}
		this.trails = [];


	},
	addTrail:function(){

		var trail = new PIXI.Graphics();
		trail.beginFill(this.player.color);
		var trailObj = {trail:trail};

		

		if(this.player.velocity.y === 0){
			if(this.trails.length > 1){
				if(this.trails[this.trails.length - 1].type === 'HORIZONTAL'){
					this.onBack = true;
					return;
				}
			}
			trail.drawRect(0, -this.player.spriteBall.height, 1, this.player.spriteBall.height);


			trail.position.x = this.player.getPosition().x;
			trail.position.y = this.player.getPosition().y;
			trailObj.type = 'HORIZONTAL';
			trailObj.side = this.player.velocity.x < 0?'LEFT':'RIGHT';
		}else{
			if(this.trails.length > 1){
				if(this.trails[this.trails.length - 1].type === 'VERTICAL'){
					this.onBack = true;
					return;
				}
			}
			trail.drawRect(-this.player.spriteBall.width / 2, 0, this.player.spriteBall.width, 1);
			trail.position.x = this.player.getPosition().x;

			// trail.position.y = this.player.getPosition().y + (this.player.velocity.y > 0 ?-this.player.spriteBall.height / 2 : this.player.spriteBall.height / 2);
			trail.position.y = this.player.getPosition().y - this.player.spriteBall.height / 2;
			trailObj.type = 'VERTICAL';
			trailObj.side = this.player.velocity.y < 0?'UP':'DOWN';
		}
		// trail.alpha = 0.5;
		this.addChild(trail);

		var joint = new PIXI.Graphics();
		joint.beginFill(this.player.color);
		joint.drawCircle(0,- this.player.spriteBall.height / 2,this.player.spriteBall.width/2);
		this.addChild(joint);
		joint.position.x = this.player.getPosition().x;
		joint.position.y = this.player.getPosition().y;

		this.trails.push({trail:joint, type:'JOINT', side:trailObj.side});
		this.trails.push(trailObj);

		this.onBack = false;
	},
	update:function(){
		if(!this.updateable){
			return;
		}
		this._super();

		// console.log('this.trails');

		if(this.onBack){
			var lastJoint = null;
			for (var k = this.trails.length - 1; k >= 0; k--) {
				if(this.trails[k].type === 'JOINT'){
					lastJoint = this.trails[k];
					break;
				}
			}

			if(lastJoint){
				console.log(lastJoint.side, lastJoint.trail.position.y);
				var remove = false;
				if(lastJoint.side === 'UP'){
					if(this.player.getPosition().y > lastJoint.trail.position.y){
						this.player.getPosition().y = lastJoint.trail.position.y;
						remove = true;
					}
				}else if(lastJoint.side === 'DOWN'){
					if(this.player.getPosition().y < lastJoint.trail.position.y){
						this.player.getPosition().y = lastJoint.trail.position.y;
						remove = true;
					}
				}else if(lastJoint.side === 'LEFT'){
					if(this.player.getPosition().x > lastJoint.trail.position.x){
						this.player.getPosition().x = lastJoint.trail.position.x;
						remove = true;
					}
				}else{
					if(this.player.getPosition().x < lastJoint.trail.position.x){
						this.player.getPosition().x = lastJoint.trail.position.x;
						remove = true;
					}
				}

				if(remove){
					this.player.velocity = {x:0, y:0};
					console.log(this.trails.length)
					var spl = this.trails.splice(this.trails.length - 2, 2);
					var j = 0;
					var sizeSpl = spl.length;
					console.log(this.trails.length)
					for (j = spl.length - 1; j >= 0; j--) {

						if(spl[j].trail.parent){
							spl[j].trail.parent.removeChild(spl[j].trail);
						}
					}

					for (j = this.trails.length - 1; j >= 0; j--) {
						if(this.trails[j].type === 'JOINT'){
							if(this.trails[j].side === 'UP'){
								this.player.velocity.y = 2;
							}else if(this.trails[j].side === 'DOWN'){
								this.player.velocity.y = -2;
							}else if(this.trails[j].side === 'LEFT'){
								this.player.velocity.x = 2;
							}else if(this.trails[j].side === 'RIGHT'){
								this.player.velocity.x = -2;
							}
							console.log(this.player.velocity, this.trails[j].side);
							break;
						}
					}
					// this.onBack = false;
				}
			}
		}


		if(this.player.velocity.y + this.player.velocity.x === 0){
			return;
		}


		if(this.trails.length > 0){
			// console.log(this.trails);
			var tempTrail = this.trails[this.trails.length - 1].trail;
			// console.log(tempTrail);
			if(this.player.velocity.y === 0){
				tempTrail.width = this.player.getPosition().x - tempTrail.position.x;
			}else{
				tempTrail.height = (this.player.getPosition().y - this.player.spriteBall.height / 2) - tempTrail.position.y;
			}
			var acc = 0;
			
		}


		for (var i = 0; i < this.trails.length - 4; i++) {
			if(this.trails[i].type !== 'JOINT'){
				var rectTrail;

				var rectPlayer  = new PIXI.Rectangle(this.player.getPosition().x - this.player.spriteBall.width/2,
					this.player.getPosition().y - this.player.spriteBall.height,
					this.player.spriteBall.width,
					this.player.spriteBall.height);

				if(this.trails[i].type === 'VERTICAL'){
					if(this.trails[i].side === 'UP'){
						rectTrail  =  new PIXI.Rectangle(this.trails[i].trail.position.x - Math.abs(this.trails[i].trail.width) / 2,// - this.trails[i].trail.width/2,
						this.trails[i].trail.position.y - Math.abs(this.trails[i].trail.height),
						Math.abs(this.trails[i].trail.width),
						Math.abs(this.trails[i].trail.height));
					}else{
						rectTrail  =  new PIXI.Rectangle(this.trails[i].trail.position.x - this.trails[i].trail.width/2,
						this.trails[i].trail.position.y,
						Math.abs(this.trails[i].trail.width),
						Math.abs(this.trails[i].trail.height));
					}
				}else{
					if(this.trails[i].side === 'RIGHT'){
						rectTrail  =  new PIXI.Rectangle(this.trails[i].trail.position.x,
							this.trails[i].trail.position.y - Math.abs(this.trails[i].trail.height),// - this.trails[i].trail.height,
							Math.abs(this.trails[i].trail.width),
							Math.abs(this.trails[i].trail.height));
					}else{
						rectTrail  =  new PIXI.Rectangle(this.trails[i].trail.position.x - Math.abs(this.trails[i].trail.width),
							this.trails[i].trail.position.y - Math.abs(this.trails[i].trail.height),// - this.trails[i].trail.height,
							Math.abs(this.trails[i].trail.width),
							Math.abs(this.trails[i].trail.height));
					}
				}

				if (rectPlayer.x + this.player.velocity.x < rectTrail.x + rectTrail.width &&
					rectPlayer.x + rectPlayer.width + this.player.velocity.x> rectTrail.x &&
					rectPlayer.y + this.player.velocity.y< rectTrail.y + rectTrail.height &&
					rectPlayer.height + rectPlayer.y + this.player.velocity.y> rectTrail.y) {
					this.player.velocity = {x:0,y:0};
					// this.trails[i].trail.alpha = 0.8;

					this.debugBall.clear();
					this.debugBall.lineStyle(1,0xFF0000);
					this.debugBall.drawRect(rectTrail.x,rectTrail.y,rectTrail.width, rectTrail.height);
					if(this.debugBall.parent){
						this.removeChild(this.debugBall);
					}
					this.addChild(this.debugBall);

					console.log(rectPlayer,rectTrail);
				}

				// this.debugBall.clear();
				// this.debugBall.lineStyle(1,0xFF0000);
				// this.debugBall.drawRect(rectPlayer.x,rectPlayer.y,rectPlayer.width, rectPlayer.height);
				// if(this.debugBall.parent){
				// 	this.removeChild(this.debugBall);
				// }
				// this.addChild(this.debugBall);
			
			}

		}

		
	},
	initLevel:function(whereInit){
		this.trails = [];
		APP.points = 0;
		this.player = new Ball({x:0,y:0}, this);
		this.player.build();
		this.layer.addChild(this.player);
		this.player.getContent().position.x = windowWidth / 2;
		this.player.getContent().position.y = windowHeight / 1.2;
		var baseFloor = windowHeight / 1.2;
		this.player.setFloor(baseFloor);

		// this.player.stretch('UP');
		

		this.base = new PIXI.Graphics();
		this.base.beginFill(0xFFFFFF);
		this.base.drawCircle(0,0,windowHeight - baseFloor);
		// this.addChild(this.base);
		this.base.alpha = 0.3;
		this.base.position.x = windowWidth / 2;
		this.base.position.y = windowHeight + this.player.spriteBall.height / 2;
		// this.brilhoBase.getContent().position.y = base +  this.player.spriteBall.height / 2;

		
		
		
		
		

		this.updateCoins();

		var self = this;
		this.addChild(self.hitTouch);
		this.force = 0;
		this.levelCounter = 800;
		this.levelCounterMax = 800;


		// this.updateCoins();
		this.changeColor(true, true);

		this.endGame = false;

		// if(this.crazyLogo){
		// 	this.crazyLogo.updateable = false;
		// }

	},










	addSoundButton:function(){
		this.soundButtonContainer = new PIXI.DisplayObjectContainer();
		this.soundOn = new PIXI.Graphics();
		this.soundOn.beginFill(0xFFFFFF);
		this.soundOn.moveTo(10,0);
		this.soundOn.lineTo(0,0);
		this.soundOn.lineTo(0,20);
		this.soundOn.lineTo(10,20);

		this.soundOn.moveTo(15,20);
		this.soundOn.lineTo(25,20);
		this.soundOn.lineTo(25,0);
		this.soundOn.lineTo(15,0);

		this.soundOff = new PIXI.Graphics();
		this.soundOff.beginFill(0xFFFFFF);
		this.soundOff.moveTo(15 + 5,10);
		this.soundOff.lineTo(0 + 5,0);
		this.soundOff.lineTo(0 + 5,20);
		
		if(APP.mute){
			this.soundButtonContainer.addChild(this.soundOff);
		}else{
			this.soundButtonContainer.addChild(this.soundOn);
		}

		this.addChild(this.soundButtonContainer);
		this.soundButtonContainer.position.x = windowWidth - this.soundButtonContainer.width *1.5;
		this.soundButtonContainer.position.y = this.soundButtonContainer.width;
		// alert(this.soundButtonContainer.width/2);
		// this.soundButtonContainer = new PIXI.DisplayObjectContainer();
		this.soundButtonContainer.hitArea = new PIXI.Rectangle(-5, -5, 35, 35);
		this.soundButtonContainer.interactive = true;
		this.soundButtonContainer.buttonMode = true;

		// this.soundButtonContainer.touchend = this.soundButtonContainer.mouseup = function(mouseData){
		var self = this;
		this.soundButtonContainer.touchstart = this.soundButtonContainer.mousedown = function(mouseData){

			if(APP.mute){
				APP.mute = false;
				Howler.unmute();
			}else{
				APP.mute = true;
				Howler.mute();
			}
			if(self.soundOff.parent){
				self.soundOff.parent.removeChild(self.soundOff);
			}
			if(self.soundOn.parent){
				self.soundOn.parent.removeChild(self.soundOn);
			}
			if(APP.mute){
				self.soundButtonContainer.addChild(self.soundOff);
			}else{
				self.soundButtonContainer.addChild(self.soundOn);
			}
		};
	},

	addCrazyMessage:function(message) {
		if(this.crazyLabel && this.crazyLabel.parent){
			if(this.crazyLabel.text === message){
				return;
			}
			this.crazyLabel.parent.removeChild(this.crazyLabel);
		}
		if(this.crazyLabel2 && this.crazyLabel2.parent){
			this.crazyLabel2.parent.removeChild(this.crazyLabel2);
		}
		var rot = Math.random() * 0.03 + 0.05;
		rot = Math.random() < 0.5? -rot:rot;
		var scl = 1;
		this.crazyLabel = new PIXI.Text(message, {align:'center',font:'40px Vagron', fill:'#9d47e0', wordWrap:true, wordWrapWidth:500});
		// scl = scaleConverter(this.crazyLabel.height, windowHeight, 0.06, this.crazyLabel);
		this.crazyLabel.resolution = 2;//retina;
		this.crazyLabel.rotation = rot;
		this.crazyLabel.position.y = windowHeight / 2+ this.crazyLabel.height;//windowHeight / 1.1 + this.crazyLabel.height / 2 / this.crazyLabel.resolution;
		this.crazyLabel.position.x = windowWidth / 2;
		this.crazyLabel.anchor = {x:0.5, y:0.5};

		this.crazyLabel2 = new PIXI.Text(message, {align:'center',font:'40px Vagron', fill:'#13c2b6', wordWrap:true, wordWrapWidth:500});
		this.crazyLabel2.resolution = 2;//retina;
		// scaleConverter(this.crazyLabel2.height, windowHeight, 0.06, this.crazyLabel2);
		this.crazyLabel2.rotation = -rot;
		this.crazyLabel2.position.y = windowHeight / 2+ this.crazyLabel2.height;//windowHeight / 1.1 + this.crazyLabel2.height / 2 / this.crazyLabel2.resolution;
		this.crazyLabel2.position.x = windowWidth / 2;
		this.crazyLabel2.anchor = {x:0.5, y:0.5};


		this.crazyContent.addChild(this.crazyLabel);
		this.crazyContent.addChild(this.crazyLabel2);
		this.crazyContent.alpha = 1;
		this.crazyContent.rotation = 0;

		// TweenLite.from(this.crazyContent, 0.2, {rotation:Math.random() * 0.8 - 0.4});

		TweenLite.from(this.crazyLabel, 0.4, {rotation:0});
		TweenLite.from(this.crazyLabel2, 0.4, {rotation:0});

		TweenLite.from(this.crazyLabel.scale, 0.2, {x:scl * 2, y:scl * 2});
		TweenLite.from(this.crazyLabel2.scale, 0.2, {x:scl * 2, y:scl * 2});
	},
	miss:function() {

		APP.audioController.playSound('error');
		this.player.breakJump = true;
		this.player.velocity.y = 0;
		var wrongLabel = APP.vecError[Math.floor(APP.vecError.length * Math.random())];
		var rot = Math.random() * 0.004;
		var tempLabel = new PIXI.Text(wrongLabel, {font:'35px Vagron', fill:'#ec8b78'});

		var errou = new Particles({x: 0, y:0}, 120, tempLabel,rot);
		errou.maxScale = this.player.getContent().scale.x;
		errou.build();
		// errou.getContent().tint = 0xf5c30c;
		errou.gravity = 0.1;
		errou.alphadecress = 0.01;
		errou.scaledecress = +0.05;
		errou.setPosition(this.player.getPosition().x - tempLabel.width / 2, this.player.getPosition().y - 50);
		this.layer.addChild(errou);

		var errou2 = new Particles({x: 0, y:0}, 120, new PIXI.Text(wrongLabel, {font:'35px Vagron', fill:'#c01f2e'}),-rot);
		errou2.maxScale = this.player.getContent().scale.x;
		errou2.build();
		// errou2.getContent().tint = 0xf5c30c;
		errou2.gravity = 0.1;
		errou2.alphadecress = 0.01;
		errou2.scaledecress = +0.05;
		errou2.setPosition(this.player.getPosition().x - tempLabel.width / 2+2, this.player.getPosition().y - 50+2);
		this.layer.addChild(errou2);

		errou2.getContent().parent.setChildIndex(errou.getContent(), errou.getContent().parent.children.length - 1);
		errou2.getContent().parent.setChildIndex(errou2.getContent(), errou2.getContent().parent.children.length - 1);


		this.player.inError = true;
		this.levelCounter -= this.levelCounterMax * 0.1;
		if(this.levelCounter < 0){
			this.levelCounter = 0;
		}
	},
	shoot:function(force) {
		if(!this.player){
			return;
		}
		if(this.player.inError){
			APP.audioController.playSound('error');
			return;
		}
		this.startLevel = true;
		this.player.jump(force);
		this.player.improveGravity();
		this.force = 0;
		// if(this.crazyContent.alpha === 0){
		// 	return;
		// }
		// TweenLite.to(this.crazyContent, 0.2, {alpha:0});
		TweenLite.to(this.loaderBar.getContent(), 0.2, {delay:0.2, alpha:1});

		var ls = Math.floor(Math.random() * 4) + 1;
		APP.audioController.playSound('laser'+ls);

		this.addCrazyMessage('HOLD');
	},
	reset:function(){
		this.destroy();
		this.build();
	},
	
	




	gameOver:function(){
		if(this.endGame){
			this.crazyContent.alpha = 0;
			this.coinsLabel.alpha = 0;
			// this.brilhoBase.getContent().alpha = 0;
			this.loaderBar.getContent().alpha = 0;
			return;
		}
		// if(window.navigator){
		// 	// navigator.vibrate(200);
		// }
		
		this.hitTouch.parent.removeChild(this.hitTouch);
		setTimeout(function(){
			self.player.preKill();
		}, 100);
		
		this.base.parent.removeChild(this.base);
		this.earthquake(40);
		this.endGame = true;
		this.crazyContent.alpha = 0;
		this.coinsLabel.alpha = 0;
		// this.brilhoBase.getContent().alpha = 0;
		this.loaderBar.getContent().alpha = 0;

		this.interactiveBackground.accel = -5;
		var self = this;
		setTimeout(function(){
			self.openEndMenu();
			APP.audioController.playSound('wub');
		}, 1000);
		// this.reset();
	},
	addRegularLabel:function(label, font, initY){
		var rot = Math.random() * 0.004;
		var tempLabel = new PIXI.Text(label, {font:font, fill:'#9d47e0'});

		var perfect = new Particles({x: 0, y:0}, 120, tempLabel,rot);
		perfect.maxScale = this.player.getContent().scale.x;
		perfect.build();
		// perfect.getContent().tint = 0xf5c30c;
		perfect.gravity = -0.2;
		perfect.alphadecress = 0.01;
		perfect.scaledecress = +0.05;
		perfect.setPosition(this.player.getPosition().x - tempLabel.width / 2, initY?initY:this.player.getPosition().y + 50);
		this.layer.addChild(perfect);

		var perfect2 = new Particles({x: 0, y:0}, 120, new PIXI.Text(label, {font:font, fill:'#13c2b6'}),-rot);
		perfect2.maxScale = this.player.getContent().scale.x;
		perfect2.build();
		// perfect2.getContent().tint = 0xf5c30c;
		perfect2.gravity = -0.2;
		perfect2.alphadecress = 0.01;
		perfect2.scaledecress = +0.05;
		perfect2.setPosition(this.player.getPosition().x - tempLabel.width / 2 + 2, initY?initY:this.player.getPosition().y + 50 + 2);
		this.layer.addChild(perfect2);

		// this.levelCounter += this.levelCounterMax * 0.02;
		// if(this.levelCounter > this.levelCounterMax){
		// 	this.levelCounter = this.levelCounterMax;
		// }
	},
	getPerfect:function(){
		//if(window.navigator){
			// navigator.vibrate(200);
		//}
		APP.audioController.playSound('perfect');
		//navigator.vibrate(200);
		this.addRegularLabel(APP.vecPerfects[Math.floor(APP.vecPerfects.length * Math.random())], '50px Vagron');
		var self = this;
		// setTimeout(function(){
		// 	self.addRegularLabel('COMBO!', '50px Vagron');
		// }, 300);
		this.earthquake(40);
		this.levelCounter += this.levelCounterMax * 0.05;
		if(this.levelCounter > this.levelCounterMax){
			this.levelCounter = this.levelCounterMax;
		}
	},
	getCoin:function(isPerfect){
		this.levelCounter += this.levelCounterMax * 0.015;
		if(this.levelCounter > this.levelCounterMax){
			this.levelCounter = this.levelCounterMax;
		}
		
		this.updateCoins();
		

		if(!isPerfect){
			this.addRegularLabel(APP.vecGood[Math.floor(APP.vecGood.length * Math.random())], '30px Vagron');
		}

		this.earthquake(20);
		this.changeColor();
	},
	changeColor:function(force, first, forceColor){
		var tempColor = 0;
		var self = this;
		if(!first){
			// console.log('randomHEre');
			APP.currentColorID = forceColor?APP.currentColorID:Math.floor(APP.vecColors.length * Math.random());
		}
		var temptempColor = APP.vecColors[APP.currentColorID];

		if(force){
			self.background.clear();
			self.background.beginFill(temptempColor);
			self.background.drawRect(-80,-80,windowWidth + 160, windowHeight + 160);
			// document.body.style.backgroundColor = APP.backColor;
		}else{
			if(forceColor){
				APP.backColor = APP.vecColors[Math.floor(APP.vecColors.length * Math.random())];
			}
			TweenLite.to(APP, 0.3, {backColor:temptempColor, onUpdate:function(){
				self.background.clear();
				self.background.beginFill(APP.backColor);
				self.background.drawRect(-80,-80,windowWidth + 160, windowHeight + 160);
			}});
		}
		document.body.style.backgroundColor = APP.vecColorsS[APP.currentColorID];
		// console.log(document.body.style.backgroundColor);
		if(!this.player){
			return;
		}
		tempColor = addBright(temptempColor, 0.65);
		// this.player.spriteBall.tint = tempColor;
		this.player.setColor(tempColor);
		this.loaderBar.setBackColor(tempColor);
		// this.loaderBar.backBaseShape.tint = tempColor;//tempColor;
	},
	earthquake:function(force){
		var earth = new TimelineLite();
		earth.append(TweenLite.to(this.container, 0.2, {y:-Math.random() * force, x:Math.random() * force - force / 2}));
		earth.append(TweenLite.to(this.container, 0.2, {y:-Math.random() * force, x:Math.random() * force - force / 2}));
		earth.append(TweenLite.to(this.container, 0.2, {y:0, x:0}));
	},
	updateCoins:function(){

		// console.log(APP.points);
		this.coinsLabel.setText(APP.points);
		TweenLite.to(this.coinsLabel, 0.2, {alpha:0.5});
		// this.coinsLabel.alpha = 0.5;
		this.coinsLabel.position.x = windowWidth / 2 - this.coinsLabel.width / 2 / this.coinsLabel.resolution;
		this.coinsLabel.position.y = windowHeight / 2 - this.coinsLabel.height / 2 / this.coinsLabel.resolution;
		if(this.background.parent){
			this.background.parent.setChildIndex(this.background, 0);
		}
		this.coinsLabel.parent.setChildIndex(this.coinsLabel, 1);

		if(this.coinsLabel.alpha < 0.5){
			return;
		}
		var tempCoins = new PIXI.Text(APP.points, {align:'center',font:'72px Vagron', fill:'#FFFFFF', wordWrap:true, wordWrapWidth:500});
		tempCoins.anchor = {x:0.5, y:0.5};
		tempCoins.resolution = retina;
		var particle = new Particles({x: 0, y:0}, 120, tempCoins,0);
		particle.maxScale = 5;
		particle.maxInitScale = 1;
		particle.build();
		particle.alphadecress = 0.02;
		particle.scaledecress = +0.02;
		particle.setPosition(this.coinsLabel.position.x + tempCoins.width / 2 / tempCoins.resolution, this.coinsLabel.position.y + tempCoins.height / 2 / tempCoins.resolution);
		this.layer.addChild(particle);

	},




	
	transitionIn:function()
	{
		this.build();
	},
	transitionOut:function(nextScreen, container)
	{
		// this._super();
		console.log('out');
		var self = this;
		if(this.frontShape){
			this.frontShape.parent.setChildIndex(this.frontShape, this.frontShape.parent.children.length - 1);
			TweenLite.to(this.frontShape, 0.3, {alpha:1, onComplete:function(){
				self.destroy();
				container.removeChild(self.getContent());
				nextScreen.transitionIn();
			}});
		}else{
			self.destroy();
			container.removeChild(self.getContent());
			nextScreen.transitionIn();
		}

		
	},
});