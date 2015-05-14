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
		this.environment = [];
		this.trails = [];
		this.vecTiles = null;
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
		APP.stage.addChild(this.hitTouch);

		this.tapDown = false;

		// this.hitTouch.touchend = this.hitTouch.mouseup = function(touchData){
			
		// };

		this.hitTouch.touchstart = this.hitTouch.mousedown = function(touchData){
			if(self.recoil){
				return;
			}
			// console.log(touchData);
			// var angle = Math.atan2(touchData.global.y - (self.player.getPosition().y + self.getContent().position.y * self.getContent().scale.y),
			// (touchData.global.x) - (self.player.getPosition().x + self.getContent().position.x * self.getContent().scale.x)) * 180 / Math.PI;

			var angle = Math.atan2(touchData.global.y - windowHeight / 2, touchData.global.x - windowWidth / 2) * 180 / Math.PI;

			// var angle = Math.atan2(touchData.global.y - (self.player.getPosition().y + self.getContent().position.y),
			// (touchData.global.x) - (self.player.getPosition().x + self.getContent().position.x)) * 180 / Math.PI;
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
			if(e.keyCode === 32 || e.keyCode === 40){
				self.getTileByPos(self.player.getPosition().x, self.player.getPosition().y);
				// self.tapDown = false;
				// self.shoot((APP.force / 30) * windowHeight * 0.1);
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



		this.gameContainer = new PIXI.DisplayObjectContainer();
		this.addChild(this.gameContainer);
		this.layerManager = new LayerManager();
		this.layerManager.build('Main');

		this.gameContainer.addChild(this.layerManager.getContent());

		//adiciona uma camada
		this.layer = new Layer();
		this.layer.build('EntityLayer');
		this.layerManager.addLayer(this.layer);

		this.coinsLabel = new PIXI.Text('0', {align:'center',font:'72px Vagron', fill:'#FFFFFF', wordWrap:true, wordWrapWidth:500});
		// scaleConverter(this.coinsLabel.height, windowHeight, 0.2, this.coinsLabel);
		this.coinsLabel.resolution = retina;
		this.coinsLabel.alpha = 0.5;
		this.coinsLabel.position.x = 20;
		this.coinsLabel.position.y = 0;
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
		this.startLevel = false;
		this.debugBall = new PIXI.Graphics();


		
	},

	collideWall:function(){
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
		this.player.getContent().scale = {x:1,y:1};
		if(this.trails[this.trails.length - 1].type === 'HORIZONTAL'){
			this.recoilTimeline.append(TweenLite.from(this.player.getContent().scale,  1, {x:0.5, ease:'easeOutElastic', onStart:onStart}));
		}else{
			this.recoilTimeline.append(TweenLite.from(this.player.getContent().scale,  1, {y:0.5, ease:'easeOutElastic', onStart:onStart}));
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
			trail.position.y = this.player.getPosition().y + this.player.spriteBall.height / 2;
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
			trail.position.y = this.player.getPosition().y;// - this.player.spriteBall.height / 2;
			trailObj.type = 'VERTICAL';
			trailObj.side = this.player.velocity.y < 0?'UP':'DOWN';
		}
		// trail.alpha = 0.5;

		var joint = new PIXI.Graphics();
		joint.beginFill(this.player.color);
		joint.drawCircle(0,0,this.player.spriteBall.width/2);
		this.trailContainer.addChild(joint);
		this.trailContainer.addChild(trail);
		joint.position.x = this.player.getPosition().x;
		joint.position.y = this.player.getPosition().y;

		this.trails.push({trail:joint, type:'JOINT', side:trailObj.side});
		this.trails.push(trailObj);

		if(this.onBack){
			var self = this;
			this.blockCollide = true;
			setTimeout(function(){
				self.blockCollide = false;
			}, 300);
		}
		this.onBack = false;
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

							this.player.moveBack(this.trails[j].side);
							break;
						}
					}
				}
			}
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
			this.player.stop();
		}
	},
	trailCollide:function(){
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
					if(tempEntity.type === 'enemy' || (tempEntity.type === 'player' && i < this.trails.length - 6)){
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
							}else{
								this.player.stop();
							}
						}
					}
				}
			
			}

		}
	},
	updateMapPosition:function(){
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
		console.log('initLevel');
		this.trails = [];
		this.trailContainer = new PIXI.DisplayObjectContainer();
		this.gameContainer.addChild(this.trailContainer);
		this.recoil = false;
		// this.gameOver = false;
		APP.points = 0;
		this.player = new Ball({x:0,y:0}, this);
		this.player.build();
		this.layer.addChild(this.player);
		this.player.getContent().position.x = windowWidth / 2;
		this.player.getContent().position.y = windowHeight / 1.2;

		this.player.standardVelocity = 3;

		var self = this;
		this.force = 0;
		this.levelCounter = 800;
		this.levelCounterMax = 800;

		this.changeColor(true, true);

		this.endGame = false;

		this.initEnvironment();

		this.updateMapPosition();

	},
	initEnvironment: function(){
		this.environment = [];
		var temp = [
			[1,		0,		0,		0,		0,		0,		0,		1,		1,		0,		0,		0,		0,		0,		0,		1,		0],
			[1,		1,		0,		5,		0,		0,		1,		1,		1,		0,		0,		0,		0,		0,		0,		1,		0],
			[1,		1,		1,		0,		0,		1,		1,		1,		1,		0,[14,0,2,1],		0,		0,[14,1,2,1],		0,		1,		0],
			[1,		1,		1,		0,		0,		1,		1,		1,		1,		0,		0,		0,		0,		0,		0,		1,		0],
			[1,		1,		1,		0,		0,		1,		1,		1,		3,		0,		0,		0,		5,		0,		0,		1,		0],
			[1,		1,		0,		0,		0,		0,		1,		1,		2,		0,		0,		0,		0,		0,		0,		1,		0],
			[1,		1,		0,		0,		0,		0,		1,		1,		1,		0,		0,		0,		[12,0,3],0,		0,		1,		1],
			[1,		1,		0,		0,		0,[13,0,2,1],		5,		0,		0,[13,3,2,1],		8,		0,		0,		0,		0,		1,		0],
			[1,		1,		0,		0,		0,		0,		1,		1,		1,		0,		0,		0,		0,		5,		0,		1,		0],
			[1,		1,		0,		0,		0,		0,		1,		1,		1,		0,		0,		0,		[12,1,3],0,		[12,2,3],1,		0],
			[1,		1,		0,		0,		0,[13,1,2,1],		0,		0,		0,[13,2,2,1],		0,		6,		0,		0,		0,		1,		0],
			[1,		1,		0,		0,		0,		5,		0,		0,		0,		0,		0,		0,		0,		0,		0,		1,		0],
			[1,		1,		0,		0,		0,		0,		1,		1,		1,		0,		0,		0,		0,		0,		[12,3,3],1,		0],
		];
		// this.tileSize = {w:windowWidth / temp[0].length,		 h:windowHeight / temp.length};
		this.tileSize = {w:Math.ceil(windowWidth * 0.1),h:Math.ceil(windowWidth * 0.1)};
		this.mapSize = {i:temp[0].length,j:temp.length};
		this.environment = temp;

		this.drawMap();
		this.drawPlayer();

	},
	drawMap: function(){
		if(!this.environment){
			return;
		}
		if(this.vecTiles && this.vecTiles.length > 0){
			for (var k = 0; k < this.vecTiles.length; k++) {
				var tempTile = this.getTileByPos(this.vecTiles[k].x + 5,this.vecTiles[k].y + 5);
				var tempColor = this.player.color;
				var tileType = this.getTileType(tempTile.i, tempTile.j);
				if(tileType === 2){
					tempColor = addBright(this.player.color,0.5);
				}else if(tileType === 3){
					tempColor = addBright(this.player.color,0.8);
				}
				this.vecTiles[k].clear();
				this.vecTiles[k].beginFill(tempColor);
				this.vecTiles[k].drawRect(0,0,this.tileSize.w, this.tileSize.h);
			}
			return;
		}
		this.vecTiles = [];
		this.vecMovEnemiesTemp = [];
		this.vecMovEnemies = [];
		for (var i = 0; i < this.environment.length; i++) {
			for (var j = 0; j < this.environment[i].length; j++) {
				this.drawTile(this.environment[i][j], j, i);
			}
		}

		this.hitTouch.hitArea = new PIXI.Rectangle(-100, -100, this.getContent().width, this.getContent().height);
	},
	drawTile: function(type, i,j){
		
		if(type >= 1 && type <= 3){
			var tempColor = this.player.color;//type === 1 ? this.player.color: 0xFF0000;
			if(type === 2){
				tempColor = addBright(this.player.color,0.5);
			}else if(type === 3){
				tempColor = addBright(this.player.color,0.8);
			}
			var tempGraphics = new PIXI.Graphics();
			// tempGraphics.lineStyle(1,color); APP.vecColors[APP.currentColorID]
			tempGraphics.beginFill(tempColor);
			tempGraphics.drawRect(0,0,this.tileSize.w, this.tileSize.h);
			tempGraphics.position.x = i * this.tileSize.w;
			tempGraphics.position.y = j * this.tileSize.h;
			// tempGraphics.alpha = 0.5;
			// console.log('addTile');
			this.gameContainer.addChild(tempGraphics);
			this.vecTiles.push(tempGraphics);
		}else if(type === 5){
			var coin = new Coin(this);
			coin.build();
			this.layer.addChild(coin);
			coin.getContent().position.x = i * this.tileSize.w + this.tileSize.w/2;
			coin.getContent().position.y = j * this.tileSize.h + this.tileSize.h/2;
			// this.player.setPosition(,);
		// }else if(type === 6){
		}else if(type > 5 || type instanceof Array){
			// return;
			// var enemy = new Enemy1(this);
			// enemy.build();
			// this.layer.addChild(enemy);
			// enemy.getContent().position.x = i * this.tileSize.w + this.tileSize.w/2;
			// enemy.getContent().position.y = j * this.tileSize.h + this.tileSize.h/2;
			// this.player.setPosition(,);
		}

		if(type instanceof Array){
			if(type[0] > 10){

				this.vecMovEnemiesTemp.push({index:type[1],id: type[0], x:i * this.tileSize.w + this.tileSize.w/2, y:j * this.tileSize.h + this.tileSize.h/2});
				var count = 0;
				var tempPositions = [];
				for (var k = 0; k < this.vecMovEnemiesTemp.length; k++) {
					if(this.vecMovEnemiesTemp[k].id === type[0]){
						count ++;
						// console.log(type[1]);
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
					enemyMov.getContent().position.x = i * this.tileSize.w + this.tileSize.w/2;
					enemyMov.getContent().position.y = j * this.tileSize.h + this.tileSize.h/2;
					enemyMov.setWaypoints(tempPositions);
					this.vecMovEnemies.push(enemyMov);
				}else if(count > 2){
					// console.log(tempPositions);
					tempPositions.sort(function(a, b){
						return a.index-b.index;
					});
					for (var l = 0; l < this.vecMovEnemies.length; l++) {
						if(this.vecMovEnemies[l].id === type[0]){
							this.vecMovEnemies[l].setWaypoints(tempPositions);
						}
					}
				}
				// this.player.setPosition(,);
			}
		}
	},

	drawPlayer: function(){
		for (var i = 0; i < this.environment.length; i++) {
			for (var j = 0; j < this.environment[i].length; j++) {
				if(this.environment[i][j] === 8){
					this.player.getContent().position.x = j * this.tileSize.w + this.tileSize.w/2;
					this.player.getContent().position.y = i * this.tileSize.h + this.tileSize.h/2;
				}
			}
		}
	},

	getTileByPos: function(x,y){
		var tempX = Math.floor(x / this.tileSize.w);
		var tempY = Math.floor(y / this.tileSize.h);
		var ret = {i:tempX, j:tempY};
		return ret;
	},

	getTileType: function(i,j){
		if(!this.environment || !this.environment.length){
			return 0;
		}
		try{
			// console.log(i,j);
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
		console.log('reset');
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
			self.recoilTimeline.kill();
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
		this.drawMap();

		if(this.trails && this.trails.length){
			for (var i = 0; i < this.trails.length; i++) {
				var tempTrail = this.trails[i].trail;
				// console.log(this.getTileType(this.getTileByPos(tempTrail.x,tempTrail.y)));
				// if(this.getTileType(this.getTileByPos(tempTrail.x,tempTrail.y)) === 1){
				var tempRect = new PIXI.Rectangle(tempTrail.getLocalBounds().x,tempTrail.getLocalBounds().y,tempTrail.getLocalBounds().width,tempTrail.getLocalBounds().height);
				// var tempH = tempTrail.height;
				tempTrail.clear();
				tempTrail.beginFill(tempColor);

				if(this.trails[i].type !== 'JOINT'){
					tempTrail.drawRect(tempRect.x,tempRect.y,tempRect.width,tempRect.height);
				}else{
					tempTrail.drawCircle(0,0,tempRect.width/2);
					// console.log(tempTrail.getLocalBounds());
				}
				// }
			}
		}
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
		this.coinsLabel.position.x = 20;//windowWidth / 2 - this.coinsLabel.width / 2 / this.coinsLabel.resolution;
		this.coinsLabel.position.y = 20;//windowHeight / 2 - this.coinsLabel.height / 2 / this.coinsLabel.resolution;
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