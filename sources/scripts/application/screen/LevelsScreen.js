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
        var tempColor = addBright(APP.vecColors[APP.currentColorID], 0.9);
        this.worldsContainer = new PIXI.DisplayObjectContainer();
        var iacumW = 0;
        var jacumW = 0;
        // alert(APP.maxLevel+' - '+ APP.maxWorld);
        for (i = 0; i < LEVELS.length; i++) {
            coinsAcum = 0;
            levelCoinsAcum = 0;
            for (j = 0; j < LEVELS[i].length; j++) {
                if(LEVELS[i][j][1].coins){
                    coinsAcum += LEVELS[i][j][1].coins;
                }
                if(LEVELS[i][j][1].highscore){
                    levelCoinsAcum += LEVELS[i][j][1].highscore;
                }
            }
            this.worldsTotalCoins.push(coinsAcum);
            this.worldsGotCoins.push(levelCoinsAcum);
        }
        for (i = 0; i < LEVELS.length; i++) {
            levelsContainer = new PIXI.DisplayObjectContainer();

            if(i % 2 === 0 && i !== 0){
                jacumW++;
                iacumW = 0;
            }
            tempWorldContainer = new PIXI.DisplayObjectContainer();
            tempWorldGraphic = new PIXI.Graphics();
            tempWorldGraphic.lineStyle(1,addBright(APP.vecColors[APP.currentColorID], 0.8));
            tempWorldGraphic.beginFill(addBright(APP.vecColors[APP.currentColorID], 0.9));
            tempWorldGraphic.drawCircle(windowHeight * 0.09,windowHeight * 0.09,windowHeight * 0.09);
            // tempWorldGraphic.drawRect(0,0,windowHeight * 0.18,windowHeight * 0.18);
            tempWorldGraphic.interactive = true;
            tempWorldGraphic.buttonMode = true;
            tempWorldGraphic.id = i;
            tempWorldGraphic.scope = this;
            tempWorldContainer.addChild(tempWorldGraphic);
            if(i <= APP.maxWorld){
                tempWorldGraphic.touchstart = tempWorldGraphic.mousedown = this.selectWorld;
                // coinGraph = new PIXI.Graphics();
                // coinGraph.beginFill(0xFFFFFF);
                size = tempWorldGraphic.width * 0.2;
                // coinGraph.drawRect(-size/2,-size/2,size,size);

                worldLabel = new PIXI.Text('WORLD '+(i + 1), {align:'left',font:'16px Vagron', fill:'#FFFFFF'});
                worldLabel.alpha = 0.8;
                worldLabel.resolution = 2;
                worldLabel.position.x = tempWorldGraphic.width / 2 - worldLabel.width / 2 / worldLabel.resolution;
                worldLabel.position.y = 15;

                totalCoins = new PIXI.Text(this.worldsGotCoins[i]+'/'+this.worldsTotalCoins[i], {align:'center',font:'25px Vagron', fill:'#FFFFFF'});
                totalCoins.resolution = 2;
                totalCoins.alpha = 0.8;
                // coinGraph.position.x = tempWorldGraphic.width / 2;
                // coinGraph.position.y = tempWorldGraphic.height / 2;

                totalCoins.position.x = tempWorldGraphic.width / 2 - totalCoins.width / 2 / totalCoins.resolution;
                totalCoins.position.y = tempWorldGraphic.height / 2 - totalCoins.height  / totalCoins.resolution /2;

                tempWorldContainer.addChild(totalCoins);
                // tempWorldContainer.addChild(coinGraph);
                // tempWorldContainer.addChild(worldLabel);
            }else{
                tempWorldGraphic.clear();
                tempWorldGraphic.beginFill(addBright(APP.vecColors[APP.currentColorID], 0.7));
                tempWorldGraphic.drawRect(0,0,windowHeight * 0.18,windowHeight * 0.18);
            }

            tempWorldContainer.position.x = (tempWorldGraphic.width * 1.5) * iacumW;
            tempWorldContainer.position.y = (tempWorldGraphic.height * 1.5) * jacumW;
            iacumW ++;

            var iacum = 0;
            var jacum = 0;
            for (j = 0; j < LEVELS[i].length; j++) {
                if(j % 3 === 0 && j !== 0){
                    jacum++;
                    iacum = 0;
                }
                var tempCoins = LEVELS[i][j][1].coins;
                var high = LEVELS[i][j][1].highscore;

                tempContainer = new PIXI.DisplayObjectContainer();
                tempGraphicLevel = new PIXI.Graphics();
                tempGraphicLevel.lineStyle(1,addBright(APP.vecColors[APP.currentColorID], 0.8));
                tempGraphicLevel.beginFill(tempColor);
                tempGraphicLevel.drawCircle(windowHeight * 0.05,windowHeight * 0.05,windowHeight * 0.05);
                // tempGraphicLevel.drawRect(0,0,windowHeight * 0.1,windowHeight * 0.1);
                tempGraphicLevel.interactive = true;
                tempGraphicLevel.buttonMode = true;
                tempGraphicLevel.id = j;
                tempGraphicLevel.scope = this;
                tempContainer.addChild(tempGraphicLevel);
                tempContainer.position.x = (tempGraphicLevel.width * 1.5) * iacum;
                tempContainer.position.y = (tempGraphicLevel.height * 1.5) * jacum;
                levelNumber = new PIXI.Text(j+1, {align:'center',font:'25px Vagron', fill:'#FFFFFF'});
                levelNumber.resolution = 2;
                levelNumber.alpha = 0.8;
                levelNumber.position.x = tempGraphicLevel.width / 2 - levelNumber.width / 2 / levelNumber.resolution;
                levelNumber.position.y = tempGraphicLevel.height * 0.1 / levelNumber.resolution;
                tempContainer.addChild(levelNumber);

                if(j <= APP.maxLevel || i < APP.maxWorld){
                    tempGraphicLevel.touchstart = tempGraphicLevel.mousedown = this.selectLevel;
                    for (var k = 1; k < tempCoins + 1; k++) {
                        coinGraph = new PIXI.Graphics();
                        coinGraph.beginFill(k <=high ? 0xFFFFFF : addBright(APP.vecColors[APP.currentColorID], 0.4));
                        size = tempGraphicLevel.width * 0.1;
                        coinGraph.drawRect(-size/2,-size/2,size,size);
                        coinGraph.position.x = ((tempGraphicLevel.width) / (tempCoins + 1)) * k;
                        coinGraph.position.y = tempGraphicLevel.height - coinGraph.height * 2;
                        tempContainer.addChild(coinGraph);
                    }
                }else{
                    tempGraphicLevel.clear();
                    tempGraphicLevel.beginFill(addBright(APP.vecColors[APP.currentColorID], 0.7));
                    tempGraphicLevel.drawCircle(windowHeight * 0.05,windowHeight * 0.05,windowHeight * 0.05);
                }

                levelsContainer.addChild(tempContainer);
                iacum ++;
            }
            worldLabel2 = new PIXI.Text('WORLD '+(i + 1), {align:'left',font:'48px Vagron', fill:'#FFFFFF'});
            worldLabel2.resolution = 2;
            worldLabel2.alpha = 0.5;
            worldLabel2.position.x = levelsContainer.width / 2 - worldLabel2.width / 2 / worldLabel2.resolution;
            worldLabel2.position.y = -worldLabel2.height/1.5;
            levelsContainer.addChild(worldLabel2);
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
        TweenLite.to(this.currentWorldGraphics.position, 0.8, {x:-windowWidth / 2.2, y:windowHeight * 1.2, onComplete:function(){
            callback(scope);
        }});
    },
    showWorlds:function(scope){
        var self = scope?scope:this;
        if(self.currentWorldGraphics && self.currentWorldGraphics.parent){
            console.log('removeLevelss');
            self.currentWorldGraphics.parent.removeChild(self.currentWorldGraphics);
        }
        self.worldsContainer.position.x = windowWidth / 2 - ((windowHeight * 0.18 * 1.5) + (windowHeight * 0.18)) / 2;//self.worldsContainer.width / 2;
        self.worldsContainer.position.y = windowHeight - self.worldsContainer.height*1.2;
        self.addChild(self.worldsContainer);
        TweenLite.from(self.worldsContainer, 0.8, {x:windowWidth, y:-self.worldsContainer.height});
        TweenLite.to(APP.interactiveBackground, 1.5, {accel:0});
    },
    showLevels:function(scope){
        var self = scope?scope:this;
        if(self.worldsContainer && self.worldsContainer.parent){
            self.worldsContainer.parent.removeChild(self.worldsContainer);
        }
        self.currentWorldGraphics.position.x = windowWidth / 2 - ((windowHeight * 0.1 * 1.5 * 2) + (windowHeight * 0.1)) / 2;
        // self.currentWorldGraphics.position.x = windowWidth / 2 - self.currentWorldGraphics.width / 2;
        self.currentWorldGraphics.position.y = windowHeight / 2 - ((windowHeight * 0.1 * 1.5 * 3) + (windowHeight * 0.1)) / 2;
        // self.currentWorldGraphics.position.y = windowHeight / 2 - self.currentWorldGraphics.height / 3;
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
            TweenLite.to(APP.interactiveBackground, 1.5, {accel:0});
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
    },
    transitionIn:function()
    {
        this.build();
    },
    transitionOut:function(nextScreen, container)
    {
        var self = this;
        if(this.frontShape){
            this.frontShape.parent.setChildIndex(this.frontShape, this.frontShape.parent.children.length - 1);
            TweenLite.to(this.frontShape, 0.3, {alpha:1, onComplete:function(){
                self.destroy();
                container.removeChild(self.getContent());
                nextScreen.transitionIn();
            }});
        }else{
            self.destroy();
            container.removeChild(self.getContent());
            nextScreen.transitionIn();
        }


    },
});