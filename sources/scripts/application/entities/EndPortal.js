/*jshint undef:false */
var EndPortal = Entity.extend({
	init:function(screen){
		this._super( true );
		this.updateable = false;
		this.deading = false;
		this.range = 1;
		this.width = 1;
		this.height = 1;
		this.type = 'portal';
		this.screen = screen;
	},
	build: function(){

		// this.sprite = new PIXI.Sprite.fromFrame(this.imgSource);
		this.spriteBall = new PIXI.Graphics();
		this.spriteBall.lineStyle(1,0xFFFFFF);
		// this.spriteBall.beginFill(0xFFFFFF);
		var size = APP.tileSize.w * 0.4;
		this.spriteBall.drawRect(-size/2,-size/2,size,size);
		// this.spriteBall.drawCircle(0,0,windowHeight * 0.02);

		this.spriteBallBack = new PIXI.Graphics();
		this.spriteBallBack.beginFill(0xFFFFFF);
		this.spriteBallBack.drawCircle(0,0,APP.tileSize.w / 2);
		this.spriteBallBack.alpha = 0.3;
		this.sprite = new PIXI.Sprite();
        this.sprite.addChild(this.spriteBall);
        this.sprite.addChild(this.spriteBallBack);

		// this.sprite.anchor.x = 0.5;
		// this.sprite.anchor.y = 0.5;

		this.updateable = true;
		this.collidable = true;

		this.getContent().alpha = 0.5;
		TweenLite.to(this.getContent(), 0.3, {alpha:1});

		this.collideArea = new PIXI.Rectangle(-50, -50, windowWidth + 100, windowHeight + 100);


        this.particlesCounterMax = 8;
        this.particlesCounter = 1;

        this.rot = 0;
        this.scale = 0;

	},
	update: function(){
		this.range = this.spriteBallBack.width / 2;
		this._super();
		this.spriteBall.rotation = this.rot;
		this.rot += 0.05;
		this.scale += 0.05;
		this.spriteBall.scale = {x:Math.sin(this.scale), y:Math.sin(this.scale)};
	},
	changeShape:function(){
	},
	explode:function(velX, velY){

		var particle = null;
		var tempParticle = null;
		this.size = 8;
		for (var i = 10; i >= 0; i--) {

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
	preKill:function(){
		if(this.invencible){
			return;
		}
		this.explode(-2, 2);
		this.collidable = false;
		this.kill = true;
	},
});