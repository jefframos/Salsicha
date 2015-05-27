/*jshint undef:false */
var Application = AbstractApplication.extend({
	init:function(){
        var self = this;

        //GUMBALL
        // this.vecColors = [0x219A33,0xD61767,0x63C2C8,0x5AF271,0xB24191,0xFFE40E,0xE84E0E,0x5C79BB];
        // this.vecColorsS = ['#219A33','#D61767','#63C2C8','#5AF271','#B24191','#FFE40E','#E84E0E','#5C79BB'];

        this.vecColors = [0xFF7BD6,0xFF5C6A,0xFF8668,0xFCBE55,0x2A78FF,0x9248F9,0xD751ED, 0x93BF41];
        this.vecColorsS = ['#FF7BD6','#FF5C6A','#FF8668','#FCBE55','#2A78FF','#9248F9','#D751ED', '#93BF41'];
        this.vecPerfects = ['PERFECT!', 'AWESOME!', 'AMAZING!', 'GOD!!!', 'WOWOWOW', 'YEAH!'];
        this.vecGood = ['GOOD', 'COOL', 'YEP', 'NOT BAD'];
        this.vecError = ['NOOOO!', 'BAD', 'MISS!', 'NOT', 'AHHHH'];
        this.currentColorID = Math.floor(this.vecColors.length * Math.random());

        this.backColor = this.vecColors[this.currentColorID];
        this.currentWorld = this.currentLevel = 0;
        function initialize(){
            self._super(windowWidth, windowHeight);
            self.stage.setBackgroundColor(self.backColor);
            self.stage.removeChild(self.loadText);

            self.labelDebug = new PIXI.Text('', {font:'15px Arial'});
            // self.stage.addChild(self.labelDebug);
            self.labelDebug.position.y = windowHeight - 20;
            self.labelDebug.position.x = 20;



            self.initialized = true;
            // self.mute = false;

            self.audioController = new AudioController();

            self.withAPI = false;
            if(window.location.hash === '#withoutAPI'){
                self.withAPI = false;
            }

            // self.build();
        }
        initialize();

        this.mute = false;

	},

    update:function(){
        if(!this.initialized){
            return;
        }
        this._super();
        if(this.interactiveBackground){
            this.interactiveBackground.update();
        }
        if(this.withAPI && this.apiLogo && this.apiLogo.getContent().height > 1 && this.apiLogo.getContent().position.x === 0){
            // this.apiLogo.getContent().position.y = windowHeight - this.apiLogo.getContent().height;
            scaleConverter(this.apiLogo.getContent().width, windowWidth, 0.5, this.apiLogo);
            this.apiLogo.getContent().position.x = windowWidth / 2 - this.apiLogo.getContent().width / 2;
        }
        if(!this.screenManager)  {
            return;
        }
        if(!this.screenManager.currentScreen){
            return;
        }
        if(!this.labelDebug || !this.labelDebug.parent){
            return;
        }
        this.childsCounter = 1;
        this.recursiveCounter(this.screenManager.currentScreen);
        this.labelDebug.setText(this.childsCounter);
        // Retrieves the logo from Spil

    },
    apiLoaded:function(apiInstance){
        if(!this.withAPI){
            return;
        }
        this.apiInstance = apiInstance;


        //added logo api functions
        var logoData = apiInstance.Branding.getLogo();
        this.apiLogo = new DefaultButton(logoData.image,logoData.image);
        this.apiLogo.build();
        this.apiLogo.clickCallback = function(){
            logoData.action();
        };
        this.stage.addChild(this.apiLogo.getContent());

        //more games function
        this.buttonProperties = apiInstance.Branding.getLink('more_games');

        //call init application after splash screen
        // this.apiInstance.Branding.displaySplashScreen(function(){
        //     APP.initApplication();
        // });
    },
    recursiveCounter:function(obj){
        var j = 0;
        if(obj.children){
            for (j = obj.children.length - 1; j >= 0; j--) {
                this.childsCounter ++;
                this.recursiveCounter(obj.children[j]);
            }
        }
        else if(obj.childs){
            for (j = obj.childs.length - 1; j >= 0; j--) {
                this.childsCounter ++;
                this.recursiveCounter(obj.childs[j]);
            }
        }else{
            return;
        }
    },
    build:function(){
        this._super();
        // alert('build');
        this.cookieManager = new CookieManager();
        // alert('build2');
        this.appModel = new AppModel();
        this.initApplication();
        // alert('build3');
    },
    initApplication:function(){
        console.log(this.stage);
        if(!this.background){
            this.background = new PIXI.Graphics();
            this.background.beginFill(APP.backColor);
            this.background.drawRect(0,0,windowWidth, windowHeight);
            this.stage.addChild(this.background);
        }else{
            this.stage.addChild(this.background);

        }

        if(!this.interactiveBackground){
            this.interactiveBackground = new InteractiveBackground(this);
            this.interactiveBackground.build();
            this.stage.addChild(this.interactiveBackground.getContent());
        }else{
            this.stage.addChild(this.interactiveBackground.getContent());
        }
        this.stage.setChildIndex(this.background,0);
        this.stage.setChildIndex(this.interactiveBackground.getContent(),1);
        // this.initScreen = new InitScreen('Init');
        // this.choiceScreen = new ChoiceScreen('Choice');
        this.loadScreen = new LoadScreen('Loader');
        this.levelsScreen = new LevelsScreen('Levels');
        this.gameScreen = new GameScreen('Game');
        this.screenManager.addScreen(this.loadScreen);
        this.screenManager.addScreen(this.levelsScreen);
        this.screenManager.addScreen(this.gameScreen);
        // this.screenManager.change('Loader');
        this.screenManager.change('Levels');
    },
    show:function(){
    },
    hide:function(){
    },
    destroy:function(){
    }
});