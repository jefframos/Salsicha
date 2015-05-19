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
        this.worldsTotalCoins = [];
        this.worldsGotCoins = [];
        this.worlds = [];
        this.worldsContainer = null;
        var i = 0;
        var j = 0;
        var levelsContainer = null;
        var tempGraphicLevel = null;
        var tempColor = addBright(APP.vecColors[APP.currentColorID], 0.65);
        this.worldsContainer = new PIXI.DisplayObjectContainer();
        var iacumW = 0;
        var jacumW = 0;
        for (i = 0; i < LEVELS.length; i++) {
            coinsAcum = 0;
            for (j = 0; j < LEVELS[i].length; j++) {
                if(LEVELS[i][j][1].coins){
                    coinsAcum += LEVELS[i][j][1].coins;
                }
            }
            this.worldsTotalCoins.push(coinsAcum);
            this.worldsGotCoins.push(1);
        }
        for (i = 0; i < LEVELS.length; i++) {
            levelsContainer = new PIXI.DisplayObjectContainer();

            if(i % 2 === 0 && i !== 0){
                jacumW++;
                iacumW = 0;
            }
            tempWorldContainer = new PIXI.DisplayObjectContainer();
            tempWorldGraphic = new PIXI.Graphics();
            tempWorldGraphic.beginFill(addBright(APP.vecColors[APP.currentColorID], 0.9 - 0.1 * i));
            tempWorldGraphic.drawRect(0,0,windowHeight * 0.2,windowHeight * 0.2);
            tempWorldGraphic.interactive = true;
            tempWorldGraphic.buttonMode = true;
            tempWorldGraphic.touchstart = tempWorldGraphic.mousedown = this.selectWorld;
            tempWorldGraphic.id = i;
            tempWorldGraphic.scope = this;

            coinGraph = new PIXI.Graphics();
            coinGraph.beginFill(0xFFFFFF);
            size = tempWorldGraphic.width * 0.2;
            coinGraph.drawRect(-size/2,-size/2,size,size);
            totalCoins = new PIXI.Text(this.worldsGotCoins[i]+'/'+this.worldsTotalCoins[i], {align:'center',font:'25px monospace', fill:'#FFFFFF'});
            tempWorldContainer.addChild(tempWorldGraphic);

            coinGraph.position.x = tempWorldContainer.width / 2;
            coinGraph.position.y = tempWorldContainer.height / 2;

            totalCoins.position.x = tempWorldContainer.width / 2 - totalCoins.width / 2;
            totalCoins.position.y = tempWorldContainer.height - totalCoins.height ;

            tempWorldContainer.position.x = (tempWorldContainer.width * 1.5) * iacumW;
            tempWorldContainer.position.y = (tempWorldContainer.height * 1.5) * jacumW;

            tempWorldContainer.addChild(totalCoins);
            tempWorldContainer.addChild(coinGraph);
            iacumW ++;

            var iacum = 0;
            var jacum = 0;
            for (j = 0; j < LEVELS[i].length; j++) {
                if(j % 5 === 0 && j !== 0){
                    jacum++;
                    iacum = 0;
                }
                var tempCoins = LEVELS[i][j][1].coins;
                var high = LEVELS[i][j][1].highscore;
                tempContainer = new PIXI.DisplayObjectContainer();
                tempGraphicLevel = new PIXI.Graphics();
                tempGraphicLevel.beginFill(tempColor);
                tempGraphicLevel.drawRect(0,0,windowHeight * 0.1,windowHeight * 0.1);
                tempGraphicLevel.interactive = true;
                tempGraphicLevel.buttonMode = true;
                tempGraphicLevel.touchstart = tempGraphicLevel.mousedown = this.selectLevel;
                tempGraphicLevel.id = j;
                tempGraphicLevel.scope = this;
                tempContainer.addChild(tempGraphicLevel);
                tempContainer.position.x = (tempContainer.width * 1.5) * iacum;
                tempContainer.position.y = (tempContainer.height * 1.5) * jacum;
                levelNumber = new PIXI.Text(j+1, {align:'center',font:'25px monospace', fill:'#FFFFFF'});
                levelNumber.position.x = tempContainer.width / 2 - levelNumber.width / 2;
                levelNumber.position.y = tempGraphicLevel.height * 0.1;
                tempContainer.addChild(levelNumber);
                for (var k = 1; k < tempCoins + 1; k++) {
                    coinGraph = new PIXI.Graphics();
                    coinGraph.beginFill(k <=high ? 0xFFFFFF : addBright(APP.vecColors[APP.currentColorID], 0.4));
                    size = tempGraphicLevel.width * 0.1;
                    coinGraph.drawRect(-size/2,-size/2,size,size);
                    coinGraph.position.x = (tempContainer.width / (tempCoins + 1)) * k;
                    coinGraph.position.y = tempContainer.height - coinGraph.height * 2;
                    tempContainer.addChild(coinGraph);
                }

                levelsContainer.addChild(tempContainer);
                iacum ++;
            }
            this.worldsContainer.addChild(tempWorldContainer);
            this.worlds.push([levelsContainer]);
        }



        this.backButtonContainer = new PIXI.DisplayObjectContainer();
        this.backButton = new PIXI.Graphics();
        this.backButton.beginFill(0xFFFFFF);
        this.backButton.moveTo(20,0);
        this.backButton.lineTo(20,20);
        this.backButton.lineTo(0,10);
        this.backButton.lineTo(20,0);
        this.backButtonContainer.addChild(this.backButton);
        this.backButtonContainer.scope = this;
        this.backButtonContainer.interactive = true;
        this.backButtonContainer.buttonMode = true;
        this.backButtonContainer.touchstart = this.backButtonContainer.mousedown = this.backFunction;
        this.backButtonContainer.position.x = 20;
        this.backButtonContainer.position.y = 20;
        this.addChild(this.backButtonContainer);

        this.showWorlds();
    },
    hideWorlds:function(callback, scope){
        APP.interactiveBackground.accel = -2;

        TweenLite.to(this.worldsContainer.position, 0.8, {x:-windowWidth / 2, y:windowHeight, onComplete:function(){
            callback(scope);
        }});
    },
    hideLevels:function(callback, scope){
        APP.interactiveBackground.accel = -2;
        TweenLite.to(this.currentWorldGraphics.position, 0.8, {x:-windowWidth / 2, y:windowHeight, onComplete:function(){
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
        TweenLite.from(self.worldsContainer, 0.8, {x:windowWidth, y:-self.worldsContainer.height});
        TweenLite.to(APP.interactiveBackground, 1.5, {accel:0});
    },
    showLevels:function(scope){
        var self = scope?scope:this;
        if(self.worldsContainer && self.worldsContainer.parent){
            self.worldsContainer.parent.removeChild(self.worldsContainer);
        }
        self.currentWorldGraphics.position.x = windowWidth / 2 - self.currentWorldGraphics.width / 2;
        self.currentWorldGraphics.position.y = windowHeight / 2 - self.currentWorldGraphics.height / 2;
        self.addChild(self.currentWorldGraphics);
        TweenLite.from(self.currentWorldGraphics.position, 0.8, {x:windowWidth, y:-self.currentWorldGraphics.height});
        TweenLite.to(APP.interactiveBackground, 1.5, {accel:0});
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