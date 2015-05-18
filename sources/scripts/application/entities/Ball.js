/*jshint undef:false */
var Ball = Entity.extend({
	init:function(vel, screen){
		this._super( true );
		this.updateable = false;
		this.deading = false;
		this.screen = screen;
		this.range = 80;
		this.width = 1;
		this.height = 1;
		this.type = 'player';
		this.target = 'enemy';
		this.fireType = 'physical';
		this.node = null;
		this.velocity.x = vel.x;
		this.velocity.y = vel.y;
		this.power = 1;
		//console.log(bulletSource);
	},
	startScaleTween: function(){
		TweenLite.from(this.getContent().scale, 0.3, {x:0, y:0, ease:'easeOutBack'});
	},
	build: function(){


		// this.spriteBall = new PIXI.Sprite.fromFrame(this.imgSource);
		this.color = 0xFFFFFF;
		this.spriteBall = new PIXI.Graphics();
		this.spriteBall.beginFill(this.color);
		this.maxSize = APP.tileSize.w * 0.4;
		console.log(this.maxSize);
		this.spriteBall.drawCircle(0,0,this.maxSize);

		this.width = this.spriteBall.width;
		this.height = this.spriteBall.height;


		this.heart = new PIXI.Graphics();
		this.heart.beginFill(0xFFFFFF);
		this.heart.drawCircle(0,0,3);
		this.heart.alpha = 0.5;

		console.log(this.spriteBall.width);

		this.sprite = new PIXI.Sprite();
        this.sprite.addChild(this.spriteBall);
        this.sprite.addChild(this.heart);
        this.spriteBall.position.y = this.spriteBall.height / 2;

        this.range = this.spriteBall.height / 2;
		this.sprite.anchor.x = 0.5;
		this.sprite.anchor.y = 0.5;

		// console.log(this.range);
		this.updateable = true;
		this.collidable = true;

		this.getContent().alpha = 0.1;
		TweenLite.to(this.getContent(), 0.3, {alpha:1});

		this.collideArea = new PIXI.Rectangle(50, 50, windowWidth - 100, windowHeight - 100);

		this.particlesCounterMax = 50;
        this.particlesCounter = 1;

        this.floorPos = windowHeight;
        this.gravity = 0;
        this.gravityVal = 0.15;
        this.breakJump = false;
        this.blockCollide = false;
        this.inError = false;

        this.perfectShoot = 0;
        this.perfectShootAcum = 0;
        this.force = 0;
		this.inJump = false;

		this.standardVelocity = APP.standerdVel;

		console.log(this.standardVelocity, 'st');
		this.friction = this.spriteBall.width / 3;

		this.blockCollide2 = false;

		this.moveAccum = 0;
		this.moveAccumMax = 7;

	},
	returnCollide: function(half){
		this.blockMove = true;
		var multiplyer = 1;
		if(half){
			multiplyer = 0.2;
		}
		var tempPos = {x:this.getPosition().x, y:this.getPosition().y};
		if(this.currentSide === 'UP'){
			tempPos.y += (this.spriteBall.height * multiplyer) / 2;
		}else if(this.currentSide === 'DOWN'){
			tempPos.y -= (this.spriteBall.height * multiplyer) / 2;
		}else if(this.currentSide === 'LEFT'){
			tempPos.x += (this.spriteBall.width * multiplyer) / 2;
		}else if(this.currentSide === 'RIGHT'){
			tempPos.x -= (this.spriteBall.width * multiplyer) / 2;
		}
		var self = this;
		TweenLite.to(this.getPosition(), 0.1, {x:tempPos.x ,y:tempPos.y, onComplete:function(){
			// alert('unblock');
			self.blockMove = false;
		}});
		this.explode2();
		return tempPos;
	},
	returnCollide2: function(half){
		console.log('returnCollide2');
		// this.moveBack(this.currentSide);
		this.blockCollide2 = true;
		var multiplyer = 1;
		var tempPos = {x:this.getPosition().x, y:this.getPosition().y};
		tempPos.y -= this.velocity.y / 2;
		tempPos.x -= this.velocity.x / 2;
		var self = this;
		TweenLite.to(this.getPosition(), 0.1, {x:tempPos.x ,y:tempPos.y, onComplete:function(){
			// alert('unblock');
			self.blockCollide2 = false;
		}});
		this.explode2();
		return tempPos;
	},
	moveBack: function(side){
		console.log('moveBack');
		this.currentSide = '';
		if(side === 'UP'){
			this.velocity.y = this.standardVelocity * 3;
		}else if(side === 'DOWN'){
			this.velocity.y = -this.standardVelocity * 3;
		}else if(side === 'LEFT'){
			this.velocity.x = this.standardVelocity * 3;
		}else if(side === 'RIGHT'){
			this.velocity.x = -this.standardVelocity * 3;
		}
	},
	stretch: function(side){
		this.moveAccum = this.moveAccumMax;
		if(this.currentSide === side){
			return;
		}
		var tempVel = this.standardVelocity * 2;//this.spriteBall.width / 2;//this.standardVelocity * 2;

		console.log(tempVel);
		this.currentSide = side;
		if(this.currentSide === 'UP'){
			this.velocity.x = 0;
			this.velocity.y = -tempVel;
		}else if(this.currentSide === 'DOWN'){
			this.velocity.x = 0;
			this.velocity.y = tempVel;
		}else if(this.currentSide === 'LEFT'){
			this.velocity.x = -tempVel;
			this.velocity.y = 0;
		}else{
			this.velocity.x = tempVel;
			this.velocity.y = 0;
		}
		this.screen.addTrail();
	},
	stopReturn: function(){
		this.getPosition().x -= this.velocity.x;
		this.getPosition().x -= this.velocity.y;
	},
	stop: function(){
		this.velocity = {x:0, y:0};
		this.currentSide = '';
	},
	applyFriction:function(){
		if(this.velocity.x > this.standardVelocity + this.friction){
			this.velocity.x -= this.friction;
			if(this.velocity.x > this.standardVelocity){
				this.velocity.x = this.standardVelocity;
			}
		}
		else if(this.velocity.x < -(this.standardVelocity + this.friction)){
			this.velocity.x += this.friction;
			if(this.velocity.x < this.standardVelocity){
				this.velocity.x = -this.standardVelocity;
			}
		}
		else if(this.velocity.y > this.standardVelocity + this.friction){
			this.velocity.y -= this.friction;
			if(this.velocity.y > this.standardVelocity){
				this.velocity.y = this.standardVelocity;
			}
		}
		else if(this.velocity.y < -(this.standardVelocity + this.friction)){
			this.velocity.y += this.friction;
			if(this.velocity.y < this.standardVelocity){
				this.velocity.y = -this.standardVelocity;
			}
		}


	},
	update: function(){
		if(this.moveAccum > 0){
			this.moveAccum --;
		}
		// console.log(this.blockMove);
		this.updateableParticles();
		this.range = this.spriteBall.height / 2;
		this._super();
		// this.applyFriction();
		console.log(this.velocity);
		this.layer.collideChilds(this);
		if(this.heartParticle){
			if(this.heartParticle.kill && this.heartParticle.getContent().parent){
				this.heartParticle.getContent().parent.removeChild(this.heartParticle.getContent());
			}else{
				this.heartParticle.update();
			}
		}
	},
	updateableParticles:function(){
        this.particlesCounter --;
        if(this.particlesCounter <= 0)
        {
            this.particlesCounter = this.particlesCounterMax;

            var tempPart = new PIXI.Graphics();
			tempPart.beginFill(0xFFFFFF);
			tempPart.drawCircle(0,0,this.spriteBall.width);

            //efeito 3
            this.heartParticle = new Particles({x: 0, y:0}, 120, tempPart, Math.random() * 0.05);
            this.heartParticle.initScale = 0;
            this.heartParticle.build();
            this.heartParticle.getContent().alpha = 0.5;
            this.heartParticle.gravity = 0.0;
            this.heartParticle.alphadecress = 0.02;
            this.heartParticle.scaledecress = 0.02;
            this.heartParticle.setPosition(0,0);
            this.sprite.addChild(this.heartParticle.getContent());
        }
    },
	collide:function(arrayCollide){
		if(this.collidable){
			for (var i = arrayCollide.length - 1; i >= 0; i--) {
				if(arrayCollide[i].type === 'enemy'){
					var enemy = arrayCollide[i];
					this.screen.gameOver();
					// enemy.kill
					enemy.preKill();
					// arrayCollide[i].prekill();
				}else if(arrayCollide[i].type === 'killer'){
					this.screen.gameOver();
					this.preKill();
				}else if(arrayCollide[i].type === 'coin'){
					arrayCollide[i].preKill();
					this.blockCollide = true;
					var value = 1 + this.perfectShootAcum;
					APP.points += value;

					APP.audioController.playSound('explode1');

					var rot = Math.random() * 0.005;
					var tempLabel = new PIXI.Text('+'+value, {font:'50px Vagron', fill:'#13c2b6'});
					// var tempLabel = new PIXI.Text('+'+value, {font:'50px Vagron', fill:'#9d47e0'});

					var labelCoin = new Particles({x: 0, y:0}, 120, tempLabel,rot);
					labelCoin.maxScale = this.getContent().scale.x;
					labelCoin.build();
					// labelCoin.getContent().tint = 0xf5c30c;
					labelCoin.gravity = -0.2;
					labelCoin.alphadecress = 0.01;
					labelCoin.scaledecress = +0.05;
					labelCoin.setPosition(this.getPosition().x - tempLabel.width / 2, this.getPosition().y);
					this.screen.layer.addChild(labelCoin);

					var labelCoin2 = new Particles({x: 0, y:0}, 120, new PIXI.Text('+'+value, {font:'50px Vagron', fill:'#9d47e0'}),-rot);
					// var labelCoin2 = new Particles({x: 0, y:0}, 120, new PIXI.Text('+'+value, {font:'50px Vagron', fill:'#13c2b6'}),-rot);
					labelCoin2.maxScale = this.getContent().scale.x;
					labelCoin2.build();
					// labelCoin2.getContent().tint = 0xf5c30c;
					labelCoin2.gravity = -0.2;
					labelCoin2.alphadecress = 0.01;
					labelCoin2.scaledecress = +0.05;
					labelCoin2.setPosition(this.getPosition().x - tempLabel.width / 2+2, this.getPosition().y+2);
					this.screen.layer.addChild(labelCoin2);
					this.screen.getCoin();
				}
			}
		}
	},
	setColor:function(color){
		this.color = color;
		this.spriteBall.clear();
		this.spriteBall.beginFill(color);
		this.spriteBall.drawCircle(0,-this.maxSize,this.maxSize);
		// this.spriteBall.drawCircle(0,0,this.maxSize);
	},
	charge:function(force){
		var angle = degreesToRadians(Math.random() * 360);
		// var angle = degreesToRadians(60);
		var dist = this.spriteBall.height * 0.9;
		var pPos = {x:dist * Math.sin(angle)+ this.getContent().position.x, y:dist * Math.cos(angle)+ this.getContent().position.y};
		// var pPos = {x:this.getPosition().x, y:this.getPosition().y};

		// var vector = Math.atan2(this.getPosition().y - pPos.y, this.getPosition().x - pPos.x);
		var vector = Math.atan2(this.getPosition().x - pPos.x, this.getPosition().y - pPos.y);
		var vel = 2;
		var vecVel = {x: Math.sin(vector) * vel, y: Math.cos(vector) * vel};

		// console.log('charge');
		var tempPart = new PIXI.Graphics();
		tempPart.beginFill(this.color);
		tempPart.drawCircle(0,0,windowHeight * 0.05);
		var particle = new Particles(vecVel, 800, tempPart, 0);

		particle.initScale = this.getContent().scale.x / 10;
        particle.maxScale = this.getContent().scale.x / 3;

        // particle.maxInitScale = particle.maxScale / 1.5;
        // particle.growType = -1;
        particle.build();
        particle.gravity = 0.0;
        // particle.getContent().tint = APP.appModel.currentPlayerModel.color;
        // particle.alphadecress = 0.05;
        particle.scaledecress = -0.01;
        particle.setPosition(pPos.x ,pPos.y- this.spriteBall.height / 2);
        this.layer.addChild(particle);
        particle.getContent().parent.setChildIndex(particle.getContent() , 0);


	},
	explode:function(){
		tempParticle = new PIXI.Graphics();
		tempParticle.beginFill(this.color);
		tempParticle.drawCircle(0,0,this.spriteBall.width);

		particle = new Particles({x: 0, y:0}, 600, tempParticle, 0);
		particle.maxScale = this.getContent().scale.x * 5;
        particle.maxInitScale = 1;
		particle.build();
		// particle.getContent().tint = 0xf5c30c;
		// particle.gravity = 0.3 * Math.random();
		particle.alphadecress = 0.08;
		particle.scaledecress = 0.1;
		particle.setPosition(this.getPosition().x,this.getPosition().y);
		this.layer.addChild(particle);
	},
	explode2:function(){
		console.log('explode2');
		// this.stop();
		tempParticle = new PIXI.Graphics();
		tempParticle.beginFill(this.color);
		tempParticle.drawCircle(0,0,this.spriteBall.width);

		particle = new Particles({x: 0, y:0}, 600, tempParticle, 0);
		particle.maxScale = this.getContent().scale.x * 5;
        particle.maxInitScale = 1;
		particle.build();
		// particle.getContent().tint = 0xf5c30c;
		// particle.gravity = 0.3 * Math.random();
		particle.alphadecress = 0.05;
		particle.scaledecress = 0.1;
		particle.setPosition(this.getPosition().x,this.getPosition().y);
		this.layer.addChild(particle);
	},
	preKill:function(){
		if(this.invencible){
			return;
		}
		this.spriteBall.alpha = 0;
		APP.audioController.playSound('explode1');
		this.collidable = false;
		this.kill = true;
		for (var i = 10; i >= 0; i--) {

			tempParticle = new PIXI.Graphics();
			tempParticle.beginFill(this.color);
			tempParticle.drawCircle(0,0,this.spriteBall.width * 0.2);
			// this.spriteBall.drawCircle(0,0,windowHeight * 0.02);

			particle = new Particles({x: Math.random() * 10 - 5, y:Math.random() * 10 - 5}, 600, tempParticle, Math.random() * 0.05);
			// particle.maxScale = this.getContent().scale.x / 2;
            // particle.maxInitScale = particle.maxScale;
			particle.build();
			// particle.getContent().tint = 0xf5c30c;
			// particle.gravity = 0.3 * Math.random();
			particle.alphadecress = 0.008;
			// particle.scaledecress = -0.005;
			particle.setPosition(this.getPosition().x - (Math.random() + this.getContent().width * 0.4) + this.getContent().width * 0.2,
                this.getPosition().y - (Math.random() + this.getContent().width * 0.4)+ this.getContent().width * 0.2);
			this.layer.addChild(particle);
		}
		this.explode2();

	},
});