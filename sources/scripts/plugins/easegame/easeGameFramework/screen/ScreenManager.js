var ScreenManager = Class.extend({
init:function()
	{
		this.label = "";
        this.childs = [];
        this.container = new PIXI.DisplayObjectContainer();
        this.currentScreen = null;
        this.lastScreenLabel = null;
        this.nextScreen = null;
        this.canvasArea = {x:0, y:0};
	},
	build:function(label)
	{
		this.label = label;
	},
	addScreen:function(screen)
	{
		if(this.currentScreen === null)
			this.currentScreen = screen;

		this.childs.push(screen);
		screen.canvasArea = this.canvasArea;
		screen.screenManager = this;
	},
	prevScreen:function()
	{
		this.change(this.lastScreenLabel);
	},
	change:function(screenLabel)
	{
		if(ScreenManager.debug)console.log(this.currentScreen.screenLabel,"change to",screenLabel);
		//if(this.currentScreen.screenLabel != screenLabel)
		{
			for(var i = 0; i < this.childs.length; i++){
				if(this.childs[i].screenLabel == screenLabel){
					this.nextScreen = this.childs[i];
					if(this.currentScreen && this.currentScreen.getContent().parent)
					{
						this.currentScreen.transitionOut(this.nextScreen,this.container);
						this.container.addChild(this.nextScreen.getContent());
					}else
					{
						this.nextScreen.transitionIn();
						this.container.addChild(this.nextScreen.getContent());
					}
					this.lastScreenLabel = this.currentScreen.screenLabel;
					this.currentScreen = this.nextScreen;
				}			
			}
		}
	},
	update:function()
	{
		if(this.currentScreen != null)
			this.currentScreen.update();
	},
	setCanvasArea:function(canvasWidth, canvasHeight)
	{
		this.canvasArea.x = canvasWidth;
		this.canvasArea.y = canvasHeight;
	}

});