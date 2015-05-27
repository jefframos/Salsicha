/*jshint undef:false */
var EndModal = Class.extend({
	init:function(screen){
		this.screen = screen;
		
		this.container = new PIXI.DisplayObjectContainer();
		this.boxContainer = new PIXI.DisplayObjectContainer();
		this.bg = new PIXI.Graphics();
		this.bg.beginFill(0xdb453c);
		this.bg.drawRect(0,0,windowWidth, windowHeight);
		this.bg.alpha = 0.8;
		// this.container.addChild(this.bg);
		this.container.addChild(this.boxContainer);

		var self = this;

		// this.back = new SimpleSprite('UI_modal_back_1.png');
		this.backBox = new PIXI.Graphics();
		this.backBox.beginFill(0xdb453c);
		this.backBox.drawRect(0,0,windowWidth, windowHeight);

        this.boxContainer.addChild(this.backBox);
        this.backBox.alpha = 0;


		this.gameOver = new PIXI.Text('GAME OVER', {font:'50px Vagron', fill:'#FFF'});
		scaleConverter(this.gameOver.width, this.boxContainer.width, 1, this.gameOver);
		this.gameOver.position.y = 0;
		this.boxContainer.addChild(this.gameOver);

		this.newHigh = new PIXI.Text('NEW HIGHSCORE', {font:'20px Vagron', fill:'#FFF'});
		this.newHigh.position.y = this.gameOver.position.y + this.gameOver.height;
		this.newHigh.position.x = this.boxContainer.width / 2 - this.newHigh.width / 2;
		this.boxContainer.addChild(this.newHigh);

		this.playedLabel = new PIXI.Text('GAMES PLAYED', {font:'20px Vagron', fill:'#FFF'});
		this.playedLabel.position.y = this.newHigh.position.y + this.newHigh.height;
		this.playedLabel.position.x = this.boxContainer.width / 2 - this.playedLabel.width / 2;
		this.boxContainer.addChild(this.playedLabel);

		this.playedLabelValue = new PIXI.Text('0', {font:'30px Vagron', fill:'#FFF'});
		this.playedLabelValue.position.y = this.playedLabel.position.y + this.playedLabel.height;
		this.playedLabelValue.position.x = this.boxContainer.width / 2 - this.playedLabelValue.width / 2;
		this.boxContainer.addChild(this.playedLabelValue);

		this.score = new PIXI.Text('SCORE', {font:'20px Vagron', fill:'#FFF'});
		this.score.position.y = this.playedLabelValue.position.y + this.playedLabelValue.height;
		this.score.position.x = this.boxContainer.width / 2 - this.score.width / 2;
		this.boxContainer.addChild(this.score);

		this.scoreValue = new PIXI.Text('0', {font:'30px Vagron', fill:'#FFF'});
		this.scoreValue.position.y = this.score.position.y + this.score.height;
		this.scoreValue.position.x = this.boxContainer.width / 2 - this.scoreValue.width / 2;
		this.boxContainer.addChild(this.scoreValue);

		this.bestScore = new PIXI.Text('BEST SCORE', {font:'20px Vagron', fill:'#FFF'});
		this.bestScore.position.y = this.scoreValue.position.y + this.scoreValue.height;
		this.bestScore.position.x = this.boxContainer.width / 2 - this.bestScore.width / 2;
		this.boxContainer.addChild(this.bestScore);

		this.bestScoreValue = new PIXI.Text('0', {font:'30px Vagron', fill:'#FFF'});
		this.bestScoreValue.position.y = this.bestScore.position.y + this.bestScore.height;
		this.bestScoreValue.position.x = this.boxContainer.width / 2 - this.bestScoreValue.width / 2;
		this.boxContainer.addChild(this.bestScoreValue);


		this.replayButton = new DefaultButton('UI_button_default_1.png', 'UI_button_default_1.png');
		this.replayButton.build();
		this.replayButton.addLabel(new PIXI.Text('REPLAY', {font:'30px Vagron', fill:'#db453c'}), 25,2);
		scaleConverter(this.replayButton.getContent().width, this.boxContainer.width, 0.5, this.replayButton);
		this.replayButton.setPosition(this.boxContainer.width / 2 - this.replayButton.getContent().width / 2,this.bestScoreValue.position.y + this.bestScoreValue.height);
		this.replayButton.clickCallback = function(){
			self.hide(function(){
				self.screen.updateable = true;
				self.screen.startGame();
			});
		};
		this.boxContainer.addChild(this.replayButton.getContent());

		this.newSeed = new DefaultButton('UI_button_default_1.png', 'UI_button_default_1.png');
		this.newSeed.build();
		this.newSeed.addLabel(new PIXI.Text('NEW', {font:'30px Vagron', fill:'#db453c'}), 45,2);
		scaleConverter(this.newSeed.getContent().width, this.boxContainer.width, 0.5, this.newSeed);
		this.newSeed.setPosition(this.boxContainer.width / 2 - this.newSeed.getContent().width / 2,this.replayButton.getContent().position.y + this.replayButton.getContent().height + 20);//this.backBars.getContent().height / 2 - this.replayButton.height / 2 - 10);

		this.newSeed.clickCallback = function(){
			self.hide(function(){
				self.screen.updateable = true;
				APP.seed.seed = Math.random() * 0xFFFF;
				self.screen.startGame();
			});
		};
		this.boxContainer.addChild(this.newSeed.getContent());

		this.shopButton = new DefaultButton('UI_button_default_1.png', 'UI_button_default_1.png');
		this.shopButton.build();
		this.shopButton.addLabel(new PIXI.Text('SHOP', {font:'30px Vagron', fill:'#db453c'}), 45,2);
		scaleConverter(this.shopButton.getContent().width, this.boxContainer.width, 0.5, this.shopButton);
		this.shopButton.setPosition(this.boxContainer.width / 2 - this.shopButton.getContent().width / 2,this.newSeed.getContent().position.y + this.newSeed.getContent().height + 20);//this.backBars.getContent().height / 2 - this.replayButton.height / 2 - 10);

		this.shopButton.clickCallback = function(){
			self.screen.screenManager.change('Choice');
		};
		this.boxContainer.addChild(this.shopButton.getContent());

		this.shareButton = new DefaultButton('UI_button_default_1.png', 'UI_button_default_1.png');
		this.shareButton.build();
		this.shareButton.addLabel(new PIXI.Text('SHARE', {font:'30px Vagron', fill:'#db453c'}), 30,2);
		scaleConverter(this.shareButton.getContent().width, this.boxContainer.width, 0.5, this.shareButton);
		this.shareButton.setPosition(this.boxContainer.width / 2 - this.shareButton.getContent().width / 2,this.shopButton.getContent().position.y + this.shopButton.getContent().height + 20);//this.backBars.getContent().height / 2 - this.replayButton.height / 2 - 10);

		this.shareButton.clickCallback = function(){
			// self.screen.screenManager.change('Choice');
		};
		this.boxContainer.addChild(this.shareButton.getContent());

		this.rateButton = new DefaultButton('UI_button_default_1.png', 'UI_button_default_1.png');
		this.rateButton.build();
		this.rateButton.addLabel(new PIXI.Text('RATE', {font:'30px Vagron', fill:'#db453c'}), 45,2);
		scaleConverter(this.rateButton.getContent().width, this.boxContainer.width, 0.5, this.rateButton);
		this.rateButton.setPosition(this.boxContainer.width / 2 - this.rateButton.getContent().width / 2,this.shareButton.getContent().position.y + this.shareButton.getContent().height + 20);//this.backBars.getContent().height / 2 - this.replayButton.height / 2 - 10);

		this.rateButton.clickCallback = function(){
			// self.screen.screenManager.change('Choice');
		};
		this.boxContainer.addChild(this.rateButton.getContent());

		this.backBox.height = this.boxContainer.height;

		scaleConverter(this.boxContainer.height, windowHeight, 0.9, this.boxContainer);
	},
	show:function(){
		this.screen.addChild(this);
		this.screen.blockPause = true;
		this.boxContainer.visible = true;
		this.container.parent.setChildIndex(this.container,this.container.parent.children.length -1);

		if(APP.highScore < APP.currentPoints){
			APP.highScore = APP.currentPoints;
			this.newHigh.alpha = 1;
		}else{
			this.newHigh.alpha = 0;
		}
		this.scoreValue.setText(APP.currentPoints);
		this.bestScoreValue.setText(APP.highScore);
		this.playedLabelValue.setText(APP.plays);


		this.scoreValue.position.x = windowWidth / 2 - this.scoreValue.width / 2;
		this.bestScoreValue.position.x = windowWidth / 2 - this.bestScoreValue.width / 2;
		this.playedLabelValue.position.x = windowWidth / 2 - this.playedLabelValue.width / 2;
		
		// this.screen.updateable = false;
		// this.boxContainer.width / 2 - this.bestScoreValue.width / 2;
		this.boxContainer.position.x = windowWidth / 2 - this.boxContainer.width / 2;
		this.boxContainer.position.y = windowHeight / 2 - this.boxContainer.height / 2;
		this.bg.alpha = 0.8;
		this.boxContainer.alpha = 1;

		TweenLite.from(this.bg, 0.5, {alpha:0});
		TweenLite.from(this.boxContainer, 0.5, {y:-this.boxContainer.height});

		console.log('show');

		APP.appModel.saveScore();
	},
	hide:function(callback){
		var self = this;
		this.screen.blockPause = false;
		this.screen.updateable = true;
		TweenLite.to(this.bg, 0.5, {delay:0.1, alpha:0, onComplete:function(){
			if(self.container.parent){
				self.container.parent.removeChild(self.container);
			}
			if(callback){
				callback();
			}
			// self.kill = true;
		}});
		TweenLite.to(this.boxContainer.position, 0.5, {y:-this.boxContainer.height, ease:'easeInBack'});
		TweenLite.to(this.boxContainer, 0.5, {alpha:0});
		TweenLite.to(this.bg, 0.5, {alpha:0});
	},
	getContent:function(){
		return this.container;
	}
});