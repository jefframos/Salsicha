/*jshint undef:false */
var Enemy2 = Entity.extend({
	init:function(screen, id, loop){
		this._super( true );
		this.updateable = false;
		this.deading = false;
		this.range = 1;
		this.width = 1;
		this.height = 1;
		this.id = id;
		this.type = 'enemy';
		this.screen = screen;
		this.loop = loop;
		this.rot = 0;
		this.standardVelocity = 2;
	},
	setWaypoints: function(wayPoints){
		this.wayPoints = wayPoints;
		this.targetWay = 1;
		this.setPosition(this.wayPoints[0].x, this.wayPoints[0].y);

		this.testHorizontal();
		this.testVertical();
	},
	build: function(){

		// this.sprite = new PIXI.Sprite.fromFrame(this.imgSource);
		this.spriteBall = new PIXI.Graphics();
		this.spriteBall.beginFill(0xFF8888);
		var size = windowHeight * 0.02;
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

        this.indo = true;

        this.collideAccum = 0;



	},
	testHorizontal: function(){
		if(this.getPosition().x < this.wayPoints[this.targetWay].x){
			this.velocity.x = this.standardVelocity;
			this.velocity.y = 0;
			this.getPosition().y = this.wayPoints[this.targetWay].y;
		}else if(this.getPosition().x > this.wayPoints[this.targetWay].x){
			this.velocity.x = -this.standardVelocity;
			this.velocity.y = 0;
			this.getPosition().y = this.wayPoints[this.targetWay].y;
		}
	},
	testVertical: function(){
		
		if(this.getPosition().y < this.wayPoints[this.targetWay].y){
			this.velocity.y = this.standardVelocity;
			this.velocity.x = 0;
			this.getPosition().x = this.wayPoints[this.targetWay].x;
		}else if(this.getPosition().y > this.wayPoints[this.targetWay].y){
			this.velocity.y = -this.standardVelocity;
			this.velocity.x = 0;
			this.getPosition().x = this.wayPoints[this.targetWay].x;
		}
	},
	update: function(){
		if(this.collideAccum <= 0){
			if(pointDistance(this.getPosition().x,this.getPosition().y,this.wayPoints[this.targetWay].x,this.wayPoints[this.targetWay].y) < this.standardVelocity * 2){
				this.collideAccum = 10;
				if(this.indo){
					this.targetWay ++;
				}else{
					this.targetWay --;
				}
				if(this.loop){
					if(this.targetWay >= this.wayPoints.length){
						this.targetWay = 0;
					}
				}else{
					if(this.targetWay >= this.wayPoints.length - 1){
						this.indo = false;
					}else if(this.targetWay < 1){
						this.indo = true;
					}
				}
			}
			if(pointDistance(this.getPosition().x,0,this.wayPoints[this.targetWay].x,0) > this.standardVelocity * 2){
				this.testHorizontal();
			}
			if(pointDistance(this.getPosition().y,0,this.wayPoints[this.targetWay].y,0) > this.standardVelocity * 2){
				this.testVertical();
			}
		}else{
			this.collideAccum --;
		}
		this.range = this.spriteBall.width / 2;
		this._super();
		this.rot += this.standardVelocity / 10;
		this.spriteBall.rotation = this.rot;
	},
	changeShape:function(){
	},
	explode:function(velX, velY){
		
		var particle = null;
		var tempParticle = null;
		this.size = 8;
		for (var i = 10; i >= 0; i--) {

			tempParticle = new PIXI.Graphics();
			tempParticle.beginFill(0xFF8888);
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
		tempParticle.beginFill(0xFF8888);
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