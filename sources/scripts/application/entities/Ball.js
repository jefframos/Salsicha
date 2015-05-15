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
		this.defaultVelocity = 1;
		
		this.imgSource = 'bullet.png';
		this.particleSource = 'bullet.png';//APP.appModel.currentBurguerlModel.imgSrc;
		// this.defaultVelocity.y = vel.y;
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
		this.maxSize = windowHeight * 0.02;
		this.spriteBall.drawCircle(0,0,this.maxSize);


		console.log(this.spriteBall.width);

		this.sprite = new PIXI.Sprite();
        this.sprite.addChild(this.spriteBall);
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

		this.particlesCounterMax = 2;
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

		this.standardVelocity = 3;
		this.friction = 0.1;

	},
	returnCollide: function(){
		console.log('returnCollide');
		var tempPos = {x:this.getPosition().x, y:this.getPosition().y};
		if(this.currentSide === 'UP'){
			tempPos.y += this.spriteBall.height / 2;
		}else if(this.currentSide === 'DOWN'){
			tempPos.y -= this.spriteBall.height / 2;
		}else if(this.currentSide === 'LEFT'){
			tempPos.x += this.spriteBall.width / 2;
		}else if(this.currentSide === 'RIGHT'){
			tempPos.x -= this.spriteBall.width / 2;
		}

		TweenLite.to(this.getPosition(), 0.5, {x:tempPos.x ,y:tempPos.y});
		this.explode2();
		return tempPos;
	},
	moveBack: function(side){
		this.currentSide = '';
		if(side === 'UP'){
			this.velocity.y = this.standardVelocity * 2;
		}else if(side === 'DOWN'){
			this.velocity.y = -this.standardVelocity * 2;
		}else if(side === 'LEFT'){
			this.velocity.x = this.standardVelocity * 2;
		}else if(side === 'RIGHT'){
			this.velocity.x = -this.standardVelocity * 2;
		}
	},
	stretch: function(side){
		if(this.currentSide === side){
			return;
		}
		this.currentSide = side;
		if(this.currentSide === 'UP'){
			this.velocity.x = 0;
			this.velocity.y = -this.standardVelocity * 2;
		}else if(this.currentSide === 'DOWN'){
			this.velocity.x = 0;
			this.velocity.y = this.standardVelocity * 2;
		}else if(this.currentSide === 'LEFT'){
			this.velocity.x = -this.standardVelocity * 2;
			this.velocity.y = 0;
		}else{
			this.velocity.x = this.standardVelocity * 2;
			this.velocity.y = 0;
		}
		this.screen.addTrail();
	},
	stop: function(){
		this.velocity = {x:0, y:0};
	},
	applyFriction:function(){
		if(this.velocity.x > this.standardVelocity + this.friction){
			this.velocity.x -= this.friction;
		}
		if(this.velocity.x < -(this.standardVelocity + this.friction)){
			this.velocity.x += this.friction;
		}
		if(this.velocity.y > this.standardVelocity + this.friction){
			this.velocity.y -= this.friction;
		}
		if(this.velocity.y < -(this.standardVelocity + this.friction)){
			this.velocity.y += this.friction;
		}

	},
	update: function(){
		this.range = this.spriteBall.height / 2;
		this._super();
		this.applyFriction();
		this.layer.collideChilds(this);
	},
	updateableParticles:function(){
        this.particlesCounter --;
        if(this.particlesCounter <= 0)
        {
            this.particlesCounter = this.particlesCounterMax;

            var tempPart = new PIXI.Graphics();
			tempPart.beginFill(this.color);
			tempPart.drawCircle(0,0,this.spriteBall.width);

            //efeito 3
            var particle = new Particles({x: Math.random() * 4 - 2, y:Math.random()}, 120, tempPart, Math.random() * 0.05);
            // particle.maxScale = this.getContent().scale.x / 2;
            particle.initScale = this.getContent().scale.x / 2;
            // particle.maxInitScale = particle.maxScale / 1.5;
            // particle.growType = -1;
            particle.build();
            particle.gravity = 0.0;
            // particle.getContent().tint = APP.appModel.currentPlayerModel.color;
            particle.alphadecress = 0.05;
            particle.scaledecress = -0.05;
            particle.setPosition(this.getPosition().x - (Math.random() + this.getContent().width * 0.1) / 2,
                this.getPosition().y - this.spriteBall.height / 2);
            this.layer.addChild(particle);
            particle.getContent().parent.setChildIndex(particle.getContent() , 0);
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