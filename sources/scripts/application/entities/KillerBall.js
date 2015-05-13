/*jshint undef:false */
var KillerBall = Entity.extend({
	init:function(vel, behaviour){
		this._super( true );
		this.updateable = false;
		this.deading = false;
		this.range = 80;
		this.width = 1;
		this.height = 1;
		this.type = 'killer';
		this.node = null;
		this.velocity.x = vel.x;
		this.velocity.y = vel.y;
		this.timeLive = 1000;
		this.power = 1;
		this.defaultVelocity = 1;
		this.behaviour = behaviour.clone();
		// this.imgSource = 'barata.png';
		this.imgSource = 'inimigo.png';
		this.particleSource = 'partEnemy.png';
	},
	startScaleTween: function(){
		TweenLite.from(this.getContent().scale, 0.3, {x:0, y:0, ease:'easeOutBack'});
	},
	build: function(){

		this.sprite = new PIXI.Sprite.fromFrame(this.imgSource);
		this.sprite.anchor.x = 0.5;
		this.sprite.anchor.y = 0.5;
		// this.sprite.tint = 0xFF0000;

		this.updateable = true;
		this.collidable = true;

		this.getContent().alpha = 0.5;
		TweenLite.to(this.getContent(), 0.3, {alpha:1});
		
		this.collideArea = new PIXI.Rectangle(-50, -50, windowWidth + 100, windowHeight + 100);

		this.particlesCounterMax = 5;
        this.particlesCounter = 5;//this.particlesCounterMax *2;

	},
	update: function(){
		this.range = this.sprite.height / 2.5;
		var tempRot = 0;
		if(this.behaviour.tempPosition){
			tempRot = Math.atan2(this.behaviour.tempPosition.y, this.behaviour.tempPosition.x);
		}else{
			tempRot = Math.atan2(this.velocity.y, this.velocity.x);
		}
		// console.log(Math.atan2(this.behaviour.velocity.y, this.velocity.x), this.velocity);
		this.getContent().rotation = -tempRot;//radiansToDegrees(Math.sin(this.velocity.x) + Math.sin(this.velocity.y)) + 90;
		this._super();
		
		this.behaviour.update(this);
		// if(this.velocity.x !== 0 || this.velocity.y !== 0){
		this.updateableParticles();
		// }
	},
	updateableParticles:function(){
		// console.log(this.particlesCounter);
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

            // console.log('particle');
            //efeito 3
            var particle = new Particles({x: Math.random() * 4 - 2, y:Math.random() * 4 - 2}, 120, this.particleSource, Math.random() * 0.3 - 0.15);
            particle.maxScale = this.getContent().scale.x / 2 + Math.random() * this.getContent().scale.x / 2;
            particle.maxInitScale = particle.maxScale;

            particle.growType = -1;
            particle.build();
            // particle.getContent().tint = 0xFF0000;
            particle.gravity = 0.0;
            particle.alphadecress = 0.08;
            particle.scaledecress = -0.04;
            particle.setPosition(this.getPosition().x - (Math.random() + this.getContent().width * 0.1) / 2,
                this.getPosition().y);
            this.layer.addChild(particle);
            // particle.getContent().parent.setChildIndex(particle.getContent() , 0);
        }
    },
	preKill:function(){
		if(this.invencible){
			return;
		}
		for (var i = 5; i >= 0; i--) {
			var particle = new Particles({x: Math.random() * 8 - 4, y:Math.random() * 8 - 4}, 120, this.particleSource, Math.random() * 0.1);
			particle.maxScale = this.getContent().scale.x / 2;
            particle.maxInitScale = particle.maxScale;
			particle.build();
			// particle.getContent().tint = 0xFF0000;
			particle.gravity = 0.3 * Math.random();
			particle.alphadecress = 0.04;
			particle.scaledecress = -0.05;
			particle.setPosition(this.getPosition().x - (Math.random() + this.getContent().width * 0.1) / 2,
				this.getPosition().y);
			this.layer.addChild(particle);
		}
		this.collidable = false;
		this.kill = true;
	},
});