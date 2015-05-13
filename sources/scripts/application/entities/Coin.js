/*jshint undef:false */
var Coin = Entity.extend({
	init:function(vel, behaviour){
		this._super( true );
		this.updateable = false;
		this.deading = false;
		this.range = 80;
		this.width = 1;
		this.height = 1;
		this.type = 'coin';
		this.node = null;
		this.velocity.x = vel.x;
		this.velocity.y = vel.y;
		this.timeLive = 1000;
		this.power = 1;
		this.defaultVelocity = 1;
		this.imgSource = 'bullet.png';
		this.particleSource = 'bullet.png';
		this.rot = 0;
		this.inMove = false;
	},
	startScaleTween: function(){
		TweenLite.from(this.getContent().scale, 0.3, {x:0, y:0, ease:'easeOutBack'});
	},
	randomPos: function(rangeMin, rangeMax){
		var yDest = rangeMin + Math.random() * rangeMax;
		this.inMove = true;
		var self = this;
		TweenLite.to(this.getContent(), 0.5, {delay:0.4, y:yDest, onComplete:function(){
			self.inMove = false;
		}});
	},
	build: function(){

		// this.sprite = new PIXI.Sprite.fromFrame(this.imgSource);
		this.spriteBall = new PIXI.Graphics();
		this.spriteBall.beginFill(0xFFFFFF);
		var size = windowHeight * 0.05;
		this.spriteBall.drawRect(-size/2,-size/2,size,size);
		// this.spriteBall.drawCircle(0,0,windowHeight * 0.02);

		this.sprite = new PIXI.Sprite();
        this.sprite.addChild(this.spriteBall);

		// this.sprite.anchor.x = 0.5;
		// this.sprite.anchor.y = 0.5;

		this.updateable = true;
		this.collidable = true;

		this.getContent().alpha = 0.5;
		TweenLite.to(this.getContent(), 0.3, {alpha:1});
		
		this.collideArea = new PIXI.Rectangle(-50, -50, windowWidth + 100, windowHeight + 100);


        this.particlesCounterMax = 8;
        this.particlesCounter = 1;

	},
	update: function(){
		this.range = this.spriteBall.width;
		this._super();

		if(this.inMove){
			this.updateableParticles();
		}
	},
	changeShape:function(){
	},
	explode:function(velX, velY){
		
		var particle = null;
		var tempParticle = null;
		this.size = 8;
		for (var i = 10; i >= 0; i--) {

			console.log('part');
			tempParticle = new PIXI.Graphics();
			tempParticle.beginFill(0xFFFFFF);
			tempParticle.drawRect(-this.size/2,-this.size/2,this.size,this.size);
			// this.spriteBall.drawCircle(0,0,windowHeight * 0.02);

			particle = new Particles({x: Math.random() * 10 - 5 + (velX?velX:0), y:Math.random() * 10 - 5 + (velY?velY:0)}, 600, tempParticle, Math.random() * 0.05);
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

		tempParticle = new PIXI.Graphics();
		this.size = windowHeight * 0.05;
		tempParticle.beginFill(0xFFFFFF);
		tempParticle.drawRect(-this.size/2,-this.size/2,this.size,this.size);

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
	updateableParticles:function(){
        this.particlesCounter --;
        if(this.particlesCounter <= 0)
        {
            this.particlesCounter = this.particlesCounterMax;

            //efeito 1
            // var particle = new Particles({x: 0, y:0}, 120, this.particleSource, Math.random() * 0.05);
            // particle.maxScale = this.getContent().scale.x;
            // particle.growType = -1;
            // particle.build();
            // particle.gravity = 0.1;
            // particle.alphadecress = 0.08;
            // particle.scaledecress = -0.08;
            // particle.setPosition(this.getPosition().x - (Math.random() + this.getContent().width * 0.1) / 2,
            //     this.getPosition().y);
            // this.layer.addChild(particle);

            //efeito 2
            // var particle = new Particles({x: Math.random() * 4 - 2, y:Math.random()}, 120, this.particleSource, Math.random() * 0.05);
            // particle.maxScale = this.getContent().scale.x;
            // particle.maxInitScale = 0.4;
            // // particle.growType = -1;
            // particle.build();
            // particle.gravity = 0.1 * Math.random() + 0.2;
            // particle.alphadecress = 0.05;
            // particle.scaledecress = 0.03;
            // particle.setPosition(this.getPosition().x - (Math.random() + this.getContent().width * 0.1) / 2,
            //     this.getPosition().y);
            // this.layer.addChild(particle);


            var tempPart = new PIXI.Graphics();
			tempPart.beginFill(0xFFFFFF);
			tempPart.drawRect(-this.size/2,-this.size/2,this.size,this.size);

            //efeito 3
            var particle = new Particles({x: 0, y:0}, 120, tempPart, 0);
            // particle.maxScale = this.getContent().scale.x / 2;
            // particle.initScale = this.getContent().scale.x / 2;
            // particle.maxInitScale = particle.maxScale / 1.5;
            // particle.growType = -1;
            particle.build();
            particle.gravity = 0.0;
            // particle.getContent().tint = APP.appModel.currentPlayerModel.color;
            particle.alphadecress = 0.04;
            particle.scaledecress = -0.01;
            particle.setPosition(this.getPosition().x,
                this.getPosition().y);
            this.layer.addChild(particle);
            particle.getContent().parent.setChildIndex(particle.getContent() , 0);
        }
    },
	preKill:function(){
		if(this.invencible){
			return;
		}

		

		// for (var i = 5; i >= 0; i--) {
		// 	var particle = new Particles({x: Math.random() * 8 - 4, y:Math.random() * 8 - 4}, 120, this.particleSource, Math.random() * 0.05);
		// 	particle.maxScale = this.getContent().scale.x / 2;
  //           particle.maxInitScale = particle.maxScale;
		// 	particle.build();
		// 	particle.getContent().tint = 0xf5c30c;
		// 	particle.gravity = 0.3 * Math.random();
		// 	particle.alphadecress = 0.04;
		// 	particle.scaledecress = -0.05;
		// 	particle.setPosition(this.getPosition().x - (Math.random() + this.getContent().width * 0.4) + this.getContent().width * 0.2,
  //               this.getPosition().y - (Math.random() + this.getContent().width * 0.4)+ this.getContent().width * 0.2);
		// 	this.layer.addChild(particle);
		// }
		this.explode(-2, 2);
		this.collidable = false;
		this.kill = true;
	},
});