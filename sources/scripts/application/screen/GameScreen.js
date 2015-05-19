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
		APP.mute = true;
		Howler.mute();

	},
	destroy: function () {
		this._super();
		this.environment = [];
		this.trails = [];
		this.vecTiles = null;
	},
	build: function () {
		this._super();
		var assetsToLoader = [];
		if(assetsToLoader !== undefined && assetsToLoader.length > 0 && !this.isLoaded){
			this.initLoad();
		}else{
			this.onAssetsLoaded();
		}
		this.pinVel = {x:0, y:0};
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

		this.hitTouch = new PIXI.Graphics();
		this.hitTouch.interactive = true;
		this.hitTouch.beginFill(0);
		this.hitTouch.drawRect(0,0,windowWidth, windowHeight);

		this.hitTouch.alpha = 0;
		APP.stage.addChild(this.hitTouch);

		this.tapDown = false;

		if(!testMobile()){

			document.body.addEventListener('keydown', function(e){
				if(self.player.moveAccum > 0){
					return;
				}
				if(self.player && !self.player.blockMove){
					if(e.keyCode === 87 || e.keyCode === 38){
						self.player.stretch('UP');
					}
					else if(e.keyCode === 83 || e.keyCode === 40){
						self.player.stretch('DOWN');
					}
					else if(e.keyCode === 65 || e.keyCode === 37){
						self.player.stretch('LEFT');
					}
					else if(e.keyCode === 68 || e.keyCode === 39){
						self.player.stretch('RIGHT');
					}
					self.onWall = false;
				}
			});
		}else{

			if(this.hammer){
				this.hammer.off('swipeup');
				this.hammer.off('swiperight');
				this.hammer.off('swipeleft');
				this.hammer.off('swipedown');
			}
			var swipe     = new Hammer.Swipe();
			this.hammer    = new Hammer.Manager(renderer.view);
			this.hammer.add(swipe);

			this.hammer.on('swipeup', function() {
				self.player.stretch('UP');
			});

			this.hammer.on('swipedown', function() {
				self.player.stretch('DOWN');
			});

			this.hammer.on('swiperight', function() {
				self.player.stretch('RIGHT');
			});

			this.hammer.on('swipeleft', function() {
				self.player.stretch('LEFT');
			});

			this.updateable = true;
		}
		// if(APP.withAPI){
		// 	GameAPI.GameBreak.request(function(){
		// 		self.pauseModal.show();
		// 	}, function(){
		// 		self.pauseModal.hide();
		// 	});
		// }

		this.gameContainer = new PIXI.DisplayObjectContainer();
		this.addChild(this.gameContainer);

		this.trailContainer = new PIXI.DisplayObjectContainer();
		this.gameContainer.addChild(this.trailContainer);

		this.layerManager = new LayerManager();
		this.layerManager.build('Main');

		this.gameContainer.addChild(this.layerManager.getContent());

		//adiciona uma camada
		this.layer = new Layer();
		this.layer.build('EntityLayer');
		this.layerManager.addLayer(this.layer);

		this.HUDLayer = new Layer();
		this.HUDLayer.build('HUDLayer');
		this.layerManager.addLayer(this.HUDLayer);

		this.coinsLabel = new PIXI.Text('0', {align:'center',font:'48px Vagron', fill:'#FFFFFF', wordWrap:true, wordWrapWidth:500});
		this.coinsLabel.resolution = retina;
		this.coinsLabel.alpha = 0.5;
		this.coinsLabel.position.x = 60;//windowWidth / 2 - this.coinsLabel.width / 2 / this.coinsLabel.resolution;
		this.coinsLabel.position.y = 0;
		this.addChild(this.coinsLabel);

		this.crazyContent = new PIXI.DisplayObjectContainer();
		this.addChild(this.crazyContent);

		this.initLevel();
		this.startLevel = false;
		this.debugBall = new PIXI.Graphics();



		this.backButtonContainer = new PIXI.DisplayObjectContainer();
        this.backButton = new PIXI.Graphics();
        this.backButton.beginFill(0xFFFFFF);
        this.backButton.moveTo(20,0);
        this.backButton.lineTo(20,20);
        this.backButton.lineTo(0,10);
        this.backButton.lineTo(20,0);
        this.backButtonContainer.addChild(this.backButton);
        this.backButtonContainer.scope = this;
        this.backButtonContainer.interactive = true;
        this.backButtonContainer.buttonMode = true;
        this.backButtonContainer.touchstart = this.backButtonContainer.mousedown = this.backFunction;
        this.backButtonContainer.position.x = 20;
        this.backButtonContainer.position.y = 20;

        this.addChild(this.backButtonContainer);
	},

	backFunction:function(event){
		var scope = event.target.scope;
		scope.screenManager.change('Levels');
	},
	collideWall:function(nonRecoil){
		if(this.trails.length <= 0){
			return;
		}
		var self = this;
		self.recoil = true;
		this.recoilTimeline = new TimelineLite({onComplete:function(){
			// while(self.trailContainer.children.length){
			// 	self.trailContainer.removeChildAt(0);
			// }
		}});
		var frames = 1500;
		var tempTrail = null;
		function removeSelf(target){
			if(target && target.parent){
				target.parent.removeChild(target);
			}
		}
		for (var i = 0; i < this.trails.length; i++) {
			tempTrail = this.trails[i].trail;
			if(this.trails[i].type === 'HORIZONTAL'){
				this.recoilTimeline.append(TweenLite.to(tempTrail, Math.abs(tempTrail.width) / frames, {width:0, x:tempTrail.position.x + tempTrail.width, ease:'easeNone', onComplete:removeSelf, onCompleteParams:[tempTrail]}));
			}else{
				this.recoilTimeline.append(TweenLite.to(tempTrail,  Math.abs(tempTrail.height) / frames, {height:0, y:tempTrail.position.y + tempTrail.height, ease:'easeNone', onComplete:removeSelf, onCompleteParams:[tempTrail]}));
			}
		}
		function onStart(){
			self.recoil = false;
			self.changeColor();
		}
		// this.player.getContent().scale = {x:1,y:1};
		// if(this.trails[this.trails.length - 1].type === 'HORIZONTAL'){
		// 	this.recoilTimeline.append(TweenLite.from(this.player.getContent().scale,  1, {x:0.5, ease:'easeOutElastic', onStart:onStart}));
		// }else{
		// 	this.recoilTimeline.append(TweenLite.from(this.player.getContent().scale,  1, {y:0.5, ease:'easeOutElastic', onStart:onStart}));
		// }
		if(!nonRecoil){
			this.player.returnCollide();
		}
		this.trails = [];


	},
	addTrail:function(){

		// if(!this.onWall){
		var trail = new PIXI.Graphics();
		trail.beginFill(this.player.color);
		var trailObj = {trail:trail};


		if(this.player.velocity.y === 0){
			if(this.trails.length > 1 && !this.onWall){
				if(this.trails[this.trails.length - 1].type === 'HORIZONTAL'){
					this.onBack = true;
					// console.log('why here?');
					return;
				}
			}
			trail.drawRect(0, -this.player.height, 1, this.player.height);


			trail.position.x = this.player.getPosition().x;
			trail.position.y = this.player.getPosition().y + this.player.height / 2;
			trailObj.type = 'HORIZONTAL';
			trailObj.side = this.player.velocity.x < 0?'LEFT':'RIGHT';
		}else{
			if(this.trails.length > 1 && !this.onWall){
				if(this.trails[this.trails.length - 1].type === 'VERTICAL'){
					this.onBack = true;
					return;
				}
			}
			trail.drawRect(-this.player.width / 2, 0, this.player.width, 1);
			trail.position.x = this.player.getPosition().x;

			// trail.position.y = this.player.getPosition().y + (this.player.velocity.y > 0 ?-this.player.height / 2 : this.player.height / 2);
			trail.position.y = this.player.getPosition().y;// - this.player.height / 2;
			trailObj.type = 'VERTICAL';
			trailObj.side = this.player.velocity.y < 0?'UP':'DOWN';
		}

		// trail.alpha = 0.5;

		var joint = new PIXI.Graphics();
		joint.beginFill(this.player.color);
		joint.drawCircle(0,0,this.player.width/2);
		this.trailContainer.addChild(joint);
		this.trailContainer.addChild(trail);
		joint.position.x = this.player.getPosition().x;
		joint.position.y = this.player.getPosition().y;

		this.trails.push({trail:joint, type:'JOINT', side:trailObj.side});
		this.trails.push(trailObj);

		// if(this.onBack){
		// 	var self = this;
		// 	this.blockCollide = true;
		// 	setTimeout(function(){
		// 		self.blockCollide = false;
		// 	}, 300);
		// }
		// this.player.getContent().parent.setChildIndex(this.player.getContent(), this.player.getContent().parent.children.length - 1);
		this.onBack = false;
		// }
	},
	update:function(){
		if(!this.updateable){
			return;
		}

		this.updateMapPosition();
		this._super();
		if(this.layerManager){
			this.layerManager.update();
		}
		if(this.endGame){
			return;
		}

		this.coinsLabel.parent.setChildIndex(this.coinsLabel, this.coinsLabel.parent.children.length - 1);



		if(this.onBack){
			var lastJoint = null;
			for (var k = this.trails.length - 1; k >= 0; k--) {
				if(this.trails[k].type === 'JOINT'){
					lastJoint = this.trails[k];
					break;
				}
			}

			if(lastJoint){
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
					this.player.stop();
					var spl = this.trails.splice(this.trails.length - 2, 2);
					var j = 0;
					var sizeSpl = spl.length;
					for (j = spl.length - 1; j >= 0; j--) {

						if(spl[j].trail.parent){
							spl[j].trail.parent.removeChild(spl[j].trail);
						}
					}

					for (j = this.trails.length - 1; j >= 0; j--) {
						if(this.trails[j].type === 'JOINT'){
							// console.log('WHY');
							this.player.moveBack(this.trails[j].side);
							break;
						}
					}
				}
			}
			this.trailCollide(true);
		}else{
			this.trailCollide();
		}


		if(this.player.velocity.y + this.player.velocity.x === 0){
			return;
		}


		if(this.trails.length > 1){
			var tempTrail = this.trails[this.trails.length - 1].trail;
			if(this.player.velocity.y === 0){
				tempTrail.width = this.player.getPosition().x - tempTrail.position.x;
			}else{
				tempTrail.height = (this.player.getPosition().y) - tempTrail.position.y;
			}
		}


		var tempTiles = this.getTileByPos(this.player.getPosition().x, this.player.getPosition().y);
		var typeTile = this.getTileType(tempTiles.i, tempTiles.j);

		if(typeTile === 1){
			this.player.getContent().position.x -= this.player.velocity.x;
			this.player.getContent().position.y -= this.player.velocity.y;
			this.player.stop();
			this.collideWall();
		}else if(typeTile === 2){
			this.gameOver();
			this.player.preKill();
		}else if(typeTile === 3){
			// console.log(this.trails.length);
			this.player.explode2();
			this.player.stop();
			// console.log('ESTRANHO');
			this.player.moveBack(this.trails[this.trails.length - 1].side);
			this.onBack = true;
			// var dest = this.player.returnCollide();
			// this.onWall = true;
			// if(this.trails.length > 1){
			// 	var tempTrail2 = this.trails[this.trails.length - 1].trail;
			// 	var tempStretch = {width:tempTrail2.width, height:tempTrail2.height};
			// 	if(this.player.velocity.y === 0){
			// 		tempStretch.width = dest.x - tempTrail2.position.x;
			// 	}else{
			// 		tempStretch.height = dest.y - tempTrail2.position.y;
			// 	}
			// 	TweenLite.to(tempTrail2, 0.5, tempStretch);

			// 	// this.trails[this.trails.length - 1].type = 'JOINT';
			// 	// var last = this.trails.pop();
			// 	// var last = this.trails.pop();
			// 	// last.trail.parent.removeChild(last.trail);
			// 	// if(this.trails[this.trails.length - 1].type === ''){
			// }
			// this.player.stop();
		}
	},
	trailCollide:function(justEnemies){
		// console.log(this.blockCollide);
		for (var i = 0; i < this.trails.length; i++) {
			if(this.blockCollide){
				break;
			}

			if(this.trails[i].type !== 'JOINT'){
				var rectTrail;
				var tempEntity = null;
				var tempTrail = this.trails[i];
				for (var j = 0; j < this.layer.childs.length; j++) {
					tempEntity = this.layer.childs[j];
					if(tempEntity.type === 'enemy' || (!justEnemies && tempEntity.type === 'player' && i < this.trails.length - 5)){ //ERA 6 isso antes
						var rectPlayer  = new PIXI.Rectangle(tempEntity.getPosition().x - tempEntity.spriteBall.width/2,
							tempEntity.getPosition().y - tempEntity.spriteBall.height / 2,
							tempEntity.spriteBall.width,
							tempEntity.spriteBall.height);

						if(tempTrail.type === 'VERTICAL'){
							if(tempTrail.side === 'UP'){
								rectTrail  =  new PIXI.Rectangle(tempTrail.trail.position.x - Math.abs(tempTrail.trail.width) / 2,// - tempTrail.trail.width/2,
								tempTrail.trail.position.y - Math.abs(tempTrail.trail.height),
								Math.abs(tempTrail.trail.width),
								Math.abs(tempTrail.trail.height));
							}else{
								rectTrail  =  new PIXI.Rectangle(tempTrail.trail.position.x - tempTrail.trail.width/2,
								tempTrail.trail.position.y,
								Math.abs(tempTrail.trail.width),
								Math.abs(tempTrail.trail.height));
							}
						}else{
							if(tempTrail.side === 'RIGHT'){
								rectTrail  =  new PIXI.Rectangle(tempTrail.trail.position.x,
									tempTrail.trail.position.y - Math.abs(tempTrail.trail.height),// - tempTrail.trail.height,
									Math.abs(tempTrail.trail.width),
									Math.abs(tempTrail.trail.height));
							}else{
								rectTrail  =  new PIXI.Rectangle(tempTrail.trail.position.x - Math.abs(tempTrail.trail.width),
									tempTrail.trail.position.y - Math.abs(tempTrail.trail.height),// - tempTrail.trail.height,
									Math.abs(tempTrail.trail.width),
									Math.abs(tempTrail.trail.height));
							}
						}

						if (rectPlayer.x + tempEntity.velocity.x < rectTrail.x + rectTrail.width &&
							rectPlayer.x + rectPlayer.width + tempEntity.velocity.x> rectTrail.x &&
							rectPlayer.y + tempEntity.velocity.y< rectTrail.y + rectTrail.height &&
							rectPlayer.height + rectPlayer.y + tempEntity.velocity.y> rectTrail.y) {
							if(tempEntity.type === 'enemy'){
								tempEntity.preKill();
								this.gameOver();
							}else if(!this.player.blockCollide2){
								this.player.explode2();
								this.player.stopReturn();
								this.player.stop();
								// console.log('ESTRANHO');
								this.player.moveBack(this.trails[this.trails.length - 1].side);
								this.onBack = true;
								// this.player.returnCollide2();
							}
						}
					}
				}

			}

		}
	},
	updateMapPosition:function(){


		// TweenLite.to(this.gameContainer.position, 0.5, {x: windowWidth/2 - this.player.getPosition().x * this.gameContainer.scale.x,
			// y:windowHeight/2 - this.player.getPosition().y * this.gameContainer.scale.y});
		this.gameContainer.position.x = windowWidth/2 - this.player.getPosition().x * this.gameContainer.scale.x;
		this.gameContainer.position.y = windowHeight/2 - this.player.getPosition().y * this.gameContainer.scale.y;


		var tempScale = 1;
		if(this.trailContainer.width / this.gameContainer.scale.x > windowWidth / 2){
			tempScale = windowWidth / 2 / this.trailContainer.width;
		}
		if(this.trailContainer.height / this.gameContainer.scale.y > windowHeight / 2){
			var tempH = windowHeight / 2 / this.trailContainer.height;
			tempScale = tempScale < tempH? tempScale: tempH;
		}

		TweenLite.to(this.gameContainer.scale, 1, {x:tempScale, y:tempScale});
	},
	initLevel:function(whereInit){
		if(windowWidth < windowHeight){
			APP.tileSize = {w:windowWidth * 0.06,h:windowWidth * 0.06};
		}else{
			APP.tileSize = {w:windowHeight * 0.06,h:windowHeight * 0.06};
		}
		APP.standerdVel = APP.tileSize.w * 0.05;
		this.trails = [];

		this.recoil = false;
		// this.gameOver = false;
		APP.points = 0;
		this.player = new Ball({x:0,y:0}, this);
		this.player.build();
		this.layer.addChild(this.player);
		this.player.getContent().position.x = windowWidth / 2;
		this.player.getContent().position.y = windowHeight / 1.2;

		// this.player.standardVelocity = 3;

		this.portal = new EndPortal( this);
		this.portal.build();
		this.layer.addChild(this.portal);

		var self = this;
		this.force = 0;
		this.levelCounter = 800;
		this.levelCounterMax = 800;

		this.changeColor(true, true);

		this.endGame = false;

		this.initEnvironment();

		this.updateMapPosition();

		TweenLite.from(this.getContent(), 0.5,{y:-50, alpha:0});

	},
	initEnvironment: function(){
		this.environment = [];

		this.mapSize = {i:LEVELS[0][0].length,j:LEVELS[0].length};
		this.environment = LEVELS[APP.currentWorld][APP.currentLevel][0];

		this.drawMap();
		this.drawPlayer();
		this.drawEndPortal();

	},
	drawMap: function(){
		if(!this.environment){
			return;
		}
		if(this.vecTiles && this.vecTiles.length > 0){
			for (var k = 0; k < this.vecTiles.length; k++) {
				var tempTile = this.getTileByPos(this.vecTiles[k].x + 5,this.vecTiles[k].y + 5);
				var tileType = this.getTileType(tempTile.i, tempTile.j);
				try{
					this.drawTile(tileType, tempTile.i, tempTile.j, this.vecTiles[k]);
				}catch(error){
					console.log(error);
				}
			}
			return;
		}
		this.vecTiles = [];
		this.vecMovEnemiesTemp = [];
		this.vecMovEnemies = [];
		for (var i = 0; i < this.environment.length; i++) {
			for (var j = 0; j < this.environment[i].length; j++) {
				if(this.environment[i][j] instanceof Array){
					for (var l = 0; l < this.environment[i][j].length; l++) {
						this.drawTile(this.environment[i][j][l], j, i);
					}
				}else{
					this.drawTile(this.environment[i][j], j, i);
				}
			}
		}

		this.hitTouch.hitArea = new PIXI.Rectangle(-100, -100, this.getContent().width, this.getContent().height);
	},
	drawTile: function(type, i,j, exists){
		if(type >= 1 && type <= 3){
			var tempColor = addBright(this.player.color,1 - (APP.currentWorld + 1) * 0.15);
			var tempGraphics = exists?exists:new PIXI.Graphics();
			tempGraphics.clear();
			var isEnemy = false;
			if(type === 1){
				if(APP.currentWorld >1){
					tempGraphics.lineStyle(1,tempColor);
				}else{
					tempGraphics.beginFill(tempColor);
				}
				tempGraphics.drawRect(0,0,APP.tileSize.w, APP.tileSize.h);
			}else if(type === 2){
				tempColor = addBright(this.player.color,0.7 - (APP.currentWorld + 1) * 0.15);
				if(APP.currentWorld >1){
					tempGraphics.lineStyle(1,tempColor);
				}else{
					tempGraphics.beginFill(tempColor);
				}

				var temp1 = -1;
				var line = 6;
				var sz = -3;
				for (var ii = 0; ii <= line; ii++) {
					if(ii === 0){
						tempGraphics.moveTo(APP.tileSize.w/line * ii, -(sz * temp1));
					}else{
						tempGraphics.lineTo(APP.tileSize.w/line * ii, -(sz * temp1));
					}
					temp1 *= -1;
				}

				for (ii = 0; ii <= line; ii++) {
					tempGraphics.lineTo(APP.tileSize.w - (sz * temp1), APP.tileSize.h/line * ii);
					temp1 *= -1;
				}
				temp1 = 1;
				for (ii = 0; ii <= line; ii++) {
					tempGraphics.lineTo(APP.tileSize.w - (APP.tileSize.w/line * ii), APP.tileSize.h - (sz * temp1));
					temp1 *= -1;
				}

				for (ii = 0; ii <= line; ii++) {
					tempGraphics.lineTo(-sz * temp1, APP.tileSize.h - (APP.tileSize.h/line * ii));
					temp1 *= -1;
				}
				isEnemy = true;
			}else if(type === 3){
				tempColor = addBright(this.player.color,0.8 - (APP.currentWorld + 1) * 0.15);
				if(APP.currentWorld >1){
					tempGraphics.lineStyle(1,tempColor);
				}else{
					tempGraphics.beginFill(tempColor);
				}
				tempGraphics.drawRoundedRect(0,0,APP.tileSize.w, APP.tileSize.h, APP.tileSize.w*0.2);
			}

			tempGraphics.position.x = i * APP.tileSize.w;
			tempGraphics.position.y = j * APP.tileSize.h;
			this.gameContainer.addChild(tempGraphics);
			if(!exists){
				this.vecTiles.push(tempGraphics);
			}
		}
		if(exists){
			return;
		}
		if(type === 4){
			var coin = new Coin(this);
			coin.build();
			this.layer.addChild(coin);
			coin.getContent().position.x = i * APP.tileSize.w + APP.tileSize.w/2;
			coin.getContent().position.y = j * APP.tileSize.h + APP.tileSize.h/2;
		}
		if(type instanceof Array){
			if(type[0] > 10){

				this.vecMovEnemiesTemp.push({index:type[1],id: type[0], x:i * APP.tileSize.w + APP.tileSize.w/2, y:j * APP.tileSize.h + APP.tileSize.h/2});
				var count = 0;
				var tempPositions = [];
				for (var k = 0; k < this.vecMovEnemiesTemp.length; k++) {
					if(this.vecMovEnemiesTemp[k].id === type[0]){
						count ++;
						tempPositions.push({x:this.vecMovEnemiesTemp[k].x,y:this.vecMovEnemiesTemp[k].y, index: this.vecMovEnemiesTemp[k].index});
					}
				}
				var enemyMov = null;
				if(count === 2){
					var tempVel = type.length > 2?type[2]:2;
					enemyMov = new Enemy2(this, type[0], type.length >= 4 && type[3]);
					enemyMov.standardVelocity = tempVel;
					enemyMov.build();
					this.layer.addChild(enemyMov);
					enemyMov.getContent().position.x = i * APP.tileSize.w + APP.tileSize.w/2;
					enemyMov.getContent().position.y = j * APP.tileSize.h + APP.tileSize.h/2;
					enemyMov.setWaypoints(tempPositions);
					this.vecMovEnemies.push(enemyMov);
				}else if(count > 2){
					tempPositions.sort(function(a, b){
						return a.index-b.index;
					});
					for (var l = 0; l < this.vecMovEnemies.length; l++) {
						if(this.vecMovEnemies[l].id === type[0]){
							this.vecMovEnemies[l].setWaypoints(tempPositions);
						}
					}
				}
			}
		}
	},
	drawEndPortal: function(){
		for (var i = 0; i < this.environment.length; i++) {
			for (var j = 0; j < this.environment[i].length; j++) {
				if(this.environment[i][j] === 8){
					this.portal.getContent().position.x = j * APP.tileSize.w + APP.tileSize.w/2;
					this.portal.getContent().position.y = i * APP.tileSize.h + APP.tileSize.h/2;
				}
			}
		}
	},
	drawPlayer: function(){
		for (var i = 0; i < this.environment.length; i++) {
			for (var j = 0; j < this.environment[i].length; j++) {
				if(this.environment[i][j] === 7){
					this.player.getContent().position.x = j * APP.tileSize.w + APP.tileSize.w/2;
					this.player.getContent().position.y = i * APP.tileSize.h + APP.tileSize.h/2;
				}
			}
		}
	},

	getTileByPos: function(x,y){
		var tempX = Math.floor(x / APP.tileSize.w);
		var tempY = Math.floor(y / APP.tileSize.h);
		var ret = {i:tempX, j:tempY};
		return ret;
	},

	getTileType: function(i,j){
		if(!this.environment || !this.environment.length){
			return 0;
		}
		try{
			return this.environment[j][i];
		}catch(err){
			return 1;
		}
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

		this.soundOff.moveTo(0,0);
		this.soundOff.lineTo(20,10);
		this.soundOff.lineTo(0,20);

		if(APP.mute){
			this.soundButtonContainer.addChild(this.soundOff);
		}else{
			this.soundButtonContainer.addChild(this.soundOn);
		}

		this.addChild(this.soundButtonContainer);
		this.soundButtonContainer.position.x = windowWidth - 40;
		this.soundButtonContainer.position.y = 20;
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

	addCrazyMessage:function(message, time) {
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

		TweenLite.from(this.crazyLabel, time, {delay:0.3, alpha:0});
		TweenLite.from(this.crazyLabel2, time, {delay:0.3, alpha:0});
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

	nextLevel:function(){
		this.collideWall(true);
		this.player.moveAccum = 50000;
		this.player.stop();
		APP.currentLevel ++;
		this.addCrazyMessage('YOU"RE AWESOME', 1);
		var self = this;
		TweenLite.to(this.gameContainer.scale, 0.5, {x:this.gameContainer.scale.x * 1.5, y:this.gameContainer.scale.y * 1.5});
		TweenLite.to(this.gameContainer, 0.5, {alpha:0, delay:0.8, onComplete:function(){
			self.reset();
		}});
	},
	reset:function(){
		this.destroy();
		this.build();
	},


	gameOver:function(){
		if(this.endGame){
			return;
		}
		// if(window.navigator){
		// 	// navigator.vibrate(200);
		// }
		this.collideWall();
		if(this.hitTouch && this.hitTouch.parent){
			this.hitTouch.parent.removeChild(this.hitTouch);
		}
		setTimeout(function(){
			self.player.preKill();
		}, 50);

		this.earthquake(40);
		this.endGame = true;
		this.crazyContent.alpha = 0;
		this.coinsLabel.alpha = 0;
		var self = this;
		setTimeout(function(){
			self.endGame = false;
			APP.audioController.playSound('wub');
			if(self.recoilTimeline){
				self.recoilTimeline.kill();
			}
			self.reset();
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
		this.HUDLayer.addChild(perfect);

		var perfect2 = new Particles({x: 0, y:0}, 120, new PIXI.Text(label, {font:font, fill:'#13c2b6'}),-rot);
		perfect2.maxScale = this.player.getContent().scale.x;
		perfect2.build();
		// perfect2.getContent().tint = 0xf5c30c;
		perfect2.gravity = -0.2;
		perfect2.alphadecress = 0.01;
		perfect2.scaledecress = +0.05;
		perfect2.setPosition(this.player.getPosition().x - tempLabel.width / 2 + 2, initY?initY:this.player.getPosition().y + 50 + 2);
		this.HUDLayer.addChild(perfect2);

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

		this.earthquake(20);
		this.changeColor();
	},
	changeColor:function(force, first, forceColor){
		var tempColor = 0;
		var self = this;
		if(!first){
			APP.currentColorID = forceColor?APP.currentColorID:Math.floor(APP.vecColors.length * Math.random());
		}
		var temptempColor = APP.vecColors[APP.currentColorID];

		if(force){
			APP.background.clear();
			APP.background.beginFill(temptempColor);
			APP.background.drawRect(-80,-80,windowWidth + 160, windowHeight + 160);
			// document.body.style.backgroundColor = APP.backColor;
		}else{
			if(forceColor){
				APP.backColor = APP.vecColors[Math.floor(APP.vecColors.length * Math.random())];
			}
			TweenLite.to(APP, 0.3, {backColor:temptempColor, onUpdate:function(){
				APP.background.clear();
				APP.background.beginFill(APP.backColor);
				APP.background.drawRect(-80,-80,windowWidth + 160, windowHeight + 160);
			}});
		}
		document.body.style.backgroundColor = APP.vecColorsS[APP.currentColorID];
		if(!this.player){
			return;
		}
		tempColor = addBright(temptempColor, 0.9 - (APP.currentWorld + 1) * 0.15);
		this.player.setColor(tempColor);

		this.drawMap();

		if(this.trails && this.trails.length){
			for (var i = 0; i < this.trails.length; i++) {
				var tempTrail = this.trails[i].trail;
				var tempRect = new PIXI.Rectangle(tempTrail.getLocalBounds().x,tempTrail.getLocalBounds().y,tempTrail.getLocalBounds().width,tempTrail.getLocalBounds().height);
				tempTrail.clear();
				tempTrail.beginFill(tempColor);

				if(this.trails[i].type !== 'JOINT'){
					tempTrail.drawRect(tempRect.x,tempRect.y,tempRect.width,tempRect.height);
				}else{
					tempTrail.drawCircle(0,0,tempRect.width/2);
				}
			}
		}

	},
	earthquake:function(force){
		var earth = new TimelineLite();
		earth.append(TweenLite.to(this.container, 0.2, {y:-Math.random() * force, x:Math.random() * force - force / 2}));
		earth.append(TweenLite.to(this.container, 0.2, {y:-Math.random() * force, x:Math.random() * force - force / 2}));
		earth.append(TweenLite.to(this.container, 0.2, {y:0, x:0}));
	},
	updateCoins:function(){

		this.coinsLabel.setText(APP.points);
		TweenLite.to(this.coinsLabel, 0.2, {alpha:0.5});
		this.coinsLabel.position.x = 60;
		if(APP.background.parent){
			APP.background.parent.setChildIndex(APP.background, 0);
		}
		this.coinsLabel.parent.setChildIndex(this.coinsLabel, 1);

		if(this.coinsLabel.alpha < 0.5){
			return;
		}

	},
	transitionIn:function()
	{
		this.build();
	},
	transitionOut:function(nextScreen, container)
	{
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