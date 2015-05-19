/*jshint undef:false */
var LevelsScreen = AbstractScreen.extend({
    init: function (label) {
        this._super(label);
        APP.currentLevel = 0;
        APP.currentWorld = 0;
    },
    destroy: function () {
        this._super();
    },
    build: function () {
        this._super();
        console.log('this');
        this.worlds = [];
        this.worldsContainer = null;
        var levelsContainer = null;
        var tempGraphicLevel = null;
        var tempColor = addBright(APP.vecColors[APP.currentColorID], 0.65);
        this.worldsContainer = new PIXI.DisplayObjectContainer();
        for (var i = 0; i < LEVELS.length; i++) {
            levelsContainer = new PIXI.DisplayObjectContainer();
            var tempWorldGraphic = new PIXI.Graphics();
            tempWorldGraphic.beginFill(tempColor);
            tempWorldGraphic.drawRect(0,0,windowWidth * 0.2,windowWidth * 0.25);
            tempWorldGraphic.position.x = (tempWorldGraphic.width * 1.5) * i;
            tempWorldGraphic.interactive = true;
            tempWorldGraphic.buttonMode = true;
            tempWorldGraphic.touchstart = tempWorldGraphic.mousedown = this.selectWorld;
            tempWorldGraphic.id = i;
            tempWorldGraphic.scope = this;

            this.worldsContainer.addChild(tempWorldGraphic);
            var iacum = 0;
            var jacum = 0;
            for (var j = 0; j < LEVELS[i].length; j++) {
                if(j % 5 === 0 && j !== 0){
                    jacum++;
                    iacum = 0;
                }
                tempContainer = new PIXI.DisplayObjectContainer();
                tempGraphicLevel = new PIXI.Graphics();
                tempGraphicLevel.beginFill(tempColor);
                tempGraphicLevel.drawRect(0,0,windowWidth * 0.1,windowWidth * 0.05);
                tempGraphicLevel.position.x = (tempGraphicLevel.width * 1.5) * iacum;
                tempGraphicLevel.position.y = (tempGraphicLevel.height * 1.5) * jacum;
                tempGraphicLevel.interactive = true;
                tempGraphicLevel.buttonMode = true;
                tempGraphicLevel.touchstart = tempGraphicLevel.mousedown = this.selectLevel;
                tempGraphicLevel.id = j;
                tempGraphicLevel.scope = this;
                tempContainer.addChild(tempGraphicLevel);
                levelsContainer.addChild(tempContainer);
                iacum ++;
            }
            this.worlds.push([levelsContainer]);
        }



        this.backButtonContainer = new PIXI.DisplayObjectContainer();
        this.backButton = new PIXI.Graphics();
        this.backButton.beginFill(0xFFFFFF);
        this.backButton.moveTo(30,0);
        this.backButton.lineTo(30,30);
        this.backButton.lineTo(0,15);
        this.backButton.lineTo(30,0);
        this.backButtonContainer.addChild(this.backButton);
        this.backButtonContainer.scope = this;
        this.backButtonContainer.interactive = true;
        this.backButtonContainer.buttonMode = true;
        this.backButtonContainer.touchstart = this.backButtonContainer.mousedown = this.backFunction;

        this.addChild(this.backButtonContainer);

        this.showWorlds();
    },
    hideWorlds:function(callback, scope){
        TweenLite.to(this.worldsContainer.position, 1, {x:-windowWidth / 2, y:windowHeight, onComplete:function(){
            callback(scope);
        }});
    },
    hideLevels:function(callback, scope){
        TweenLite.to(this.currentWorldGraphics.position, 1, {x:-windowWidth / 2, y:windowHeight, onComplete:function(){
            callback(scope);
        }});
    },
    showWorlds:function(scope){
        var self = scope?scope:this;
        if(self.currentWorldGraphics && self.currentWorldGraphics.parent){
            self.currentWorldGraphics.parent.removeChild(self.currentWorldGraphics);
        }

        self.worldsContainer.position.x = windowWidth / 2 - self.worldsContainer.width / 2;
        self.worldsContainer.position.y = windowHeight / 2 - self.worldsContainer.height / 2;
        self.addChild(self.worldsContainer);
        TweenLite.from(self.worldsContainer, 4, {x:windowWidth, y:-self.worldsContainer.height, ease:'easeOutElastic'});
    },
    showLevels:function(scope){
        var self = scope?scope:this;
        if(self.worldsContainer && self.worldsContainer.parent){
            self.worldsContainer.parent.removeChild(self.worldsContainer);
        }

        self.currentWorldGraphics.position.x = windowWidth / 2 - self.currentWorldGraphics.width / 2;
        self.currentWorldGraphics.position.y = windowHeight / 2 - self.currentWorldGraphics.height / 2;
        self.addChild(self.currentWorldGraphics);
        TweenLite.from(self.currentWorldGraphics.position, 4, {x:windowWidth, y:-self.currentWorldGraphics.height, ease:'easeOutElastic'});
    },
    backFunction:function(event){
        var scope = event.target.scope;
        if(scope.worldOpened){
            scope.hideLevels(scope.showWorlds, scope);
        }
    },
    getWorlds:function(){
        return this.worlds;
    },
    selectLevel:function(event){
        APP.currentLevel =  (event.target.id);
        var scope = event.target.scope;
        scope.hideLevels(function(){
            scope.screenManager.change('Game');
        }, scope);
    },
    selectWorld:function(event){
        var worldID = (event.target.id);
        APP.currentWorld = worldID;
        var scope = event.target.scope;
        scope.worldOpened = true;
        var worlds = scope.worlds[event.target.id][0];
        scope.currentWorldGraphics = worlds;
        scope.hideWorlds(scope.showLevels, scope);
    }
});