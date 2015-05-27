/*! jefframos 27-05-2015 */
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var h, s, max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
    if (max === min) h = s = 0; else {
        var d = max - min;
        switch (s = l > .5 ? d / (2 - max - min) : d / (max + min), max) {
          case r:
            h = (g - b) / d + (b > g ? 6 : 0);
            break;

          case g:
            h = (b - r) / d + 2;
            break;

          case b:
            h = (r - g) / d + 4;
        }
        h /= 6;
    }
    return {
        h: h,
        s: s,
        l: l
    };
}

function hslToRgb(h, s, l) {
    function hue2rgb(p, q, t) {
        return 0 > t && (t += 1), t > 1 && (t -= 1), 1 / 6 > t ? p + 6 * (q - p) * t : .5 > t ? q : 2 / 3 > t ? p + (q - p) * (2 / 3 - t) * 6 : p;
    }
    var r, g, b;
    if (0 === s) r = g = b = l; else {
        var q = .5 > l ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3), g = hue2rgb(p, q, h), b = hue2rgb(p, q, h - 1 / 3);
    }
    return {
        r: Math.round(255 * r),
        g: Math.round(255 * g),
        b: Math.round(255 * b)
    };
}

function toHex(n) {
    return n = parseInt(n, 10), isNaN(n) ? "00" : (n = Math.max(0, Math.min(n, 255)), 
    "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16));
}

function rgbToHex(R, G, B) {
    return parseInt("0x" + toHex(R) + toHex(G) + toHex(B));
}

function hexToRgb(hex) {
    var r = hex >> 16, g = hex >> 8 & 255, b = 255 & hex;
    return {
        r: r,
        g: g,
        b: b
    };
}

function addHue(color, value) {
    var rgb = hexToRgb(color), hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return hsl.s *= value, hsl.h > 1 && (hsl.h = 1), hsl.h < 0 && (hsl.h = 0), rgb = hslToRgb(hsl.h, hsl.s, hsl.l), 
    rgbToHex(rgb.r, rgb.g, rgb.b);
}

function setSaturation(color, value) {
    var rgb = hexToRgb(color), hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return hsl.s = value, rgb = hslToRgb(hsl.h, hsl.s, hsl.l), rgbToHex(rgb.r, rgb.g, rgb.b);
}

function addSaturation(color, value) {
    var rgb = hexToRgb(color), hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return hsl.s *= value, hsl.s > 1 && (hsl.s = 0), hsl.s < 0 && (hsl.s = 1), rgb = hslToRgb(hsl.h, hsl.s, hsl.l), 
    rgbToHex(rgb.r, rgb.g, rgb.b);
}

function addBright(color, value) {
    var rgb = hexToRgb(color), hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return hsl.l *= value, hsl.l > 1 && (hsl.l = 1), hsl.l < 0 && (hsl.l = 0), rgb = hslToRgb(hsl.h, hsl.s, hsl.l), 
    rgbToHex(rgb.r, rgb.g, rgb.b);
}

function pointDistance(x, y, x0, y0) {
    return Math.sqrt((x -= x0) * x + (y -= y0) * y);
}

function degreesToRadians(deg) {
    return deg * (Math.PI / 180);
}

function radiansToDegrees(rad) {
    return rad / (Math.PI / 180);
}

function scaleConverter(current, max, _scale, object) {
    var scale = max * _scale / current;
    return object ? (object.scale ? object.scale.x = object.scale.y = scale : object.getContent() && object.getContent().scale && (object.getContent().scale.x = object.getContent().scale.y = scale), 
    scale) : scale;
}

function shuffle(array) {
    for (var temp, index, counter = array.length; counter > 0; ) index = Math.floor(Math.random() * counter), 
    counter--, temp = array[counter], array[counter] = array[index], array[index] = temp;
    return array;
}

function testMobile() {
    return Modernizr.touch;
}

function isPortait() {
    return window.innerHeight > window.innerWidth;
}

function possibleFullscreen() {
    var elem = gameView;
    return elem.requestFullscreen || elem.msRequestFullscreen || elem.mozRequestFullScreen || elem.webkitRequestFullscreen;
}

function updateResolution(orientation, scale) {
    "portait" === orientation ? screen.height > screen.width ? (windowWidth = screen.width * scale, 
    windowWidthVar = screen.width, windowHeight = screen.height * scale, windowHeightVar = screen.height, 
    windowHeight = window.outerHeight * scale, windowHeightVar = window.outerHeight * scale) : (windowWidth = screen.height * scale, 
    windowHeight = screen.width * scale, windowWidthVar = screen.height, windowHeightVar = screen.width) : screen.height < screen.width ? (windowWidth = screen.width * scale, 
    windowHeight = screen.height * scale, windowWidthVar = screen.width, windowHeightVar = screen.height) : (windowWidth = screen.height * scale, 
    windowHeight = screen.width * scale, windowWidthVar = screen.height, windowHeightVar = screen.width), 
    realWindowWidth = windowWidth, realWindowHeight = windowHeight;
}

function update() {
    if (requestAnimFrame(update), !init) {
        var gambs = 0;
        isCordova && (gambs = device.platform.toLowerCase().indexOf("win") > -1 ? 50 : 0), 
        windowWidth = res.x, windowHeight = res.y - gambs, realWindowWidth = res.x, realWindowHeight = res.y, 
        renderer = testMobile() ? PIXI.autoDetectRecommendedRenderer(realWindowWidth, realWindowHeight, {
            antialias: !0,
            resolution: retina,
            view: gameView
        }) : PIXI.autoDetectRenderer(realWindowWidth, realWindowHeight, {
            antialias: !0,
            resolution: retina,
            view: gameView
        }), retina = 2, renderer.view.style.width = windowWidthVar + "px", renderer.view.style.height = windowHeightVar + gambs / 2 + "px", 
        APP = new Application(), APP.build(), APP.show(), init = !0;
    }
    renderer && (APP.update(), renderer.render(APP.stage));
}

function fullscreen() {
    if (!isfull) {
        var elem = gameView;
        elem.requestFullscreen ? elem.requestFullscreen() : elem.msRequestFullscreen ? elem.msRequestFullscreen() : elem.mozRequestFullScreen ? elem.mozRequestFullScreen() : elem.webkitRequestFullscreen && elem.webkitRequestFullscreen(), 
        updateResolution(screenOrientation, gameScale), isfull = !0;
    }
}

function registerAdEvents() {
    document.addEventListener("onReceiveAd", function() {
        alert("onReceiveAd");
    }), document.addEventListener("onFailedToReceiveAd", function(data) {
        alert(JSON.stringify(data));
    }), document.addEventListener("onPresentAd", function() {
        alert("onPresentAd");
    }), document.addEventListener("onDismissAd", function() {
        alert("onDismissAd");
    }), document.addEventListener("onLeaveToAd", function() {
        alert("onLeaveToAd");
    }), document.addEventListener("onReceiveInterstitialAd", function() {
        alert("onReceiveInterstitialAd");
    }), document.addEventListener("onPresentInterstitialAd", function() {
        alert("onPresentInterstitialAd");
    }), document.addEventListener("onDismissInterstitialAd", function() {
        alert("onDismissInterstitialAd");
    });
}

function deviceReady() {
    initialize();
}

var Application = AbstractApplication.extend({
    init: function() {
        function initialize() {
            self._super(windowWidth, windowHeight), self.stage.setBackgroundColor(self.backColor), 
            self.stage.removeChild(self.loadText), self.labelDebug = new PIXI.Text("", {
                font: "15px Arial"
            }), self.labelDebug.position.y = windowHeight - 20, self.labelDebug.position.x = 20, 
            self.initialized = !0, self.audioController = new AudioController(), self.withAPI = !1, 
            "#withoutAPI" === window.location.hash && (self.withAPI = !1);
        }
        var self = this;
        this.vecColors = [ 16743382, 16735338, 16746088, 16563797, 5563861, 2783487, 9586937, 14111213, 9682753 ], 
        this.vecColorsS = [ "#FF7BD6", "#FF5C6A", "#FF8668", "#FCBE55", "#54E5D5", "#2A78FF", "#9248F9", "#D751ED", "#93BF41" ], 
        this.vecPerfects = [ "PERFECT!", "AWESOME!", "AMAZING!", "GOD!!!", "WOWOWOW", "YEAH!" ], 
        this.vecGood = [ "GOOD", "COOL", "YEP", "NOT BAD" ], this.vecError = [ "NOOOO!", "BAD", "MISS!", "NOT", "AHHHH" ], 
        this.currentColorID = Math.floor(this.vecColors.length * Math.random()), this.backColor = this.vecColors[this.currentColorID], 
        this.currentWorld = this.currentLevel = 0, initialize(), this.mute = !1;
    },
    update: function() {
        this.initialized && (this._super(), this.interactiveBackground && this.interactiveBackground.update(), 
        this.withAPI && this.apiLogo && this.apiLogo.getContent().height > 1 && 0 === this.apiLogo.getContent().position.x && (scaleConverter(this.apiLogo.getContent().width, windowWidth, .5, this.apiLogo), 
        this.apiLogo.getContent().position.x = windowWidth / 2 - this.apiLogo.getContent().width / 2), 
        this.screenManager && this.screenManager.currentScreen && this.labelDebug && this.labelDebug.parent && (this.childsCounter = 1, 
        this.recursiveCounter(this.screenManager.currentScreen), this.labelDebug.setText(this.childsCounter)));
    },
    apiLoaded: function(apiInstance) {
        if (this.withAPI) {
            this.apiInstance = apiInstance;
            var logoData = apiInstance.Branding.getLogo();
            this.apiLogo = new DefaultButton(logoData.image, logoData.image), this.apiLogo.build(), 
            this.apiLogo.clickCallback = function() {
                logoData.action();
            }, this.stage.addChild(this.apiLogo.getContent()), this.buttonProperties = apiInstance.Branding.getLink("more_games");
        }
    },
    recursiveCounter: function(obj) {
        var j = 0;
        if (obj.children) for (j = obj.children.length - 1; j >= 0; j--) this.childsCounter++, 
        this.recursiveCounter(obj.children[j]); else {
            if (!obj.childs) return;
            for (j = obj.childs.length - 1; j >= 0; j--) this.childsCounter++, this.recursiveCounter(obj.childs[j]);
        }
    },
    build: function() {
        this._super(), this.cookieManager = new CookieManager(), this.appModel = new AppModel(), 
        this.initApplication();
    },
    initApplication: function() {
        console.log(this.stage), this.background ? this.stage.addChild(this.background) : (this.background = new PIXI.Graphics(), 
        this.background.beginFill(APP.backColor), this.background.drawRect(0, 0, windowWidth, windowHeight), 
        this.stage.addChild(this.background)), this.interactiveBackground ? this.stage.addChild(this.interactiveBackground.getContent()) : (this.interactiveBackground = new InteractiveBackground(this), 
        this.interactiveBackground.build(), this.stage.addChild(this.interactiveBackground.getContent())), 
        this.stage.setChildIndex(this.background, 0), this.stage.setChildIndex(this.interactiveBackground.getContent(), 1), 
        this.loadScreen = new LoadScreen("Loader"), this.levelsScreen = new LevelsScreen("Levels"), 
        this.gameScreen = new GameScreen("Game"), this.screenManager.addScreen(this.loadScreen), 
        this.screenManager.addScreen(this.levelsScreen), this.screenManager.addScreen(this.gameScreen), 
        this.screenManager.change("Levels");
    },
    show: function() {},
    hide: function() {},
    destroy: function() {}
}), BarView = Class.extend({
    init: function(width, height, maxValue, currentValue) {
        this.maxValue = maxValue, this.text = "default", this.currentValue = currentValue, 
        this.container = new PIXI.DisplayObjectContainer(), this.width = width, this.height = height, 
        this.backShape = new PIXI.Graphics(), this.backShape.beginFill(16711680), this.backShape.drawRect(0, 0, width, height), 
        this.container.addChild(this.backShape), this.frontShape = new PIXI.Graphics(), 
        this.frontShape.beginFill(65280), this.frontShape.drawRect(0, 0, width, height), 
        this.container.addChild(this.frontShape), this.frontShape.scale.x = this.currentValue / this.maxValue;
    },
    addBackShape: function(color, size) {
        this.back = new PIXI.Graphics(), this.back.beginFill(color), this.back.drawRect(-size / 2, -size / 2, this.width + size, this.height + size), 
        this.container.addChildAt(this.back, 0);
    },
    setFrontColor: function(color) {
        this.frontShape && this.container.removeChild(this.frontShape), this.frontShape = new PIXI.Graphics(), 
        this.frontShape.beginFill(color), this.frontShape.drawRect(0, 0, this.width, this.height), 
        this.container.addChild(this.frontShape);
    },
    setBackColor: function(color) {
        this.backShape && this.container.removeChild(this.backShape), this.backShape = new PIXI.Graphics(), 
        this.backShape.beginFill(color), this.backShape.drawRect(0, 0, this.width, this.height), 
        this.container.addChildAt(this.backShape, 0);
    },
    setText: function(text) {
        this.text !== text && (this.lifebar ? this.lifebar.setText(text) : (this.lifebar = new PIXI.Text(text, {
            fill: "white",
            align: "center",
            font: "10px Arial"
        }), this.container.addChild(this.lifebar)));
    },
    updateBar: function(currentValue, maxValue) {
        (this.currentValue !== currentValue || this.maxValue !== maxValue && currentValue >= 0) && (this.currentValue = currentValue, 
        this.maxValue = maxValue, this.frontShape.scale.x = this.currentValue / this.maxValue, 
        this.frontShape.scale.x < 0 && (this.frontShape.scale.x = 0));
    },
    getContent: function() {
        return this.container;
    },
    setPosition: function(x, y) {
        this.container.position.x = x, this.container.position.y = y;
    }
}), LifeBarHUD = Class.extend({
    init: function(width, height, incX, frontColor, baseColor) {
        this.text = "default", this.container = new PIXI.DisplayObjectContainer(), this.width = width, 
        this.height = height, this.incX = incX, this.backShape = new PIXI.Graphics();
        var w = width, xAcc = 0;
        this.rect = [ [ 0, 0 ], [ w, 0 ], [ w + xAcc, 0 ], [ xAcc, 0 ] ], this.frontRect = [ [ 0, 0 ], [ w, 0 ], [ w + xAcc, 0 ], [ xAcc, 0 ] ];
        var i = 0, acc = height, xAcc2 = incX;
        for (this.baseRect = [ this.rect[3], this.rect[2], [ this.rect[2][0] - xAcc2, this.rect[2][1] + acc ], [ this.rect[3][0] - xAcc2, this.rect[3][1] + acc ] ], 
        this.baseFrontRect = [ this.rect[3], this.rect[2], [ this.rect[2][0] - xAcc2, this.rect[2][1] + acc ], [ this.rect[3][0] - xAcc2, this.rect[3][1] + acc ] ], 
        this.backBaseShape = new PIXI.Graphics(), this.backBaseShape.beginFill(baseColor ? baseColor : 9837082), 
        this.backBaseShape.moveTo(this.baseRect[0][0], this.baseRect[0][1]), i = 1; i < this.baseRect.length; i++) this.backBaseShape.lineTo(this.baseRect[i][0], this.baseRect[i][1]);
        for (this.backBaseShape.endFill(), this.container.addChild(this.backBaseShape), 
        this.backFrontShape = new PIXI.Graphics(), this.backFrontShape.beginFill(frontColor ? frontColor : 3192624), 
        this.backFrontShape.moveTo(this.baseFrontRect[0][0], this.baseFrontRect[0][1]), 
        i = 1; i < this.baseFrontRect.length; i++) this.backFrontShape.lineTo(this.baseFrontRect[i][0], this.baseFrontRect[i][1]);
        for (this.backFrontShape.endFill(), this.container.addChild(this.backFrontShape), 
        this.backMask = new PIXI.Graphics(), this.backMask.beginFill(255), this.backMask.moveTo(this.baseRect[0][0], this.baseRect[0][1]), 
        i = 1; i < this.baseRect.length; i++) this.backMask.lineTo(this.baseRect[i][0], this.baseRect[i][1]);
        this.backMask.endFill(), this.container.addChild(this.backMask), this.backFrontShape.mask = this.backMask;
    },
    setBackColor: function(color) {
        var acc = this.height, xAcc2 = this.incX;
        for (this.baseRect = [ this.rect[3], this.rect[2], [ this.rect[2][0] - xAcc2, this.rect[2][1] + acc ], [ this.rect[3][0] - xAcc2, this.rect[3][1] + acc ] ], 
        this.baseFrontRect = [ this.rect[3], this.rect[2], [ this.rect[2][0] - xAcc2, this.rect[2][1] + acc ], [ this.rect[3][0] - xAcc2, this.rect[3][1] + acc ] ], 
        this.backBaseShape.clear(), this.backBaseShape.beginFill(color), this.backBaseShape.moveTo(this.baseRect[0][0], this.baseRect[0][1]), 
        i = 1; i < this.baseRect.length; i++) this.backBaseShape.lineTo(this.baseRect[i][0], this.baseRect[i][1]);
        this.backBaseShape.endFill();
    },
    setText: function(text) {
        this.text !== text && (this.lifebar ? this.lifebar.setText(text) : this.lifebar = new PIXI.Text(text, {
            fill: "white",
            align: "center",
            font: "10px Arial"
        }));
    },
    updateBar: function(currentValue, maxValue) {
        return this.currentValue < 0 ? void (this.backFrontShape.position.x = this.backFrontShape.position.width) : (this.currentValue = currentValue, 
        this.maxValue = maxValue, void (this.backFrontShape.position.x = this.backFrontShape.width * (this.currentValue / this.maxValue) - this.backFrontShape.width));
    },
    getContent: function() {
        return this.container;
    },
    setPosition: function(x, y) {
        this.container.position.x = x, this.container.position.y = y;
    }
}), AudioController = Class.extend({
    init: function() {
        function end() {
            self.updateAudioList(this);
        }
        function load() {
            self.currentLoaded++, self.currentLoaded >= self.audioList.length && (self.loadedAudioComplete = !0, 
            self.onCompleteCallback && self.onCompleteCallback());
        }
        this.audioList = [ {
            label: "loop",
            urls: [ "audio/loop.mp3" ],
            volume: .1,
            loop: !0
        }, {
            label: "wub",
            urls: [ "audio/wub.mp3" ],
            volume: .2,
            loop: !1
        }, {
            label: "error",
            urls: [ "audio/error.mp3" ],
            volume: .5,
            loop: !1
        }, {
            label: "laser1",
            urls: [ "audio/laser1.mp3" ],
            volume: .05,
            loop: !1
        }, {
            label: "laser2",
            urls: [ "audio/laser2.mp3" ],
            volume: .05,
            loop: !1
        }, {
            label: "laser3",
            urls: [ "audio/laser3.mp3" ],
            volume: .05,
            loop: !1
        }, {
            label: "laser4",
            urls: [ "audio/laser4.mp3" ],
            volume: .05,
            loop: !1
        }, {
            label: "fall",
            urls: [ "audio/fall.mp3" ],
            volume: .3,
            loop: !1
        }, {
            label: "explode1",
            urls: [ "audio/explode1.mp3" ],
            volume: .15,
            loop: !1
        }, {
            label: "play",
            urls: [ "audio/play.mp3" ],
            volume: .6,
            loop: !1
        }, {
            label: "perfect",
            urls: [ "audio/perfect.mp3" ],
            volume: .1,
            loop: !1
        } ], this.onCompleteCallback = null, this.loadedAudioComplete = !1, this.audios = [];
        for (var self = this, i = this.audioList.length - 1; i >= 0; i--) {
            var tempObj = {
                label: this.audioList[i].label,
                audio: new Howl({
                    urls: this.audioList[i].urls,
                    volume: this.audioList[i].volume,
                    loop: this.audioList[i].loop,
                    onend: end,
                    onload: load
                })
            };
            this.audioList[i].loop || (tempObj.audio.onend = end), this.audios.push(tempObj);
        }
        this.currentLoaded = 0, this.playingAudios = [], this.ambientLabel = "";
    },
    updateAudioList: function(target) {
        if (this.ambientPlaying === target) return void this.playSound(this.ambientLabel);
        for (var j = this.playingAudios.length - 1; j >= 0; j--) this.playingAudios[j] === target && this.playingAudios.splice(j, 1);
    },
    playSound: function(id) {
        for (var audioP = null, i = this.audios.length - 1; i >= 0; i--) this.audios[i].label === id && (audioP = this.audios[i].audio, 
        audioP.play(), this.playingAudios.push(audioP));
        return audioP;
    },
    stopSound: function(id) {
        for (var audioP = null, i = this.audios.length - 1; i >= 0; i--) if (this.audios[i].label === id) {
            audioP = this.audios[i].audio, audioP.stop();
            for (var j = this.playingAudios.length - 1; j >= 0; j--) this.playingAudios[j] === audioP && this.playingAudios.splice(j, 1);
        }
        return audioP;
    },
    playAmbientSound: function(id) {
        this.ambientLabel !== id && (this.ambientPlaying && this.stopSound(this.ambientLabel), 
        this.ambientLabel = id, this.ambientPlaying = this.playSound(id));
    }
}), Ball = Entity.extend({
    init: function(vel, screen) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.screen = screen, 
        this.range = 80, this.width = 1, this.height = 1, this.type = "player", this.target = "enemy", 
        this.fireType = "physical", this.node = null, this.velocity.x = vel.x, this.velocity.y = vel.y, 
        this.power = 1;
    },
    startScaleTween: function() {
        TweenLite.from(this.getContent().scale, .3, {
            x: 0,
            y: 0,
            ease: "easeOutBack"
        });
    },
    build: function() {
        this.color = 16777215, this.spriteBall = new PIXI.Graphics(), this.spriteBall.beginFill(this.color), 
        this.maxSize = .4 * APP.tileSize.w, this.spriteBall.drawCircle(0, 0, this.maxSize), 
        this.width = this.spriteBall.width, this.height = this.spriteBall.height, this.heart = new PIXI.Graphics(), 
        this.heart.beginFill(16777215), this.heart.drawCircle(0, 0, 3), this.heart.alpha = .5, 
        this.sprite = new PIXI.Sprite(), this.sprite.addChild(this.spriteBall), this.sprite.addChild(this.heart), 
        this.spriteBall.position.y = this.spriteBall.height / 2, this.range = this.spriteBall.height / 2, 
        this.sprite.anchor.x = .5, this.sprite.anchor.y = .5, this.updateable = !0, this.collidable = !0, 
        this.getContent().alpha = .1, TweenLite.to(this.getContent(), .3, {
            alpha: 1
        }), this.collideArea = new PIXI.Rectangle(50, 50, windowWidth - 100, windowHeight - 100), 
        this.particlesCounterMax = 50, this.particlesCounter = 1, this.floorPos = windowHeight, 
        this.gravity = 0, this.gravityVal = .15, this.breakJump = !1, this.blockCollide = !1, 
        this.inError = !1, this.perfectShoot = 0, this.perfectShootAcum = 0, this.force = 0, 
        this.inJump = !1, this.standardVelocity = APP.standardVel, this.friction = this.spriteBall.width / 3, 
        this.blockCollide2 = !1, this.moveAccum = 0, this.moveAccumMax = 7;
    },
    returnCollide: function(half) {
        this.blockMove = !0;
        var multiplyer = 1;
        half && (multiplyer = .2);
        var tempPos = {
            x: this.getPosition().x,
            y: this.getPosition().y
        };
        "UP" === this.currentSide ? tempPos.y += this.spriteBall.height * multiplyer / 2 : "DOWN" === this.currentSide ? tempPos.y -= this.spriteBall.height * multiplyer / 2 : "LEFT" === this.currentSide ? tempPos.x += this.spriteBall.width * multiplyer / 2 : "RIGHT" === this.currentSide && (tempPos.x -= this.spriteBall.width * multiplyer / 2);
        var self = this;
        return TweenLite.to(this.getPosition(), .1, {
            x: tempPos.x,
            y: tempPos.y,
            onComplete: function() {
                self.blockMove = !1;
            }
        }), this.explode2(), tempPos;
    },
    returnCollide2: function(half) {
        console.log("returnCollide2"), this.blockCollide2 = !0;
        var tempPos = {
            x: this.getPosition().x,
            y: this.getPosition().y
        };
        tempPos.y -= this.velocity.y / 2, tempPos.x -= this.velocity.x / 2;
        var self = this;
        return TweenLite.to(this.getPosition(), .1, {
            x: tempPos.x,
            y: tempPos.y,
            onComplete: function() {
                self.blockCollide2 = !1;
            }
        }), this.explode2(), tempPos;
    },
    moveBack: function(side) {
        console.log("moveBack"), this.currentSide = "", "UP" === side ? this.velocity.y = 3 * this.standardVelocity : "DOWN" === side ? this.velocity.y = 3 * -this.standardVelocity : "LEFT" === side ? this.velocity.x = 3 * this.standardVelocity : "RIGHT" === side && (this.velocity.x = 3 * -this.standardVelocity);
    },
    stretch: function(side) {
        if (!this.kill && (this.moveAccum = this.moveAccumMax, this.currentSide !== side)) {
            var tempVel = 2 * this.standardVelocity;
            this.currentSide = side, "UP" === this.currentSide ? (this.velocity.x = 0, this.velocity.y = -tempVel) : "DOWN" === this.currentSide ? (this.velocity.x = 0, 
            this.velocity.y = tempVel) : "LEFT" === this.currentSide ? (this.velocity.x = -tempVel, 
            this.velocity.y = 0) : (this.velocity.x = tempVel, this.velocity.y = 0), this.screen.addTrail();
        }
    },
    stopReturn: function() {
        this.getPosition().x -= this.velocity.x, this.getPosition().x -= this.velocity.y;
    },
    stop: function() {
        this.velocity = {
            x: 0,
            y: 0
        }, this.currentSide = "";
    },
    applyFriction: function() {
        this.velocity.x > this.standardVelocity + this.friction ? (this.velocity.x -= this.friction, 
        this.velocity.x > this.standardVelocity && (this.velocity.x = this.standardVelocity)) : this.velocity.x < -(this.standardVelocity + this.friction) ? (this.velocity.x += this.friction, 
        this.velocity.x < this.standardVelocity && (this.velocity.x = -this.standardVelocity)) : this.velocity.y > this.standardVelocity + this.friction ? (this.velocity.y -= this.friction, 
        this.velocity.y > this.standardVelocity && (this.velocity.y = this.standardVelocity)) : this.velocity.y < -(this.standardVelocity + this.friction) && (this.velocity.y += this.friction, 
        this.velocity.y < this.standardVelocity && (this.velocity.y = -this.standardVelocity));
    },
    update: function() {
        this.moveAccum > 0 && this.moveAccum--, this.updateableParticles(), this.range = this.spriteBall.height / 2, 
        this._super(), this.layer.collideChilds(this), this.heartParticle && (this.heartParticle.kill && this.heartParticle.getContent().parent ? this.heartParticle.getContent().parent.removeChild(this.heartParticle.getContent()) : this.heartParticle.update());
    },
    updateableParticles: function() {
        if (this.particlesCounter--, this.particlesCounter <= 0) {
            this.particlesCounter = this.particlesCounterMax;
            var tempPart = new PIXI.Graphics();
            tempPart.beginFill(16777215), tempPart.drawCircle(0, 0, this.spriteBall.width), 
            this.heartParticle = new Particles({
                x: 0,
                y: 0
            }, 120, tempPart, .05 * Math.random()), this.heartParticle.initScale = 0, this.heartParticle.build(), 
            this.heartParticle.getContent().alpha = .5, this.heartParticle.gravity = 0, this.heartParticle.alphadecress = .02, 
            this.heartParticle.scaledecress = .02, this.heartParticle.setPosition(0, 0), this.sprite.addChild(this.heartParticle.getContent());
        }
    },
    collide: function(arrayCollide) {
        if (this.collidable) for (var i = arrayCollide.length - 1; i >= 0; i--) if ("enemy" === arrayCollide[i].type) {
            var enemy = arrayCollide[i];
            this.screen.gameOver(), enemy.preKill();
        } else if ("portal" === arrayCollide[i].type) this.screen.nextLevel(), arrayCollide[i].preKill(), 
        arrayCollide[i].collidable = !1; else if ("coin" === arrayCollide[i].type) {
            arrayCollide[i].preKill(), this.blockCollide = !0;
            var value = 1 + this.perfectShootAcum;
            APP.points += value, APP.audioController.playSound("explode1");
            var rot = .005 * Math.random(), tempLabel = new PIXI.Text("+" + value, {
                font: "50px Vagron",
                fill: "#13c2b6"
            }), labelCoin = new Particles({
                x: 0,
                y: 0
            }, 120, tempLabel, rot);
            labelCoin.maxScale = this.getContent().scale.x, labelCoin.build(), labelCoin.gravity = -.2, 
            labelCoin.alphadecress = .01, labelCoin.scaledecress = .05, labelCoin.setPosition(this.getPosition().x - tempLabel.width / 2, this.getPosition().y), 
            this.screen.HUDLayer.addChild(labelCoin);
            var labelCoin2 = new Particles({
                x: 0,
                y: 0
            }, 120, new PIXI.Text("+" + value, {
                font: "50px Vagron",
                fill: "#9d47e0"
            }), -rot);
            labelCoin2.maxScale = this.getContent().scale.x, labelCoin2.build(), labelCoin2.gravity = -.2, 
            labelCoin2.alphadecress = .01, labelCoin2.scaledecress = .05, labelCoin2.setPosition(this.getPosition().x - tempLabel.width / 2 + 2, this.getPosition().y + 2), 
            this.screen.HUDLayer.addChild(labelCoin2), this.screen.getCoin();
        }
    },
    setColor: function(color) {
        this.color = color, this.spriteBall.clear(), this.spriteBall.beginFill(color), this.spriteBall.drawCircle(0, -this.maxSize, this.maxSize);
    },
    charge: function(force) {
        var angle = degreesToRadians(360 * Math.random()), dist = .9 * this.spriteBall.height, pPos = {
            x: dist * Math.sin(angle) + this.getContent().position.x,
            y: dist * Math.cos(angle) + this.getContent().position.y
        }, vector = Math.atan2(this.getPosition().x - pPos.x, this.getPosition().y - pPos.y), vel = 2, vecVel = {
            x: Math.sin(vector) * vel,
            y: Math.cos(vector) * vel
        }, tempPart = new PIXI.Graphics();
        tempPart.beginFill(this.color), tempPart.drawCircle(0, 0, .05 * windowHeight);
        var particle = new Particles(vecVel, 800, tempPart, 0);
        particle.initScale = this.getContent().scale.x / 10, particle.maxScale = this.getContent().scale.x / 3, 
        particle.build(), particle.gravity = 0, particle.scaledecress = -.01, particle.setPosition(pPos.x, pPos.y - this.spriteBall.height / 2), 
        this.layer.addChild(particle), particle.getContent().parent.setChildIndex(particle.getContent(), 0);
    },
    explode: function() {
        tempParticle = new PIXI.Graphics(), tempParticle.beginFill(this.color), tempParticle.drawCircle(0, 0, this.spriteBall.width), 
        particle = new Particles({
            x: 0,
            y: 0
        }, 600, tempParticle, 0), particle.maxScale = 5 * this.getContent().scale.x, particle.maxInitScale = 1, 
        particle.build(), particle.alphadecress = .08, particle.scaledecress = .1, particle.setPosition(this.getPosition().x, this.getPosition().y), 
        this.layer.addChild(particle);
    },
    explode2: function() {
        console.log("explode2"), tempParticle = new PIXI.Graphics(), tempParticle.beginFill(this.color), 
        tempParticle.drawCircle(0, 0, this.spriteBall.width), particle = new Particles({
            x: 0,
            y: 0
        }, 600, tempParticle, 0), particle.maxScale = 5 * this.getContent().scale.x, particle.maxInitScale = 1, 
        particle.build(), particle.alphadecress = .05, particle.scaledecress = .1, particle.setPosition(this.getPosition().x, this.getPosition().y), 
        this.layer.addChild(particle);
    },
    preKill: function() {
        if (!this.invencible) {
            this.spriteBall.alpha = 0, APP.audioController.playSound("explode1"), this.collidable = !1, 
            this.kill = !0;
            for (var i = 6; i >= 0; i--) tempParticle = new PIXI.Graphics(), tempParticle.beginFill(this.color), 
            tempParticle.drawCircle(0, 0, .2 * this.spriteBall.width), particle = new Particles({
                x: 10 * Math.random() - 5,
                y: 10 * Math.random() - 5
            }, 600, tempParticle, .05 * Math.random()), particle.build(), particle.alphadecress = .008, 
            particle.setPosition(this.getPosition().x - (Math.random() + .4 * this.getContent().width) + .2 * this.getContent().width, this.getPosition().y - (Math.random() + .4 * this.getContent().width) + .2 * this.getContent().width), 
            this.layer.addChild(particle);
            this.explode2();
        }
    }
}), Coin = Entity.extend({
    init: function(screen) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = 1, this.width = 1, 
        this.height = 1, this.type = "coin", this.screen = screen;
    },
    build: function() {
        this.spriteBall = new PIXI.Graphics(), this.spriteBall.beginFill(16777215);
        var size = .4 * APP.tileSize.w;
        this.spriteBall.drawRect(-size / 2, -size / 2, size, size), this.sprite = new PIXI.Sprite(), 
        this.sprite.addChild(this.spriteBall), this.sprite.anchor.x = .5, this.sprite.anchor.y = .5, 
        this.updateable = !0, this.collidable = !0, this.getContent().alpha = .5, TweenLite.to(this.getContent(), .3, {
            alpha: 1
        }), this.collideArea = new PIXI.Rectangle(-50, -50, windowWidth + 100, windowHeight + 100), 
        this.particlesCounterMax = 8, this.particlesCounter = 1, this.sprite.rotation = Math.random();
    },
    update: function() {
        this.sprite.rotation += .01, this.range = this.spriteBall.width / 2, this._super();
    },
    changeShape: function() {},
    explode: function(velX, velY) {
        var particle = null, tempParticle = null;
        this.size = 8;
        for (var i = 10; i >= 0; i--) tempParticle = new PIXI.Graphics(), tempParticle.beginFill(16777215), 
        tempParticle.drawRect(-this.size / 2, -this.size / 2, this.size, this.size), particle = new Particles({
            x: 10 * Math.random() - 5 + (velX ? velX : 0),
            y: 10 * Math.random() - 5 + (velY ? velY : 0)
        }, 600, tempParticle, .05 * Math.random()), particle.build(), particle.alphadecress = .008, 
        particle.setPosition(this.getPosition().x - (Math.random() + .4 * this.getContent().width) + .2 * this.getContent().width, this.getPosition().y - (Math.random() + .4 * this.getContent().width) + .2 * this.getContent().width), 
        this.layer.addChild(particle);
        tempParticle = new PIXI.Graphics(), this.size = .05 * windowHeight, tempParticle.beginFill(16777215), 
        tempParticle.drawRect(-this.size / 2, -this.size / 2, this.size, this.size), particle = new Particles({
            x: 0,
            y: 0
        }, 600, tempParticle, 0), particle.maxScale = 5 * this.getContent().scale.x, particle.maxInitScale = 1, 
        particle.build(), particle.alphadecress = .05, particle.scaledecress = .1, particle.setPosition(this.getPosition().x, this.getPosition().y), 
        this.layer.addChild(particle);
    },
    preKill: function() {
        this.invencible || (this.explode(-2, 2), this.collidable = !1, this.kill = !0);
    }
}), CrazyLogo = Entity.extend({
    init: function(screen) {
        this._super(!0), this.screen = screen, this.container = new PIXI.DisplayObjectContainer(), 
        this.title = "XPLODE", this.vecLetters = [], this.tempCounter = 0, this.colorsCounter = 300, 
        this.interval = 0;
    },
    build: function() {
        this.updateable = !0;
        for (var before = 0, i = 1; i <= this.title.length; i++) tempText = new PIXI.Text(this.title[i - 1], {
            align: "center",
            font: "48px Vagron",
            fill: APP.vecColorsS[this.tempCounter],
            stroke: "#FFFFFF",
            strokeThickness: 5
        }), console.log(this.title[i - 1], tempText.width), tempText.resolution = 2, tempText.sin = .5 * i, 
        tempText.position.x = this.container.width + before / 4, tempText.position.y = 50 * Math.sin(tempText.sin), 
        console.log(tempText.position.y), this.container.addChild(tempText), before = tempText.width, 
        this.vecLetters.push(tempText), this.tempCounter++, this.tempCounter >= APP.vecColorsS.length && (this.tempCounter = 0);
        var self = this;
        clearInterval(this.interval), this.interval = setInterval(function() {
            self.screen.changeColor(!1, !1, !0);
        }, 1e3);
    },
    removeInterval: function() {
        clearInterval(this.interval);
    },
    getContent: function() {
        return this.container;
    },
    update: function() {
        if (this.updateable) {
            var changeColors = !1;
            this.colorsCounter--, this.colorsCounter < 0 && (changeColors = !0, this.colorsCounter = 200);
            for (var i = 0; i < this.vecLetters.length; i++) this.vecLetters[i].position.y = 50 * Math.sin(this.vecLetters[i].sin += .2), 
            (changeColors || Math.random() < .05) && (this.tempCounter++, this.tempCounter >= APP.vecColorsS.length && (this.tempCounter = 0), 
            this.vecLetters[i].setStyle({
                align: "center",
                font: "48px Vagron",
                fill: APP.vecColorsS[this.tempCounter],
                stroke: "#FFFFFF",
                strokeThickness: 5
            }));
        }
    }
}), EndPortal = Entity.extend({
    init: function(screen) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = 1, this.width = 1, 
        this.height = 1, this.type = "portal", this.screen = screen;
    },
    build: function() {
        this.spriteBall = new PIXI.Graphics(), this.spriteBall.lineStyle(1, 16777215);
        var size = .4 * APP.tileSize.w;
        this.spriteBall.drawRect(-size / 2, -size / 2, size, size), this.spriteBallBack = new PIXI.Graphics(), 
        this.spriteBallBack.beginFill(16777215), this.spriteBallBack.drawCircle(0, 0, APP.tileSize.w / 2), 
        this.spriteBallBack.alpha = .3, this.sprite = new PIXI.Sprite(), this.sprite.addChild(this.spriteBall), 
        this.sprite.addChild(this.spriteBallBack), this.updateable = !0, this.collidable = !0, 
        this.getContent().alpha = .5, TweenLite.to(this.getContent(), .3, {
            alpha: 1
        }), this.collideArea = new PIXI.Rectangle(-50, -50, windowWidth + 100, windowHeight + 100), 
        this.particlesCounterMax = 8, this.particlesCounter = 1, this.rot = 0, this.scale = 0;
    },
    update: function() {
        this.range = this.spriteBallBack.width / 2, this._super(), this.spriteBall.rotation = this.rot, 
        this.rot += .05, this.scale += .05, this.spriteBall.scale = {
            x: Math.sin(this.scale),
            y: Math.sin(this.scale)
        };
    },
    changeShape: function() {},
    explode: function(velX, velY) {
        var particle = null, tempParticle = null;
        this.size = 8;
        for (var i = 10; i >= 0; i--) tempParticle = new PIXI.Graphics(), tempParticle.beginFill(16777215), 
        tempParticle.drawRect(-this.size / 2, -this.size / 2, this.size, this.size), particle = new Particles({
            x: 10 * Math.random() - 5 + (velX ? velX : 0),
            y: 10 * Math.random() - 5 + (velY ? velY : 0)
        }, 600, tempParticle, .05 * Math.random()), particle.build(), particle.alphadecress = .008, 
        particle.setPosition(this.getPosition().x - (Math.random() + .4 * this.getContent().width) + .2 * this.getContent().width, this.getPosition().y - (Math.random() + .4 * this.getContent().width) + .2 * this.getContent().width), 
        this.layer.addChild(particle);
        tempParticle = new PIXI.Graphics(), this.size = .05 * windowHeight, tempParticle.beginFill(16777215), 
        tempParticle.drawRect(-this.size / 2, -this.size / 2, this.size, this.size), particle = new Particles({
            x: 0,
            y: 0
        }, 600, tempParticle, 0), particle.maxScale = 5 * this.getContent().scale.x, particle.maxInitScale = 1, 
        particle.build(), particle.alphadecress = .05, particle.scaledecress = .1, particle.setPosition(this.getPosition().x, this.getPosition().y), 
        this.layer.addChild(particle);
    },
    preKill: function() {
        this.invencible || (this.explode(-2, 2), this.collidable = !1, this.kill = !0);
    }
}), Enemy1 = Entity.extend({
    init: function(screen) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = 1, this.width = 1, 
        this.height = 1, this.type = "enemy", this.screen = screen, this.rot = 0;
    },
    build: function() {
        this.spriteBall = new PIXI.Graphics(), this.spriteBall.beginFill(addBright(APP.vecColors[APP.currentColorID], .5));
        var size = .4 * APP.tileSize.w;
        this.spriteBall.moveTo(0, 0);
        for (var sides = 12, i = 0; sides >= i; i++) {
            angle = degreesToRadians(360 / sides * i);
            var tempSize = i % 2 === 0 ? size : size / 2;
            0 >= i ? this.spriteBall.moveTo(Math.sin(angle) * tempSize, Math.cos(angle) * tempSize) : this.spriteBall.lineTo(Math.sin(angle) * tempSize, Math.cos(angle) * tempSize);
        }
        this.sprite = new PIXI.Sprite(), this.sprite.addChild(this.spriteBall), this.updateable = !0, 
        this.collidable = !0, this.getContent().alpha = .5, TweenLite.to(this.getContent(), .3, {
            alpha: 1
        }), this.collideArea = new PIXI.Rectangle(-50, -50, windowWidth + 100, windowHeight + 100), 
        this.particlesCounterMax = 8, this.particlesCounter = 1;
    },
    update: function() {
        this.range = this.spriteBall.width / 2, this._super(), this.rot += .08, this.spriteBall.rotation = this.rot;
    },
    changeShape: function() {},
    explode: function(velX, velY) {
        var particle = null, tempParticle = null;
        this.size = 8;
        for (var i = 10; i >= 0; i--) tempParticle = new PIXI.Graphics(), tempParticle.beginFill(16746632), 
        tempParticle.drawRect(-this.size / 2, -this.size / 2, this.size, this.size), particle = new Particles({
            x: 10 * Math.random() - 5 + (velX ? velX : 0),
            y: 10 * Math.random() - 5 + (velY ? velY : 0)
        }, 600, tempParticle, .05 * Math.random()), particle.build(), particle.alphadecress = .008, 
        particle.setPosition(this.getPosition().x - (Math.random() + .4 * this.getContent().width) + .2 * this.getContent().width, this.getPosition().y - (Math.random() + .4 * this.getContent().width) + .2 * this.getContent().width), 
        this.layer.addChild(particle);
        tempParticle = new PIXI.Graphics(), this.size = .05 * windowHeight, tempParticle.beginFill(16746632), 
        tempParticle.drawRect(-this.size / 2, -this.size / 2, this.size, this.size), particle = new Particles({
            x: 0,
            y: 0
        }, 600, tempParticle, 0), particle.maxScale = 5 * this.getContent().scale.x, particle.maxInitScale = 1, 
        particle.build(), particle.alphadecress = .05, particle.scaledecress = .1, particle.setPosition(this.getPosition().x, this.getPosition().y), 
        this.layer.addChild(particle);
    },
    preKill: function() {
        this.invencible || (this.explode(0, 0), this.collidable = !1, this.kill = !0);
    }
}), Enemy2 = Entity.extend({
    init: function(screen, id, loop) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = 1, this.width = 1, 
        this.height = 1, this.id = id, this.type = "enemy", this.screen = screen, this.loop = loop, 
        this.rot = 0, this.standardVelocity = 2;
    },
    setWaypoints: function(wayPoints) {
        this.wayPoints = wayPoints, this.targetWay = 1, this.setPosition(this.wayPoints[0].x, this.wayPoints[0].y), 
        this.testHorizontal(), this.testVertical();
    },
    build: function() {
        this.spriteBall = new PIXI.Graphics(), this.spriteBall.beginFill(addBright(APP.vecColors[APP.currentColorID], .5));
        var size = .4 * APP.tileSize.w;
        this.spriteBall.moveTo(0, 0);
        for (var sides = 14, i = 0; sides >= i; i++) {
            angle = degreesToRadians(360 / sides * i);
            var tempSize = i % 2 === 0 ? size : size / 2.5;
            0 >= i ? this.spriteBall.moveTo(Math.sin(angle) * tempSize, Math.cos(angle) * tempSize) : this.spriteBall.lineTo(Math.sin(angle) * tempSize, Math.cos(angle) * tempSize);
        }
        this.sprite = new PIXI.Sprite(), this.sprite.addChild(this.spriteBall), this.updateable = !0, 
        this.collidable = !0, this.getContent().alpha = .5, TweenLite.to(this.getContent(), .3, {
            alpha: 1
        }), this.collideArea = new PIXI.Rectangle(-50, -50, windowWidth + 100, windowHeight + 100), 
        this.particlesCounterMax = 8, this.particlesCounter = 1, this.indo = !0, this.collideAccum = 0;
    },
    testHorizontal: function() {
        this.getPosition().x < this.wayPoints[this.targetWay].x ? (this.velocity.x = this.standardVelocity, 
        this.velocity.y = 0, this.getPosition().y = this.wayPoints[this.targetWay].y) : this.getPosition().x > this.wayPoints[this.targetWay].x && (this.velocity.x = -this.standardVelocity, 
        this.velocity.y = 0, this.getPosition().y = this.wayPoints[this.targetWay].y);
    },
    testVertical: function() {
        this.getPosition().y < this.wayPoints[this.targetWay].y ? (this.velocity.y = this.standardVelocity, 
        this.velocity.x = 0, this.getPosition().x = this.wayPoints[this.targetWay].x) : this.getPosition().y > this.wayPoints[this.targetWay].y && (this.velocity.y = -this.standardVelocity, 
        this.velocity.x = 0, this.getPosition().x = this.wayPoints[this.targetWay].x);
    },
    update: function() {
        this.collideAccum <= 0 ? (pointDistance(this.getPosition().x, this.getPosition().y, this.wayPoints[this.targetWay].x, this.wayPoints[this.targetWay].y) < 2 * this.standardVelocity && (this.collideAccum = 10, 
        this.indo ? this.targetWay++ : this.targetWay--, this.loop ? this.targetWay >= this.wayPoints.length && (this.targetWay = 0) : this.targetWay >= this.wayPoints.length - 1 ? this.indo = !1 : this.targetWay < 1 && (this.indo = !0)), 
        pointDistance(this.getPosition().x, 0, this.wayPoints[this.targetWay].x, 0) > 2 * this.standardVelocity && this.testHorizontal(), 
        pointDistance(this.getPosition().y, 0, this.wayPoints[this.targetWay].y, 0) > 2 * this.standardVelocity && this.testVertical()) : this.collideAccum--, 
        this.range = this.spriteBall.width / 2, this._super(), this.rot += this.standardVelocity / 50, 
        this.spriteBall.rotation = this.rot;
    },
    changeShape: function() {},
    explode: function(velX, velY) {
        var particle = null, tempParticle = null;
        this.size = 8;
        for (var i = 10; i >= 0; i--) tempParticle = new PIXI.Graphics(), tempParticle.beginFill(16746632), 
        tempParticle.drawRect(-this.size / 2, -this.size / 2, this.size, this.size), particle = new Particles({
            x: 10 * Math.random() - 5 + (velX ? velX : 0),
            y: 10 * Math.random() - 5 + (velY ? velY : 0)
        }, 600, tempParticle, .05 * Math.random()), particle.build(), particle.alphadecress = .008, 
        particle.setPosition(this.getPosition().x - (Math.random() + .4 * this.getContent().width) + .2 * this.getContent().width, this.getPosition().y - (Math.random() + .4 * this.getContent().width) + .2 * this.getContent().width), 
        this.layer.addChild(particle);
        tempParticle = new PIXI.Graphics(), this.size = .05 * windowHeight, tempParticle.beginFill(16746632), 
        tempParticle.drawRect(-this.size / 2, -this.size / 2, this.size, this.size), particle = new Particles({
            x: 0,
            y: 0
        }, 600, tempParticle, 0), particle.maxScale = 5 * this.getContent().scale.x, particle.maxInitScale = 1, 
        particle.build(), particle.alphadecress = .05, particle.scaledecress = .1, particle.setPosition(this.getPosition().x, this.getPosition().y), 
        this.layer.addChild(particle);
    },
    preKill: function() {
        this.invencible || (this.explode(0, 0), this.collidable = !1, this.kill = !0);
    }
}), EnemyBall = Entity.extend({
    init: function(vel, behaviour) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = 80, this.width = 1, 
        this.height = 1, this.type = "enemy", this.node = null, this.velocity.x = vel.x, 
        this.velocity.y = vel.y, this.timeLive = 1e3, this.power = 1, this.defaultVelocity = 1, 
        this.behaviour = behaviour.clone(), this.imgSource = "burger.png", this.particleSource = "bullet.png";
    },
    startScaleTween: function() {
        TweenLite.from(this.getContent().scale, .3, {
            x: 0,
            y: 0,
            ease: "easeOutBack"
        });
    },
    build: function() {
        this.sprite = new PIXI.Sprite.fromFrame(this.imgSource), this.sprite.anchor.x = .5, 
        this.sprite.anchor.y = .5, this.updateable = !0, this.collidable = !0, this.getContent().alpha = .5, 
        TweenLite.to(this.getContent(), .3, {
            alpha: 1
        }), this.collideArea = new PIXI.Rectangle(-50, -50, windowWidth + 100, windowHeight + 100), 
        this.particlesCounterMax = 5, this.particlesCounter = 5;
    },
    update: function() {
        this.range = this.sprite.height / 4, this._super(), this.behaviour.update(this);
    },
    updateableParticles: function() {
        if (this.particlesCounter--, this.particlesCounter <= 0) {
            this.particlesCounter = this.particlesCounterMax;
            var particle = new Particles({
                x: 0,
                y: 0
            }, 120, this.particleSource, .05 * Math.random());
            particle.maxScale = this.getContent().scale.x, particle.maxInitScale = particle.maxScale, 
            particle.build(), particle.gravity = 0, particle.alphadecress = .08, particle.scaledecress = -.04, 
            particle.setPosition(this.getPosition().x - (Math.random() + .1 * this.getContent().width) / 2, this.getPosition().y), 
            this.layer.addChild(particle), particle.getContent().parent.setChildIndex(particle.getContent(), 0);
        }
    },
    preKill: function() {
        if (!this.invencible) {
            this.velocity = {
                x: 0,
                y: 0
            };
            var self = this;
            TweenLite.to(this.getContent().scale, .2, {
                x: .5,
                y: .5
            }), TweenLite.to(this.getContent(), .2, {
                alpha: 0,
                onComplete: function() {
                    self.kill = !0;
                }
            });
            for (var i = 6; i >= 0; i--) {
                var particle = new Particles({
                    x: 8 * Math.random() - 4,
                    y: 8 * Math.random() - 4
                }, 120, this.particleSource, .05 * Math.random());
                particle.build(), particle.getContent().tint = APP.appModel.currentPlayerModel.color, 
                particle.alphadecress = .02, particle.scaledecress = -.05, particle.setPosition(this.getPosition().x - (Math.random() + .1 * this.getContent().width) / 2, this.getPosition().y), 
                this.layer.addChild(particle);
            }
            this.collidable = !1, this.updateable = !1;
        }
    }
}), InteractiveBackground = Entity.extend({
    init: function(screen) {
        this._super(!0), this.screen = screen, this.container = new PIXI.DisplayObjectContainer(), 
        this.vecDots = [], this.gravity = 0, this.accel = 0;
    },
    build: function() {
        this.dist = 60;
        for (var _w = windowWidth / this.dist, _h = windowHeight / this.dist, i = 0; _w > i; i++) for (var j = 0; _h > j; j++) if (Math.random() > .2) {
            var dot = new PIXI.Graphics();
            dot.beginFill(16777215), dot.velocity = {
                x: 0,
                y: 0
            }, dot.velocity.y = .1 + .2 * Math.random(), dot.velocity.x = 0, dot.drawRect(0, 0, Math.ceil(6 * dot.velocity.y), Math.ceil(10 * dot.velocity.y)), 
            dot.position.x = this.dist * i + Math.random() * this.dist / 2, dot.position.y = this.dist * j + Math.random() * this.dist / 2, 
            this.container.addChild(dot), dot.alpha = .5 * Math.random() + .3, dot.side = Math.random() < .5 ? 1 : -1, 
            this.vecDots.push(dot);
        }
    },
    getContent: function() {
        return this.container;
    },
    update: function() {
        for (var i = this.vecDots.length - 1; i >= 0; i--) this.vecDots[i].position.x += this.vecDots[i].velocity.x + this.accel, 
        this.vecDots[i].position.y += this.vecDots[i].velocity.y + this.gravity, this.vecDots[i].alpha += .01 * this.vecDots[i].side, 
        (this.vecDots[i].alpha <= 0 || this.vecDots[i].alpha >= .8) && (this.vecDots[i].side *= -1), 
        this.vecDots[i].position.y > windowHeight + this.dist && (this.vecDots[i].position.y = 0), 
        this.vecDots[i].position.x > windowWidth + this.dist ? this.vecDots[i].position.x = 0 : this.vecDots[i].position.x < 0 && (this.vecDots[i].position.x = windowWidth + this.dist);
    }
}), KillerBall = Entity.extend({
    init: function(vel, behaviour) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = 80, this.width = 1, 
        this.height = 1, this.type = "killer", this.node = null, this.velocity.x = vel.x, 
        this.velocity.y = vel.y, this.timeLive = 1e3, this.power = 1, this.defaultVelocity = 1, 
        this.behaviour = behaviour.clone(), this.imgSource = "inimigo.png", this.particleSource = "partEnemy.png";
    },
    startScaleTween: function() {
        TweenLite.from(this.getContent().scale, .3, {
            x: 0,
            y: 0,
            ease: "easeOutBack"
        });
    },
    build: function() {
        this.sprite = new PIXI.Sprite.fromFrame(this.imgSource), this.sprite.anchor.x = .5, 
        this.sprite.anchor.y = .5, this.updateable = !0, this.collidable = !0, this.getContent().alpha = .5, 
        TweenLite.to(this.getContent(), .3, {
            alpha: 1
        }), this.collideArea = new PIXI.Rectangle(-50, -50, windowWidth + 100, windowHeight + 100), 
        this.particlesCounterMax = 5, this.particlesCounter = 5;
    },
    update: function() {
        this.range = this.sprite.height / 2.5;
        var tempRot = 0;
        tempRot = this.behaviour.tempPosition ? Math.atan2(this.behaviour.tempPosition.y, this.behaviour.tempPosition.x) : Math.atan2(this.velocity.y, this.velocity.x), 
        this.getContent().rotation = -tempRot, this._super(), this.behaviour.update(this), 
        this.updateableParticles();
    },
    updateableParticles: function() {
        if (this.particlesCounter--, this.particlesCounter <= 0) {
            this.particlesCounter = this.particlesCounterMax;
            var particle = new Particles({
                x: 4 * Math.random() - 2,
                y: 4 * Math.random() - 2
            }, 120, this.particleSource, .3 * Math.random() - .15);
            particle.maxScale = this.getContent().scale.x / 2 + Math.random() * this.getContent().scale.x / 2, 
            particle.maxInitScale = particle.maxScale, particle.growType = -1, particle.build(), 
            particle.gravity = 0, particle.alphadecress = .08, particle.scaledecress = -.04, 
            particle.setPosition(this.getPosition().x - (Math.random() + .1 * this.getContent().width) / 2, this.getPosition().y), 
            this.layer.addChild(particle);
        }
    },
    preKill: function() {
        if (!this.invencible) {
            for (var i = 5; i >= 0; i--) {
                var particle = new Particles({
                    x: 8 * Math.random() - 4,
                    y: 8 * Math.random() - 4
                }, 120, this.particleSource, .1 * Math.random());
                particle.maxScale = this.getContent().scale.x / 2, particle.maxInitScale = particle.maxScale, 
                particle.build(), particle.gravity = .3 * Math.random(), particle.alphadecress = .04, 
                particle.scaledecress = -.05, particle.setPosition(this.getPosition().x - (Math.random() + .1 * this.getContent().width) / 2, this.getPosition().y), 
                this.layer.addChild(particle);
            }
            this.collidable = !1, this.kill = !0;
        }
    }
}), AppModel = Class.extend({
    init: function() {
        tempWorld = APP.cookieManager.getSafeCookie("maxworld"), tempLevel = APP.cookieManager.getSafeCookie("maxlevel"), 
        APP.maxWorld = tempWorld && "undefined" !== tempWorld && "NaN" !== tempWorld ? tempWorld : 0, 
        APP.maxLevel = tempLevel && "undefined" !== tempLevel && "NaN" !== tempLevel ? tempLevel : 0, 
        APP.maxWorld || (APP.maxWorld = 0), APP.maxLevel || (APP.maxLevel = 0), console.log(" - ", APP.maxWorld, APP.maxLevel, APP.cookieManager.getSafeCookie("maxworld"));
        for (var i = 0; i < LEVELS.length; i++) if (tempHigh = APP.cookieManager.getSafeCookie("highscores" + i), 
        tempHigh) {
            tempHigh = tempHigh.split(",");
            for (var j = 0; j < tempHigh.length; j++) LEVELS[i][j] && (LEVELS[i][j][1].highscore = parseInt(tempHigh[j]));
        }
    },
    saveWorld: function() {
        APP.maxWorld = parseInt(APP.currentWorld > APP.maxWorld ? APP.currentWorld : APP.maxWorld), 
        APP.cookieManager.setSafeCookie("maxworld", APP.maxWorld), APP.cookieManager.setSafeCookie("maxlevel", 0);
    },
    saveScore: function() {
        APP.maxLevel = parseInt(APP.currentLevel > APP.maxLevel ? APP.currentLevel : APP.maxLevel), 
        APP.currentLevel < 0 && (APP.currentLevel = 0), APP.cookieManager.setSafeCookie("maxlevel", APP.maxLevel);
        var tempHigh = LEVELS[APP.currentWorld][APP.currentLevel].highscore;
        LEVELS[APP.currentWorld][APP.currentLevel][1].highscore = APP.points > tempHigh ? APP.points : APP.points;
        for (var i = 0; i < LEVELS.length; i++) {
            tempLevelHigh = [];
            for (var j = 0; j < LEVELS[i].length; j++) tempLevelHigh.push(LEVELS[i][j][1].highscore);
            APP.cookieManager.setSafeCookie("highscores" + i, tempLevelHigh.toString());
        }
        console.log("salvou isso", APP.maxWorld, APP.maxLevel);
    },
    zerarTudo: function() {
        APP.cookieManager.setSafeCookie("maxworld", 0), APP.cookieManager.setSafeCookie("maxlevel", 0);
        for (var i = 0; i < LEVELS.length; i++) {
            tempLevelHigh = [];
            for (var j = 0; j < LEVELS[i].length; j++) tempLevelHigh.push(0);
            APP.cookieManager.setSafeCookie("highscores" + i, tempLevelHigh.toString());
        }
    },
    maxPoints: function() {
        this.currentHorde = 0, this.totalPoints = 999999, this.totalBirds = 8, APP.cookieManager.setCookie("totalPoints", this.totalPoints, 500), 
        APP.cookieManager.setCookie("totalBirds", this.totalBirds, 500);
        for (var i = this.playerModels.length - 1; i >= 0; i--) this.playerModels[i].toAble <= this.totalPoints ? this.playerModels[i].able = !0 : this.playerModels[i].able = !1;
    },
    build: function() {},
    destroy: function() {},
    serialize: function() {}
}), DataManager = Class.extend({
    init: function() {
        this.highscore = APP.cookieManager.getCookie("highScore"), console.log("highscore", this.highscore.points);
    },
    saveScore: function(id) {
        var i = 0, tempBirds = [ [ "caralinhoDaTerra", 0 ], [ "caralhoBelga", 0 ], [ "lambecuFrances", 0 ], [ "papacuDeCabecaRoxa", 0 ], [ "galinhoPapoDeBago", 0 ], [ "nocututinha", 0 ], [ "calopsuda", 0 ], [ "picudaoAzulNigeriano", 0 ] ];
        for (i = APP.getGameModel().killedBirds.length - 1; i >= 0; i--) tempBirds[APP.getGameModel().killedBirds[i]][1]++;
        var sendObject = '{\n"character":"' + APP.getGameModel().playerModels[APP.getGameModel().currentID].label + '",\n"points":"' + APP.getGameModel().currentPoints + '",\n"birds":{\n';
        for (i = 0; i < tempBirds.length; i++) sendObject += i >= tempBirds.length - 1 ? '"' + tempBirds[i][0] + '":"' + tempBirds[i][1] + '"\n' : '"' + tempBirds[i][0] + '":"' + tempBirds[i][1] + '",\n';
        sendObject += "}\n}", console.log(sendObject);
        ({
            character: APP.getGameModel().playerModels[APP.getGameModel().currentID].label,
            points: APP.getGameModel().currentPoints
        });
        this.highscore = JSON.parse(sendObject), APP.cookieManager.setCookie("highScore", this.highscore, 500);
    }
}), LEVELS = [], world1 = [], world2 = [], world3 = [], world4 = [], tempMap = [ [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ], [ 1, 0, 0, 0, 8, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 4, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 4, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 7, 0, 0, 0, 1, 0 ], [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ] ];

world1.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), tempMap = [ [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 8, 1, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 1, 4, 0, 0, 0, 0, 0, 4, 1, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 1, 7, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ] ], 
world1.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), tempMap = [ [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ], [ 1, 0, 0, 0, 8, 0, 0, 0, 1, 0 ], [ 1, 0, 3, 3, 3, 3, 3, 0, 1, 0 ], [ 1, 0, 3, 0, 0, 0, 3, 0, 1, 0 ], [ 1, 0, 3, 0, 0, 0, 3, 0, 1, 0 ], [ 1, 4, 3, 3, 3, 3, 3, 4, 1, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 7, 0, 0, 0, 1, 0 ], [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ] ], 
world1.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), tempMap = [ [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1 ], [ 0, 1, 0, 0, 0, 0, 0, 0, 3, 1 ], [ 0, 1, 0, 2, 3, 0, 0, 0, 3, 1 ], [ 0, 1, 0, 2, 3, 0, 0, 0, 3, 1 ], [ 0, 1, 0, 2, 3, 0, 0, 0, 3, 1 ], [ 0, 1, 0, 2, 3, 4, 4, 8, 3, 1 ], [ 0, 1, 0, 2, 3, 3, 3, 3, 3, 1 ], [ 0, 1, 0, 2, 2, 2, 2, 2, 2, 1 ], [ 0, 1, 0, 0, 0, 0, 0, 0, 7, 1 ], [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1 ] ], 
world1.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), tempMap = [ [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ], [ 1, 0, 0, 0, 8, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 1, 0, 4, 0, 11, 0, 4, 0, 1, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 7, 0, 0, 0, 1, 0 ], [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ] ], 
world1.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), tempMap = [ [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ], [ 1, 0, 0, 0, 8, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 4, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 1, 0, [ [ 15, 1, 2, 1 ] ], 0, 0, 0, [ [ 15, 0, 2, 1 ] ], 0, 1, 0 ], [ 1, 0, 0, 0, 4, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 7, 0, 0, 0, 1, 0 ], [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ] ], 
world1.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), tempMap = [ [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ], [ 1, 0, 0, 0, 8, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 1, [ [ 15, 0, 3, 1 ] ], 0, 0, 4, 0, 0, [ [ 15, 3, 3, 1 ] ], 1, 0 ], [ 1, 0, 2, 2, 2, 2, 2, 0, 1, 0 ], [ 1, 0, 2, 2, 2, 2, 2, 0, 1, 0 ], [ 1, [ [ 15, 1, 3, 1 ] ], 0, 0, 4, 0, 0, [ [ 15, 2, 3, 1 ] ], 1, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 7, 0, 0, 0, 1, 0 ], [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ] ], 
world1.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), tempMap = [ [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 0 ], [ 1, 0, 0, 0, 8, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 1, [ [ 15, 1, 3, 1 ] ], 0, 0, 0, 0, 0, [ [ 15, 0, 3, 1 ] ], 1, 0 ], [ 1, 0, 4, 2, 2, 2, 4, 0, 1, 0 ], [ 1, 0, 0, 3, 3, 3, 0, 0, 1, 0 ], [ 1, [ [ 16, 1, 3, 1 ] ], 0, 0, 0, 0, 0, [ [ 16, 0, 3, 1 ] ], 1, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 7, 0, 0, 0, 1, 0 ], [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ] ], 
world1.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), tempMap = [ [ 2, 2, 2, 2, 2, 2, 2, 2, 2, 0 ], [ 2, 0, 0, 0, 0, 0, 0, 0, 2, 0 ], [ 2, 0, 0, 4, 1, 0, 0, 0, 2, 0 ], [ 2, 0, 0, 0, 0, 0, 0, 0, 2, 0 ], [ 2, [ [ 15, 1, 1, 1 ] ], 0, 0, 0, 0, 0, [ [ 15, 0, 1, 1 ] ], 2, 0 ], [ 2, 0, 0, 0, 0, 0, 0, 0, 2, 0 ], [ 2, [ [ 16, 1, 1, 1 ] ], 0, 0, 0, 0, [ [ 16, 0, 1, 1 ] ], 8, 2, 0 ], [ 2, 0, 0, 4, 2, 2, 2, 2, 2, 0 ], [ 2, 0, 0, 0, 0, 0, 0, 7, 2, 0 ], [ 2, 2, 2, 2, 2, 2, 2, 2, 2, 0 ] ], 
world1.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), tempMap = [ [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, [ [ 15, 1, 3 ] ], 0, 0, 0, 0, [ [ 15, 2, 3 ] ], 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 4, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ], [ [ [ 14, 0, 2, 1 ] ], 0, 0, 0, 0, [ [ 14, 3, 2, 1 ] ], 0, 0, 0, [ [ 15, 0, 3 ] ], 0, 0, 0, 0, [ [ 13, 0, 2, 1 ], [ 15, 3, 3 ] ], 0, 0, 0, 0, [ [ 13, 3, 2, 1 ] ] ], [ 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0 ], [ 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0 ], [ 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 1, 1, 1, 1, 0 ], [ 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0 ], [ [ [ 14, 1, 2, 1 ] ], 0, 0, 0, 0, [ [ 14, 2, 2, 1 ] ], 0, 0, 0, 0, 0, 0, 0, 0, [ [ 13, 1, 2, 1 ] ], 0, 0, 0, 0, [ [ 13, 2, 2, 1 ] ] ], [ 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, [ [ 12, 0, 3 ] ], 0, 0, 0, 0, 0, [ [ 12, 1, 3 ] ], 0, 0, 0 ], [ 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0, 0, 0, 4 ], [ 2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0 ], [ 2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 3, [ [ 12, 2, 3 ] ], 0, 0, [ [ 12, 3, 3 ] ] ], [ 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 3, 3, 3, 3 ], [ 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 3, 0, 0, 3, 0, [ [ 16, 0, 3, 1 ] ], 0, 4, 0, [ [ 16, 1, 3, 1 ] ] ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 3 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 2, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 7, 0, 1, 0, 0, 1, 0, 0, 2, 0, 0, 0 ] ], 
world1.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), LEVELS.push(world1), tempMap = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 8, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 4, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 4, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 7, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ], 
world2.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), tempMap = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 8, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 4, 2, 2, 2, 2, 4, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 7, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ], 
world2.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), tempMap = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 8, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 4, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 7, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ], 
world2.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), tempMap = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 8, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 4, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 7, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ], 
world2.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), tempMap = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 8, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 4, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 7, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ], 
world2.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), tempMap = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 8, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 4, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 7, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ], 
world2.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), tempMap = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 8, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 4, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 7, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ], 
world2.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), LEVELS.push(world2), tempMap = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 8, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 4, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 4, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 7, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ], 
world3.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), tempMap = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 8, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 4, 2, 2, 2, 2, 4, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 7, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ], 
world3.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), tempMap = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 8, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 4, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 7, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ], 
world3.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), tempMap = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 8, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 4, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 7, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ], 
world3.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), tempMap = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 8, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 4, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 7, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ], 
world3.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), tempMap = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 8, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 4, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 7, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ], 
world3.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), tempMap = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 8, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 4, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 7, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ], 
world3.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), LEVELS.push(world3), tempMap = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 8, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 4, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 4, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 7, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ], 
world4.push([ tempMap, {
    coins: 5,
    highscore: 0
} ]), tempMap = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 8, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 4, 2, 2, 2, 2, 4, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 7, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ], 
world4.push([ tempMap, {
    coins: 4,
    highscore: 0
} ]), tempMap = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 8, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 4, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 7, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ], 
world4.push([ tempMap, {
    coins: 3,
    highscore: 0
} ]), tempMap = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 8, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 4, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 7, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ], 
world4.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), tempMap = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 8, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 4, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 7, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ], 
world4.push([ tempMap, {
    coins: 1,
    highscore: 0
} ]), tempMap = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 8, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 4, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 7, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ], 
world4.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), tempMap = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 8, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 4, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 0, 0, 7, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ], 
world4.push([ tempMap, {
    coins: 2,
    highscore: 0
} ]), LEVELS.push(world4);

var GameScreen = AbstractScreen.extend({
    init: function(label) {
        this._super(label), this.isLoaded = !1, this.fistTime = !1, APP.points = 0, APP.cookieManager.getSafeCookie("highscore") ? APP.highscore = APP.cookieManager.getSafeCookie("highscore") : (APP.cookieManager.setSafeCookie("highscore", 0), 
        APP.highscore = 0), APP.audioController.playAmbientSound("loop"), APP.mute = !0, 
        Howler.mute();
    },
    destroy: function() {
        this._super(), this.environment = [], this.trails = [], this.vecTiles = null;
    },
    build: function() {
        this._super();
        var assetsToLoader = [];
        void 0 !== assetsToLoader && assetsToLoader.length > 0 && !this.isLoaded ? this.initLoad() : this.onAssetsLoaded(), 
        this.pinVel = {
            x: 0,
            y: 0
        }, this.addSoundButton(), this.levelWorldLabel = new PIXI.Text("", {
            font: "32px Vagron",
            fill: "#FFFFFF"
        }), this.levelWorldLabel.position.y = windowHeight / 2, this.levelWorldLabel.position.x = 20, 
        this.levelWorldLabel.resolution = 2, this.addChild(this.levelWorldLabel), this.levelWorldLabel.alpha = 0, 
        this.showWLLabel();
    },
    onProgress: function() {
        this._super();
    },
    onAssetsLoaded: function() {
        this.initApplication();
    },
    initApplication: function() {
        function clickController(event) {
            event.target.scope.player.stretch(event.target.side);
        }
        retina = 2;
        var self = this;
        for (this.hitTouch = new PIXI.Graphics(), this.hitTouch.interactive = !0, this.hitTouch.beginFill(0), 
        this.hitTouch.drawRect(0, 0, windowWidth, windowHeight), this.hitTouch.alpha = 0, 
        this.hitTouch.position.y = 50, APP.stage.addChild(this.hitTouch), this.tapDown = !1, 
        testMobile() || document.body.addEventListener("keydown", function(e) {
            self.player.moveAccum > 0 || self.player && !self.player.blockMove && (87 === e.keyCode || 38 === e.keyCode ? self.player.stretch("UP") : 83 === e.keyCode || 40 === e.keyCode ? self.player.stretch("DOWN") : 65 === e.keyCode || 37 === e.keyCode ? self.player.stretch("LEFT") : (68 === e.keyCode || 39 === e.keyCode) && self.player.stretch("RIGHT"), 
            self.onWall = !1);
        }), this.updateable = !0, this.gameContainer = new PIXI.DisplayObjectContainer(), 
        this.addChild(this.gameContainer), this.trailContainer = new PIXI.DisplayObjectContainer(), 
        this.gameContainer.addChild(this.trailContainer), this.layerManager = new LayerManager(), 
        this.layerManager.build("Main"), this.gameContainer.addChild(this.layerManager.getContent()), 
        this.layer = new Layer(), this.layer.build("EntityLayer"), this.layerManager.addLayer(this.layer), 
        this.coinsContainer = new PIXI.DisplayObjectContainer(), this.addChild(this.coinsContainer), 
        this.maxCoins = LEVELS[APP.currentWorld][APP.currentLevel][1].coins, this.vecCoins = [], 
        i = 0; i < this.maxCoins; i++) {
            var tempGraphic = new PIXI.Graphics();
            tempGraphic.beginFill(0), tempGraphic.drawRect(0, 0, 20, 20), tempGraphic.position.x = 1.5 * tempGraphic.width * i, 
            this.coinsContainer.addChild(tempGraphic), this.vecCoins.push(tempGraphic);
        }
        if (this.updateCoins(), isCordova || testMobile()) {
            var controllerContainer = new PIXI.DisplayObjectContainer(), btnSize = .2 * windowWidth, distanceMulti = 2.1, upGr = new PIXI.Graphics();
            upGr.beginFill(16777215), upGr.moveTo(0, btnSize), upGr.lineTo(btnSize, btnSize), 
            upGr.lineTo(btnSize / 2, 0), upGr.position.x = 1.1 * btnSize, upGr.interactive = !0, 
            upGr.scope = this, upGr.side = "UP", upGr.touchstart = upGr.mousedown = clickController;
            var dwGr = new PIXI.Graphics();
            dwGr.beginFill(16777215), dwGr.moveTo(0, 0), dwGr.lineTo(btnSize, 0), dwGr.lineTo(btnSize / 2, btnSize), 
            dwGr.position.x = 1.1 * btnSize, dwGr.position.y = btnSize * distanceMulti, dwGr.interactive = !0, 
            dwGr.scope = this, dwGr.side = "DOWN", dwGr.touchstart = dwGr.mousedown = clickController;
            var lfGr = new PIXI.Graphics();
            lfGr.beginFill(16777215), lfGr.moveTo(btnSize, 0), lfGr.lineTo(btnSize, btnSize), 
            lfGr.lineTo(0, btnSize / 2), lfGr.position.x = 0, lfGr.position.y = btnSize * distanceMulti / 2, 
            lfGr.interactive = !0, lfGr.scope = this, lfGr.side = "LEFT", lfGr.touchstart = lfGr.mousedown = clickController;
            var rgGr = new PIXI.Graphics();
            rgGr.beginFill(16777215), rgGr.moveTo(0, 0), rgGr.lineTo(0, btnSize), rgGr.lineTo(btnSize, btnSize / 2), 
            rgGr.position.x = 2.2 * btnSize, rgGr.position.y = btnSize * distanceMulti / 2, 
            rgGr.interactive = !0, rgGr.scope = this, rgGr.side = "RIGHT", rgGr.touchstart = rgGr.mousedown = clickController, 
            controllerContainer.addChild(upGr), controllerContainer.addChild(dwGr), controllerContainer.addChild(lfGr), 
            controllerContainer.addChild(rgGr), this.addChild(controllerContainer), controllerContainer.alpha = .2, 
            controllerContainer.position.x = windowWidth / 2 - controllerContainer.width / 2, 
            controllerContainer.position.y = windowHeight - 1.1 * controllerContainer.height;
        }
        this.initLevel(), this.startLevel = !1, this.debugBall = new PIXI.Graphics(), this.backButtonContainer = new PIXI.DisplayObjectContainer(), 
        this.backButton = new PIXI.Graphics(), this.backButton.beginFill(16777215), this.backButton.moveTo(20, 0), 
        this.backButton.lineTo(20, 20), this.backButton.lineTo(0, 10), this.backButton.lineTo(20, 0), 
        this.backButtonContainer.addChild(this.backButton), this.backButtonContainer.scope = this, 
        this.backButtonContainer.interactive = !0, this.backButtonContainer.buttonMode = !0, 
        this.backButtonContainer.touchstart = this.backButtonContainer.mousedown = this.backFunction, 
        this.backButtonContainer.position.x = 20, this.backButtonContainer.position.y = 20, 
        this.addChild(this.backButtonContainer), this.crazyContent = new PIXI.DisplayObjectContainer(), 
        this.addChild(this.crazyContent), this.layerManagerHUD = new LayerManager(), this.layerManagerHUD.build("HUD"), 
        this.gameContainer.addChild(this.layerManagerHUD.getContent()), this.HUDLayer = new Layer(), 
        this.HUDLayer.build("HUDLayer"), this.layerManagerHUD.addLayer(this.HUDLayer);
    },
    backFunction: function(event) {
        var scope = event.target.scope;
        this.updateable = !1, scope.screenManager.change("Levels");
    },
    collideWall: function(nonRecoil) {
        function removeSelf(target) {
            target && target.parent && target.parent.removeChild(target);
        }
        if (!(this.trails.length <= 0)) {
            var self = this;
            self.recoil = !0, this.recoilTimeline = new TimelineLite({
                onComplete: function() {}
            });
            for (var frames = 1500, tempTrail = null, i = 0; i < this.trails.length; i++) tempTrail = this.trails[i].trail, 
            this.recoilTimeline.append("HORIZONTAL" === this.trails[i].type ? TweenLite.to(tempTrail, Math.abs(tempTrail.width) / frames, {
                width: 0,
                x: tempTrail.position.x + tempTrail.width,
                ease: "easeNone",
                onComplete: removeSelf,
                onCompleteParams: [ tempTrail ]
            }) : TweenLite.to(tempTrail, Math.abs(tempTrail.height) / frames, {
                height: 0,
                y: tempTrail.position.y + tempTrail.height,
                ease: "easeNone",
                onComplete: removeSelf,
                onCompleteParams: [ tempTrail ]
            }));
            nonRecoil || this.player.returnCollide(), this.trails = [];
        }
    },
    addTrail: function() {
        var trail = new PIXI.Graphics();
        trail.beginFill(this.player.color);
        var trailObj = {
            trail: trail
        };
        if (0 === this.player.velocity.y) {
            if (this.trails.length > 1 && !this.onWall && "HORIZONTAL" === this.trails[this.trails.length - 1].type) return void (this.onBack = !0);
            trail.drawRect(0, -this.player.height, 1, this.player.height), trail.position.x = this.player.getPosition().x, 
            trail.position.y = this.player.getPosition().y + this.player.height / 2, trailObj.type = "HORIZONTAL", 
            trailObj.side = this.player.velocity.x < 0 ? "LEFT" : "RIGHT";
        } else {
            if (this.trails.length > 1 && !this.onWall && "VERTICAL" === this.trails[this.trails.length - 1].type) return void (this.onBack = !0);
            trail.drawRect(-this.player.width / 2, 0, this.player.width, 1), trail.position.x = this.player.getPosition().x, 
            trail.position.y = this.player.getPosition().y, trailObj.type = "VERTICAL", trailObj.side = this.player.velocity.y < 0 ? "UP" : "DOWN";
        }
        var joint = new PIXI.Graphics();
        joint.beginFill(this.player.color), joint.drawCircle(0, 0, this.player.width / 2), 
        this.trailContainer.addChild(joint), this.trailContainer.addChild(trail), joint.position.x = this.player.getPosition().x, 
        joint.position.y = this.player.getPosition().y, this.trails.push({
            trail: joint,
            type: "JOINT",
            side: trailObj.side
        }), this.trails.push(trailObj), this.onBack = !1;
    },
    update: function() {
        if (this.updateable && (this.hitTouch && this.hitTouch.parent && this.hitTouch.parent.setChildIndex(this.hitTouch, this.hitTouch.parent.children.length - 1), 
        this.layerManagerHUD.getContent() && this.layerManagerHUD.getContent().parent && (this.layerManagerHUD.getContent().parent.setChildIndex(this.layerManagerHUD.getContent(), this.layerManagerHUD.getContent().parent.children.length - 1), 
        this.layerManagerHUD.update()), this.updateMapPosition(), this._super(), this.layerManager && this.layerManager.update(), 
        !this.endGame)) {
            if (this.levelWorldLabel && this.levelWorldLabel.parent.setChildIndex(this.levelWorldLabel, 0), 
            this.onBack) {
                for (var lastJoint = null, k = this.trails.length - 1; k >= 0; k--) if ("JOINT" === this.trails[k].type) {
                    lastJoint = this.trails[k];
                    break;
                }
                if (lastJoint) {
                    var remove = !1;
                    if ("UP" === lastJoint.side ? this.player.getPosition().y > lastJoint.trail.position.y && (this.player.getPosition().y = lastJoint.trail.position.y, 
                    remove = !0) : "DOWN" === lastJoint.side ? this.player.getPosition().y < lastJoint.trail.position.y && (this.player.getPosition().y = lastJoint.trail.position.y, 
                    remove = !0) : "LEFT" === lastJoint.side ? this.player.getPosition().x > lastJoint.trail.position.x && (this.player.getPosition().x = lastJoint.trail.position.x, 
                    remove = !0) : this.player.getPosition().x < lastJoint.trail.position.x && (this.player.getPosition().x = lastJoint.trail.position.x, 
                    remove = !0), remove) {
                        this.player.stop();
                        var spl = this.trails.splice(this.trails.length - 2, 2), j = 0;
                        spl.length;
                        for (j = spl.length - 1; j >= 0; j--) spl[j].trail.parent && spl[j].trail.parent.removeChild(spl[j].trail);
                        for (j = this.trails.length - 1; j >= 0; j--) if ("JOINT" === this.trails[j].type) {
                            this.player.moveBack(this.trails[j].side);
                            break;
                        }
                    }
                }
                this.trailCollide(!0);
            } else this.trailCollide();
            if (this.player.velocity.y + this.player.velocity.x !== 0) {
                if (this.trails.length > 1) {
                    var tempTrail = this.trails[this.trails.length - 1].trail;
                    0 === this.player.velocity.y ? tempTrail.width = this.player.getPosition().x - tempTrail.position.x : tempTrail.height = this.player.getPosition().y - tempTrail.position.y;
                }
                var tempTiles = this.getTileByPos(this.player.getPosition().x, this.player.getPosition().y), typeTile = this.getTileType(tempTiles.i, tempTiles.j);
                1 === typeTile ? (this.player.getContent().position.x -= this.player.velocity.x, 
                this.player.getContent().position.y -= this.player.velocity.y, this.player.stop(), 
                this.collideWall()) : 2 === typeTile ? (this.gameOver(), this.player.preKill()) : 3 === typeTile && (this.player.explode2(), 
                this.player.stop(), this.player.moveBack(this.trails[this.trails.length - 1].side), 
                this.onBack = !0);
            }
        }
    },
    trailCollide: function(justEnemies) {
        for (var i = 0; i < this.trails.length && !this.blockCollide; i++) if ("JOINT" !== this.trails[i].type) for (var rectTrail, tempEntity = null, tempTrail = this.trails[i], j = 0; j < this.layer.childs.length; j++) if (tempEntity = this.layer.childs[j], 
        "enemy" === tempEntity.type || !justEnemies && "player" === tempEntity.type && i < this.trails.length - 5) {
            var rectPlayer = new PIXI.Rectangle(tempEntity.getPosition().x - tempEntity.spriteBall.width / 2, tempEntity.getPosition().y - tempEntity.spriteBall.height / 2, tempEntity.spriteBall.width, tempEntity.spriteBall.height);
            rectTrail = "VERTICAL" === tempTrail.type ? "UP" === tempTrail.side ? new PIXI.Rectangle(tempTrail.trail.position.x - Math.abs(tempTrail.trail.width) / 2, tempTrail.trail.position.y - Math.abs(tempTrail.trail.height), Math.abs(tempTrail.trail.width), Math.abs(tempTrail.trail.height)) : new PIXI.Rectangle(tempTrail.trail.position.x - tempTrail.trail.width / 2, tempTrail.trail.position.y, Math.abs(tempTrail.trail.width), Math.abs(tempTrail.trail.height)) : "RIGHT" === tempTrail.side ? new PIXI.Rectangle(tempTrail.trail.position.x, tempTrail.trail.position.y - Math.abs(tempTrail.trail.height), Math.abs(tempTrail.trail.width), Math.abs(tempTrail.trail.height)) : new PIXI.Rectangle(tempTrail.trail.position.x - Math.abs(tempTrail.trail.width), tempTrail.trail.position.y - Math.abs(tempTrail.trail.height), Math.abs(tempTrail.trail.width), Math.abs(tempTrail.trail.height)), 
            rectPlayer.x + tempEntity.velocity.x < rectTrail.x + rectTrail.width && rectPlayer.x + rectPlayer.width + tempEntity.velocity.x > rectTrail.x && rectPlayer.y + tempEntity.velocity.y < rectTrail.y + rectTrail.height && rectPlayer.height + rectPlayer.y + tempEntity.velocity.y > rectTrail.y && ("enemy" === tempEntity.type ? (tempEntity.preKill(), 
            this.gameOver()) : this.player.blockCollide2 || (this.player.explode2(), this.player.stopReturn(), 
            this.player.stop(), this.player.moveBack(this.trails[this.trails.length - 1].side), 
            this.onBack = !0));
        }
    },
    updateMapPosition: function() {
        this.gameContainer.position.x = windowWidth / 2 - this.player.getPosition().x * this.gameContainer.scale.x, 
        this.gameContainer.position.y = windowHeight / 2 - this.player.getPosition().y * this.gameContainer.scale.y;
        var tempScale = 1;
        if (this.trailContainer.width / this.gameContainer.scale.x > windowWidth / 2 && (tempScale = windowWidth / 2 / this.trailContainer.width), 
        this.trailContainer.height / this.gameContainer.scale.y > windowHeight / 2) {
            var tempH = windowHeight / 2 / this.trailContainer.height;
            tempScale = tempH > tempScale ? tempScale : tempH;
        }
        TweenLite.to(this.gameContainer.scale, 1, {
            x: tempScale,
            y: tempScale
        });
    },
    initLevel: function(whereInit) {
        windowHeight > windowWidth ? (APP.tileSize = {
            w: .08 * windowWidth,
            h: .08 * windowWidth
        }, APP.standardVel = .05 * APP.tileSize.h) : (APP.tileSize = {
            w: .06 * windowHeight,
            h: .06 * windowHeight
        }, APP.standardVel = .05 * APP.tileSize.w), this.trails = [], this.recoil = !1, 
        APP.points = 0, this.player = new Ball({
            x: 0,
            y: 0
        }, this), this.player.build(), this.layer.addChild(this.player), this.player.getContent().position.x = windowWidth / 2, 
        this.player.getContent().position.y = windowHeight / 1.2, this.portal = new EndPortal(this), 
        this.portal.build(), this.layer.addChild(this.portal);
        this.force = 0, this.levelCounter = 800, this.levelCounterMax = 800, this.changeColor(!0, !0), 
        this.endGame = !1, this.initEnvironment(), this.updateMapPosition(), TweenLite.from(this.gameContainer.scale, .5, {
            y: .5,
            x: .5
        }), this.updateCoins();
    },
    initEnvironment: function() {
        this.environment = [], this.mapSize = {
            i: LEVELS[0][0].length,
            j: LEVELS[0].length
        }, this.environment = LEVELS[APP.currentWorld][APP.currentLevel][0], this.drawMap(), 
        this.drawPlayer(), this.drawEndPortal();
    },
    drawMap: function() {
        if (this.environment) if (this.vecTiles && this.vecTiles.length > 0) for (var k = 0; k < this.vecTiles.length; k++) {
            var tempTile = this.getTileByPos(this.vecTiles[k].x + 5, this.vecTiles[k].y + 5), tileType = this.getTileType(tempTile.i, tempTile.j);
            this.drawTile(tileType, tempTile.i, tempTile.j, this.vecTiles[k]);
        } else {
            this.vecTiles = [], this.vecMovEnemiesTemp = [], this.vecMovEnemies = [];
            for (var i = 0; i < this.environment.length; i++) for (var j = 0; j < this.environment[i].length; j++) if (this.environment[i][j] instanceof Array) for (var l = 0; l < this.environment[i][j].length; l++) this.drawTile(this.environment[i][j][l], j, i); else this.drawTile(this.environment[i][j], j, i);
        }
    },
    drawTile: function(type, i, j, exists) {
        if (type >= 1 && 3 >= type) {
            var tempColor = addBright(this.player.color, 1 - .15 * (APP.currentWorld + 1)), tempGraphics = exists ? exists : new PIXI.Graphics();
            tempGraphics.clear();
            var isEnemy = !1;
            if (1 === type) tempGraphics.beginFill(tempColor), isCordova ? tempGraphics.drawRect(0, 0, Math.ceil(APP.tileSize.w), Math.ceil(APP.tileSize.h)) : tempGraphics.drawRect(0, 0, APP.tileSize.w, APP.tileSize.h); else if (2 === type) {
                tempColor = addBright(this.player.color, .7 - .15 * (APP.currentWorld + 1)), tempGraphics.beginFill(tempColor);
                for (var temp1 = -2, aux = 2, line = 5, sz = .05 * -APP.tileSize.w, init = {}, ii = 0; line >= ii; ii++) 0 === ii ? (init = {
                    x: APP.tileSize.w / line * ii,
                    y: -(sz * temp1) + aux
                }, tempGraphics.moveTo(init.x, init.y)) : tempGraphics.lineTo(APP.tileSize.w / line * ii, -(sz * temp1) + aux), 
                temp1 *= -1;
                for (ii = 0; line >= ii; ii++) tempGraphics.lineTo(APP.tileSize.w - aux - sz * temp1, APP.tileSize.h / line * ii), 
                temp1 *= -1;
                for (temp1 = 2, ii = 0; line >= ii; ii++) tempGraphics.lineTo(APP.tileSize.w - APP.tileSize.w / line * ii, APP.tileSize.h - sz * temp1 - aux), 
                temp1 *= -1;
                for (ii = 0; line >= ii; ii++) tempGraphics.lineTo(-sz * temp1 + aux, APP.tileSize.h - APP.tileSize.h / line * ii), 
                temp1 *= -1;
                tempGraphics.lineTo(init.x, init.y), isEnemy = !0;
            } else 3 === type && (tempColor = addBright(this.player.color, .8 - .15 * (APP.currentWorld + 1)), 
            APP.currentWorld > 1 ? tempGraphics.lineStyle(1, tempColor) : tempGraphics.beginFill(tempColor), 
            tempGraphics.drawRoundedRect(0, 0, APP.tileSize.w, APP.tileSize.h, .4 * APP.tileSize.w));
            tempGraphics.position.x = i * APP.tileSize.w, tempGraphics.position.y = j * APP.tileSize.h, 
            this.gameContainer.addChild(tempGraphics), exists || this.vecTiles.push(tempGraphics);
        }
        if (!exists) {
            if (4 === type) {
                var coin = new Coin(this);
                coin.build(), this.layer.addChild(coin), coin.getContent().position.x = i * APP.tileSize.w + APP.tileSize.w / 2, 
                coin.getContent().position.y = j * APP.tileSize.h + APP.tileSize.h / 2;
            } else type > 10 && (enemyStatic = new Enemy1(this), enemyStatic.build(), this.layer.addChild(enemyStatic), 
            enemyStatic.getContent().position.x = i * APP.tileSize.w + APP.tileSize.w / 2, enemyStatic.getContent().position.y = j * APP.tileSize.h + APP.tileSize.h / 2);
            if (type instanceof Array && type[0] > 10) {
                this.vecMovEnemiesTemp.push({
                    index: type[1],
                    id: type[0],
                    x: i * APP.tileSize.w + APP.tileSize.w / 2,
                    y: j * APP.tileSize.h + APP.tileSize.h / 2
                });
                for (var count = 0, tempPositions = [], k = 0; k < this.vecMovEnemiesTemp.length; k++) this.vecMovEnemiesTemp[k].id === type[0] && (count++, 
                tempPositions.push({
                    x: this.vecMovEnemiesTemp[k].x,
                    y: this.vecMovEnemiesTemp[k].y,
                    index: this.vecMovEnemiesTemp[k].index
                }));
                var enemyMov = null;
                if (2 === count) {
                    var tempVel = type.length > 2 ? type[2] : 2;
                    enemyMov = new Enemy2(this, type[0], type.length >= 4 && type[3]), enemyMov.standardVelocity = tempVel * APP.tileSize.w * .05, 
                    enemyMov.build(), this.layer.addChild(enemyMov), enemyMov.getContent().position.x = i * APP.tileSize.w + APP.tileSize.w / 2, 
                    enemyMov.getContent().position.y = j * APP.tileSize.h + APP.tileSize.h / 2, enemyMov.setWaypoints(tempPositions), 
                    this.vecMovEnemies.push(enemyMov);
                } else if (count > 2) {
                    tempPositions.sort(function(a, b) {
                        return a.index - b.index;
                    });
                    for (var l = 0; l < this.vecMovEnemies.length; l++) this.vecMovEnemies[l].id === type[0] && this.vecMovEnemies[l].setWaypoints(tempPositions);
                }
            }
        }
    },
    drawEndPortal: function() {
        for (var i = 0; i < this.environment.length; i++) for (var j = 0; j < this.environment[i].length; j++) 8 === this.environment[i][j] && (this.portal.getContent().position.x = j * APP.tileSize.w + APP.tileSize.w / 2, 
        this.portal.getContent().position.y = i * APP.tileSize.h + APP.tileSize.h / 2);
    },
    drawPlayer: function() {
        for (var i = 0; i < this.environment.length; i++) for (var j = 0; j < this.environment[i].length; j++) 7 === this.environment[i][j] && (this.player.getContent().position.x = j * APP.tileSize.w + APP.tileSize.w / 2, 
        this.player.getContent().position.y = i * APP.tileSize.h + APP.tileSize.h / 2);
    },
    getTileByPos: function(x, y) {
        var tempX = Math.floor(x / APP.tileSize.w), tempY = Math.floor(y / APP.tileSize.h), ret = {
            i: tempX,
            j: tempY
        };
        return ret;
    },
    getTileType: function(i, j) {
        if (!this.environment || !this.environment.length) return 0;
        try {
            return this.environment[j][i];
        } catch (err) {
            return 1;
        }
    },
    addSoundButton: function() {
        this.soundButtonContainer = new PIXI.DisplayObjectContainer(), this.soundOn = new PIXI.Graphics(), 
        this.soundOn.beginFill(16777215), this.soundOn.moveTo(10, 0), this.soundOn.lineTo(0, 0), 
        this.soundOn.lineTo(0, 20), this.soundOn.lineTo(10, 20), this.soundOn.moveTo(15, 20), 
        this.soundOn.lineTo(25, 20), this.soundOn.lineTo(25, 0), this.soundOn.lineTo(15, 0), 
        this.soundOff = new PIXI.Graphics(), this.soundOff.beginFill(16777215), this.soundOff.moveTo(0, 0), 
        this.soundOff.lineTo(20, 10), this.soundOff.lineTo(0, 20), this.soundButtonContainer.addChild(APP.mute ? this.soundOff : this.soundOn), 
        this.addChild(this.soundButtonContainer), this.soundButtonContainer.position.x = windowWidth - 40, 
        this.soundButtonContainer.position.y = 20, this.soundButtonContainer.hitArea = new PIXI.Rectangle(-5, -5, 35, 35), 
        this.soundButtonContainer.interactive = !0, this.soundButtonContainer.buttonMode = !0;
        var self = this;
        this.soundButtonContainer.touchstart = this.soundButtonContainer.mousedown = function(mouseData) {
            APP.mute ? (APP.mute = !1, Howler.unmute()) : (APP.mute = !0, Howler.mute()), self.soundOff.parent && self.soundOff.parent.removeChild(self.soundOff), 
            self.soundOn.parent && self.soundOn.parent.removeChild(self.soundOn), self.soundButtonContainer.addChild(APP.mute ? self.soundOff : self.soundOn);
        };
    },
    addCrazyMessage: function(message, time) {
        this.crazyLabel && this.crazyLabel.parent && this.crazyLabel.parent.removeChild(this.crazyLabel), 
        this.crazyLabel2 && this.crazyLabel2.parent && this.crazyLabel2.parent.removeChild(this.crazyLabel2);
        var rot = .02 * Math.random() + .02;
        rot = Math.random() < .5 ? -rot : rot;
        var scl = 1;
        this.crazyLabel = new PIXI.Text(message, {
            align: "center",
            font: "40px Vagron",
            fill: "#9d47e0",
            wordWrap: !0,
            wordWrapWidth: 500
        }), this.crazyLabel.resolution = 2, this.crazyLabel.rotation = rot, this.crazyLabel.position.y = windowHeight / 2 + this.crazyLabel.height, 
        this.crazyLabel.position.x = windowWidth / 2, this.crazyLabel.anchor = {
            x: .5,
            y: .5
        }, this.crazyLabel2 = new PIXI.Text(message, {
            align: "center",
            font: "40px Vagron",
            fill: "#13c2b6",
            wordWrap: !0,
            wordWrapWidth: 500
        }), this.crazyLabel2.resolution = 2, this.crazyLabel2.rotation = -rot, this.crazyLabel2.position.y = windowHeight / 2 + this.crazyLabel2.height, 
        this.crazyLabel2.position.x = windowWidth / 2, this.crazyLabel2.anchor = {
            x: .5,
            y: .5
        }, this.crazyContent.addChild(this.crazyLabel), this.crazyContent.addChild(this.crazyLabel2), 
        this.crazyContent.alpha = 1, this.crazyContent.rotation = 0, TweenLite.from(this.crazyLabel, .4, {
            rotation: 0
        }), TweenLite.from(this.crazyLabel2, .4, {
            rotation: 0
        }), TweenLite.from(this.crazyLabel.scale, .2, {
            x: 2 * scl,
            y: 2 * scl
        }), TweenLite.from(this.crazyLabel2.scale, .2, {
            x: 2 * scl,
            y: 2 * scl
        }), TweenLite.from(this.crazyLabel, time, {
            delay: .3,
            alpha: 0
        }), TweenLite.from(this.crazyLabel2, time, {
            delay: .3,
            alpha: 0
        }), this.crazyContent && this.crazyContent.parent ? this.crazyContent.parent.setChildIndex(this.crazyContent, this.crazyContent.parent.children.length - 1) : this.addChild(this.crazyContent);
    },
    miss: function() {
        APP.audioController.playSound("error"), this.player.breakJump = !0, this.player.velocity.y = 0;
        var wrongLabel = APP.vecError[Math.floor(APP.vecError.length * Math.random())], rot = .004 * Math.random(), tempLabel = new PIXI.Text(wrongLabel, {
            font: "35px Vagron",
            fill: "#ec8b78"
        }), errou = new Particles({
            x: 0,
            y: 0
        }, 120, tempLabel, rot);
        errou.maxScale = this.player.getContent().scale.x, errou.build(), errou.gravity = .1, 
        errou.alphadecress = .01, errou.scaledecress = .05, errou.setPosition(this.player.getPosition().x - tempLabel.width / 2, this.player.getPosition().y - 50), 
        this.layer.addChild(errou);
        var errou2 = new Particles({
            x: 0,
            y: 0
        }, 120, new PIXI.Text(wrongLabel, {
            font: "35px Vagron",
            fill: "#c01f2e"
        }), -rot);
        errou2.maxScale = this.player.getContent().scale.x, errou2.build(), errou2.gravity = .1, 
        errou2.alphadecress = .01, errou2.scaledecress = .05, errou2.setPosition(this.player.getPosition().x - tempLabel.width / 2 + 2, this.player.getPosition().y - 50 + 2), 
        this.layer.addChild(errou2), errou2.getContent().parent.setChildIndex(errou.getContent(), errou.getContent().parent.children.length - 1), 
        errou2.getContent().parent.setChildIndex(errou2.getContent(), errou2.getContent().parent.children.length - 1), 
        this.player.inError = !0, this.levelCounter -= .1 * this.levelCounterMax, this.levelCounter < 0 && (this.levelCounter = 0);
    },
    nextLevel: function() {
        this.changeColor();
        for (var i = 0; i < this.layer.childs.length; i++) "enemy" === this.layer.childs[i].type && this.layer.childs[i].preKill();
        APP.currentLevel >= LEVELS[APP.currentWorld].length - 1 ? (APP.appModel.saveScore(), 
        APP.currentWorld++, APP.appModel.saveWorld(), APP.currentLevel = 0) : (APP.appModel.saveScore(), 
        APP.currentLevel++), this.collideWall(!0), this.player.moveAccum = 5e4, this.player.stop(), 
        this.addCrazyMessage("AWESOME", 1);
        var self = this;
        TweenLite.to(this.gameContainer.scale, .5, {
            x: 1.5 * this.gameContainer.scale.x,
            y: 1.5 * this.gameContainer.scale.y
        }), TweenLite.to(this.gameContainer, .5, {
            alpha: 0,
            delay: .8,
            onComplete: function() {
                self.reset();
            }
        }), console.log("current status", APP.currentWorld, APP.currentLevel);
    },
    reset: function() {
        this.destroy(), this.updateable = !1, this.build();
    },
    gameOver: function() {
        if (!this.endGame) {
            this.collideWall(), this.hitTouch && this.hitTouch.parent && this.hitTouch.parent.removeChild(this.hitTouch), 
            setTimeout(function() {
                self.player.preKill();
            }, 50), this.earthquake(40), this.endGame = !0;
            var self = this;
            setTimeout(function() {
                self.endGame = !1, APP.audioController.playSound("wub"), self.recoilTimeline && self.recoilTimeline.kill(), 
                self.reset();
            }, 1e3);
        }
    },
    addRegularLabel: function(label, font, initY) {
        var rot = .004 * Math.random(), tempLabel = new PIXI.Text(label, {
            font: font,
            fill: "#9d47e0"
        }), perfect = new Particles({
            x: 0,
            y: 0
        }, 120, tempLabel, rot);
        perfect.maxScale = this.player.getContent().scale.x, perfect.build(), perfect.gravity = -.2, 
        perfect.alphadecress = .01, perfect.scaledecress = .05, perfect.setPosition(this.player.getPosition().x - tempLabel.width / 2, initY ? initY : this.player.getPosition().y + 50), 
        this.HUDLayer.addChild(perfect);
        var perfect2 = new Particles({
            x: 0,
            y: 0
        }, 120, new PIXI.Text(label, {
            font: font,
            fill: "#13c2b6"
        }), -rot);
        perfect2.maxScale = this.player.getContent().scale.x, perfect2.build(), perfect2.gravity = -.2, 
        perfect2.alphadecress = .01, perfect2.scaledecress = .05, perfect2.setPosition(this.player.getPosition().x - tempLabel.width / 2 + 2, initY ? initY : this.player.getPosition().y + 50 + 2), 
        this.HUDLayer.addChild(perfect2);
    },
    getPerfect: function() {
        APP.audioController.playSound("perfect"), this.addRegularLabel(APP.vecPerfects[Math.floor(APP.vecPerfects.length * Math.random())], "50px Vagron");
        this.earthquake(40), this.levelCounter += .05 * this.levelCounterMax, this.levelCounter > this.levelCounterMax && (this.levelCounter = this.levelCounterMax);
    },
    getCoin: function(isPerfect) {
        this.levelCounter += .015 * this.levelCounterMax, this.levelCounter > this.levelCounterMax && (this.levelCounter = this.levelCounterMax), 
        this.updateCoins(), this.earthquake(20);
    },
    changeColor: function(force, first, forceColor) {
        var tempColor = 0;
        first || (APP.currentColorID = forceColor ? APP.currentColorID : Math.floor(APP.vecColors.length * Math.random()));
        var temptempColor = APP.vecColors[APP.currentColorID];
        if (force ? (APP.background.clear(), APP.background.beginFill(temptempColor), APP.background.drawRect(-80, -80, windowWidth + 160, windowHeight + 160)) : (forceColor && (APP.backColor = APP.vecColors[Math.floor(APP.vecColors.length * Math.random())]), 
        TweenLite.to(APP, .3, {
            backColor: temptempColor,
            onUpdate: function() {
                APP.background.clear(), APP.background.beginFill(APP.backColor), APP.background.drawRect(-80, -80, windowWidth + 160, windowHeight + 160);
            }
        })), document.body.style.backgroundColor = APP.vecColorsS[APP.currentColorID], this.player) {
            if (tempColor = addBright(temptempColor, .9 - .15 * (APP.currentWorld + 1)), this.player.setColor(tempColor), 
            this.drawMap(), this.trails && this.trails.length) for (var i = 0; i < this.trails.length; i++) {
                var tempTrail = this.trails[i].trail, tempRect = new PIXI.Rectangle(tempTrail.getLocalBounds().x, tempTrail.getLocalBounds().y, tempTrail.getLocalBounds().width, tempTrail.getLocalBounds().height);
                tempTrail.clear(), tempTrail.beginFill(tempColor), "JOINT" !== this.trails[i].type ? tempTrail.drawRect(tempRect.x, tempRect.y, tempRect.width, tempRect.height) : tempTrail.drawCircle(0, 0, tempRect.width / 2);
            }
            this.updateCoins();
        }
    },
    earthquake: function(force) {
        var earth = new TimelineLite();
        earth.append(TweenLite.to(this.container, .2, {
            y: -Math.random() * force,
            x: Math.random() * force - force / 2
        })), earth.append(TweenLite.to(this.container, .2, {
            y: -Math.random() * force,
            x: Math.random() * force - force / 2
        })), earth.append(TweenLite.to(this.container, .2, {
            y: 0,
            x: 0
        }));
    },
    updateCoins: function() {
        this.coinsContainer.position.x = 60, this.coinsContainer.position.y = 20;
        for (var i = 0; i < this.vecCoins.length; i++) {
            var tempRect = this.vecCoins[i].getLocalBounds();
            this.vecCoins[i].clear(), this.vecCoins[i].beginFill(i < APP.points ? 16777215 : addBright(APP.vecColors[APP.currentColorID], .4)), 
            this.vecCoins[i].drawRect(tempRect.x, tempRect.y, tempRect.width, tempRect.height);
        }
        APP.background.parent && APP.background.parent.setChildIndex(APP.background, 0);
    },
    showWLLabel: function() {
        this.levelWorldLabel.setText(APP.currentWorld + 1 + "-" + (APP.currentLevel + 1)), 
        this.levelWorldLabel.position.x = windowWidth - 40 - this.levelWorldLabel.width / 2 - 20, 
        this.levelWorldLabel.position.y = 10, TweenLite.to(this.levelWorldLabel, .5, {
            alpha: .5
        });
    },
    hideWLLabel: function() {
        TweenLite.to(this.levelWorldLabel, .5, {
            alpha: 0
        });
    },
    transitionIn: function() {
        this.build();
    },
    transitionOut: function(nextScreen, container) {
        this.hideWLLabel();
        var self = this;
        this.frontShape ? (this.frontShape.parent.setChildIndex(this.frontShape, this.frontShape.parent.children.length - 1), 
        TweenLite.to(this.frontShape, .3, {
            alpha: 1,
            onComplete: function() {
                self.destroy(), container.removeChild(self.getContent()), nextScreen.transitionIn();
            }
        })) : (self.destroy(), container.removeChild(self.getContent()), nextScreen.transitionIn());
    }
}), InitScreen = AbstractScreen.extend({
    init: function(label) {
        this._super(label);
    },
    destroy: function() {
        this._super();
    },
    build: function() {
        this._super();
    }
}), LevelsScreen = AbstractScreen.extend({
    init: function(label) {
        this._super(label), APP.currentLevel = 0, APP.currentWorld = 0;
    },
    destroy: function() {
        this._super();
    },
    build: function() {
        this._super(), console.log("this"), this.worldsTotalCoins = [], this.worldsGotCoins = [], 
        this.worlds = [], this.worldsContainer = null;
        var i = 0, j = 0, levelsContainer = null, tempGraphicLevel = null, tempColor = addBright(APP.vecColors[APP.currentColorID], .65);
        this.worldsContainer = new PIXI.DisplayObjectContainer();
        var iacumW = 0, jacumW = 0;
        for (i = 0; i < LEVELS.length; i++) {
            for (coinsAcum = 0, levelCoinsAcum = 0, j = 0; j < LEVELS[i].length; j++) LEVELS[i][j][1].coins && (coinsAcum += LEVELS[i][j][1].coins), 
            LEVELS[i][j][1].highscore && (levelCoinsAcum += LEVELS[i][j][1].highscore);
            this.worldsTotalCoins.push(coinsAcum), this.worldsGotCoins.push(levelCoinsAcum);
        }
        for (i = 0; i < LEVELS.length; i++) {
            levelsContainer = new PIXI.DisplayObjectContainer(), i % 2 === 0 && 0 !== i && (jacumW++, 
            iacumW = 0), tempWorldContainer = new PIXI.DisplayObjectContainer(), tempWorldGraphic = new PIXI.Graphics(), 
            tempWorldGraphic.beginFill(addBright(APP.vecColors[APP.currentColorID], .9 - .1 * i)), 
            tempWorldGraphic.drawRect(0, 0, .2 * windowHeight, .2 * windowHeight), tempWorldGraphic.interactive = !0, 
            tempWorldGraphic.buttonMode = !0, tempWorldGraphic.id = i, tempWorldGraphic.scope = this, 
            tempWorldContainer.addChild(tempWorldGraphic), i <= APP.maxWorld && (tempWorldGraphic.touchstart = tempWorldGraphic.mousedown = this.selectWorld, 
            coinGraph = new PIXI.Graphics(), coinGraph.beginFill(16777215), size = .2 * tempWorldGraphic.width, 
            coinGraph.drawRect(-size / 2, -size / 2, size, size), totalCoins = new PIXI.Text(this.worldsGotCoins[i] + "/" + this.worldsTotalCoins[i], {
                align: "center",
                font: "25px Vagron",
                fill: "#FFFFFF"
            }), totalCoins.resolution = 2, coinGraph.position.x = tempWorldGraphic.width / 2, 
            coinGraph.position.y = tempWorldGraphic.height / 2, totalCoins.position.x = tempWorldGraphic.width / 2 - totalCoins.width / 2 / totalCoins.resolution, 
            totalCoins.position.y = tempWorldGraphic.height - totalCoins.height / totalCoins.resolution, 
            tempWorldContainer.addChild(totalCoins), tempWorldContainer.addChild(coinGraph)), 
            tempWorldContainer.position.x = 1.5 * tempWorldGraphic.width * iacumW, tempWorldContainer.position.y = 1.5 * tempWorldGraphic.height * jacumW, 
            iacumW++;
            var iacum = 0, jacum = 0;
            for (j = 0; j < LEVELS[i].length; j++) {
                j % 3 === 0 && 0 !== j && (jacum++, iacum = 0);
                var tempCoins = LEVELS[i][j][1].coins, high = LEVELS[i][j][1].highscore;
                if (console.log("highs", high), tempContainer = new PIXI.DisplayObjectContainer(), 
                tempGraphicLevel = new PIXI.Graphics(), tempGraphicLevel.beginFill(tempColor), tempGraphicLevel.drawRect(0, 0, .1 * windowHeight, .1 * windowHeight), 
                tempGraphicLevel.interactive = !0, tempGraphicLevel.buttonMode = !0, tempGraphicLevel.id = j, 
                tempGraphicLevel.scope = this, tempContainer.addChild(tempGraphicLevel), tempContainer.position.x = 1.5 * tempGraphicLevel.width * iacum, 
                tempContainer.position.y = 1.5 * tempGraphicLevel.height * jacum, j <= APP.maxLevel || i < APP.maxWorld) {
                    tempGraphicLevel.touchstart = tempGraphicLevel.mousedown = this.selectLevel, levelNumber = new PIXI.Text(j + 1, {
                        align: "center",
                        font: "25px Vagron",
                        fill: "#FFFFFF"
                    }), levelNumber.resolution = 2, levelNumber.position.x = tempGraphicLevel.width / 2 - levelNumber.width / 2 / levelNumber.resolution, 
                    levelNumber.position.y = .1 * tempGraphicLevel.height / levelNumber.resolution, 
                    tempContainer.addChild(levelNumber);
                    for (var k = 1; tempCoins + 1 > k; k++) coinGraph = new PIXI.Graphics(), coinGraph.beginFill(high >= k ? 16777215 : addBright(APP.vecColors[APP.currentColorID], .4)), 
                    size = .1 * tempGraphicLevel.width, coinGraph.drawRect(-size / 2, -size / 2, size, size), 
                    coinGraph.position.x = tempGraphicLevel.width / (tempCoins + 1) * k, coinGraph.position.y = tempGraphicLevel.height - 2 * coinGraph.height, 
                    tempContainer.addChild(coinGraph);
                }
                levelsContainer.addChild(tempContainer), iacum++;
            }
            this.worldsContainer.addChild(tempWorldContainer), this.worlds.push([ levelsContainer ]);
        }
        this.backButtonContainer = new PIXI.DisplayObjectContainer(), this.backButton = new PIXI.Graphics(), 
        this.backButton.beginFill(16777215), this.backButton.moveTo(20, 0), this.backButton.lineTo(20, 20), 
        this.backButton.lineTo(0, 10), this.backButton.lineTo(20, 0), this.backButtonContainer.addChild(this.backButton), 
        this.backButtonContainer.scope = this, this.backButtonContainer.interactive = !0, 
        this.backButtonContainer.buttonMode = !0, this.backButtonContainer.touchstart = this.backButtonContainer.mousedown = this.backFunction, 
        this.backButtonContainer.position.x = 20, this.backButtonContainer.position.y = 20, 
        this.addChild(this.backButtonContainer), this.showWorlds();
    },
    hideWorlds: function(callback, scope) {
        APP.interactiveBackground.accel = -2, TweenLite.to(this.worldsContainer.position, .8, {
            x: -windowWidth / 2,
            y: windowHeight,
            onComplete: function() {
                callback(scope);
            }
        });
    },
    hideLevels: function(callback, scope) {
        APP.interactiveBackground.accel = -2, TweenLite.to(this.currentWorldGraphics.position, .8, {
            x: -windowWidth / 2,
            y: windowHeight,
            onComplete: function() {
                callback(scope);
            }
        });
    },
    showWorlds: function(scope) {
        var self = scope ? scope : this;
        self.currentWorldGraphics && self.currentWorldGraphics.parent && (console.log("removeLevelss"), 
        self.currentWorldGraphics.parent.removeChild(self.currentWorldGraphics)), self.worldsContainer.position.x = windowWidth / 2 - self.worldsContainer.width / 2, 
        self.worldsContainer.position.y = windowHeight / 2 - self.worldsContainer.height / 2, 
        self.addChild(self.worldsContainer), TweenLite.from(self.worldsContainer, .8, {
            x: windowWidth,
            y: -self.worldsContainer.height
        }), TweenLite.to(APP.interactiveBackground, 1.5, {
            accel: 0
        });
    },
    showLevels: function(scope) {
        var self = scope ? scope : this;
        self.worldsContainer && self.worldsContainer.parent && (console.log("removeWorlds"), 
        self.worldsContainer.parent.removeChild(self.worldsContainer)), self.currentWorldGraphics.position.x = windowWidth / 2 - self.currentWorldGraphics.width / 2, 
        self.currentWorldGraphics.position.y = windowHeight / 2 - self.currentWorldGraphics.height / 2, 
        self.addChild(self.currentWorldGraphics), TweenLite.from(self.currentWorldGraphics.position, .8, {
            x: windowWidth,
            y: -self.currentWorldGraphics.height
        }), TweenLite.to(APP.interactiveBackground, 1.5, {
            accel: 0
        });
    },
    backFunction: function(event) {
        var scope = event.target.scope;
        scope.worldOpened && scope.hideLevels(scope.showWorlds, scope);
    },
    getWorlds: function() {
        return this.worlds;
    },
    selectLevel: function(event) {
        APP.currentLevel = event.target.id;
        var scope = event.target.scope;
        scope.hideLevels(function() {
            scope.screenManager.change("Game"), TweenLite.to(APP.interactiveBackground, 1.5, {
                accel: 0
            });
        }, scope);
    },
    selectWorld: function(event) {
        var worldID = event.target.id;
        APP.currentWorld = worldID;
        var scope = event.target.scope;
        scope.worldOpened = !0;
        var worlds = scope.worlds[event.target.id][0];
        scope.currentWorldGraphics = worlds, scope.hideWorlds(scope.showLevels, scope);
    },
    transitionIn: function() {
        this.build();
    },
    transitionOut: function(nextScreen, container) {
        var self = this;
        this.frontShape ? (this.frontShape.parent.setChildIndex(this.frontShape, this.frontShape.parent.children.length - 1), 
        TweenLite.to(this.frontShape, .3, {
            alpha: 1,
            onComplete: function() {
                self.destroy(), container.removeChild(self.getContent()), nextScreen.transitionIn();
            }
        })) : (self.destroy(), container.removeChild(self.getContent()), nextScreen.transitionIn());
    }
}), LoadScreen = AbstractScreen.extend({
    init: function(label) {
        this._super(label), this.isLoaded = !1;
    },
    destroy: function() {
        this._super();
    },
    build: function() {
        this._super();
        var text = new PIXI.Text("PLAY", {
            font: "50px Vagron",
            fill: "#FFFFFF"
        });
        this.addChild(text), text.alpha = 0;
        var assetsToLoader = [];
        assetsToLoader.length > 0 && !this.isLoaded ? (this.loader = new PIXI.AssetLoader(assetsToLoader), 
        this.initLoad()) : this.onAssetsLoaded();
    },
    initLoad: function() {
        var barHeight = 20;
        this.loaderContainer = new PIXI.DisplayObjectContainer(), this.addChild(this.loaderContainer), 
        this.loaderBar = new LifeBarHUD(.6 * windowWidth, barHeight, 0, 16777215, addBright(APP.vecColors[APP.currentColorID], .65)), 
        this.loaderContainer.addChild(this.loaderBar.getContent()), this.loaderBar.getContent().position.x = windowWidth / 2 - this.loaderBar.getContent().width / 2, 
        this.loaderBar.getContent().position.y = windowHeight - this.loaderBar.getContent().height - .1 * windowHeight, 
        this.loaderBar.updateBar(0, 100), this._super();
        var text = new PIXI.Text("PLAY", {
            font: "50px Vagron",
            fill: "#FFFFFF"
        });
        this.addChild(text), text.alpha = 0;
    },
    onProgress: function() {
        this._super(), this.loaderBar.updateBar(Math.floor(100 * this.loadPercent), 100);
    },
    onAssetsLoaded: function() {
        var text = new PIXI.Text("PLAY", {
            font: "50px Vagron",
            fill: "#FFFFFF"
        });
        this.addChild(text), text.alpha = 0, this.ready = !0;
        var self = this;
        this.loaderBar ? TweenLite.to(this.loaderBar.getContent(), .5, {
            delay: .2,
            alpha: 0,
            onComplete: function() {
                self.initApplication();
            }
        }) : TweenLite.to(text, .5, {
            delay: .2,
            alpha: 0,
            onComplete: function() {
                self.initApplication();
            }
        });
    },
    initApplication: function() {
        this.isLoaded = !0;
        this.screenManager.change("Game");
    },
    transitionIn: function() {
        return this.isLoaded ? void this.build() : void this.build();
    },
    transitionOut: function(nextScreen, container) {
        var self = this;
        this.frontShape ? (this.frontShape.parent.setChildIndex(this.frontShape, this.frontShape.parent.children.length - 1), 
        TweenLite.to(this.frontShape, .3, {
            alpha: 1,
            onComplete: function() {
                self.destroy(), container.removeChild(self.getContent()), nextScreen.transitionIn();
            }
        })) : (self.destroy(), container.removeChild(self.getContent()), nextScreen.transitionIn());
    }
}), CreditsModal = Class.extend({
    init: function(screen) {
        this.screen = screen, this.container = new PIXI.DisplayObjectContainer();
        var self = this;
        this.container.buttonMode = !0, this.container.interactive = !0, this.container.mousedown = this.container.touchstart = function(data) {
            self.hide();
        };
        var credits = new SimpleSprite("dist/img/UI/creditos.jpg");
        this.container.addChild(credits.getContent()), scaleConverter(credits.getContent().height, windowHeight, 1, credits), 
        credits.getContent().position.x = windowWidth / 2 - credits.getContent().width / 2, 
        credits.getContent().position.y = windowHeight / 2 - credits.getContent().height / 2;
    },
    show: function(points) {
        this.screen.addChild(this), this.container.parent.setChildIndex(this.container, this.container.parent.children.length - 1);
        var self = this;
        this.screen.updateable = !1, this.container.alpha = 0, TweenLite.to(this.container, .5, {
            alpha: 1,
            onComplete: function() {
                self.container.buttonMode = !0, self.container.interactive = !0;
            }
        }), this.container.buttonMode = !1, this.container.interactive = !1;
    },
    hide: function(callback) {
        var self = this;
        this.container.buttonMode = !1, this.container.interactive = !1, TweenLite.to(this.container, .5, {
            alpha: 0,
            onComplete: function() {
                callback && (callback(), self.container.parent && self.container.parent.removeChild(self.container));
            }
        });
    },
    getContent: function() {
        return this.container;
    }
}), EndModal = Class.extend({
    init: function(screen) {
        this.screen = screen, this.container = new PIXI.DisplayObjectContainer(), this.boxContainer = new PIXI.DisplayObjectContainer(), 
        this.bg = new PIXI.Graphics(), this.bg.beginFill(14370108), this.bg.drawRect(0, 0, windowWidth, windowHeight), 
        this.bg.alpha = .8, this.container.addChild(this.boxContainer);
        var self = this;
        this.backBox = new PIXI.Graphics(), this.backBox.beginFill(14370108), this.backBox.drawRect(0, 0, windowWidth, windowHeight), 
        this.boxContainer.addChild(this.backBox), this.backBox.alpha = 0, this.gameOver = new PIXI.Text("GAME OVER", {
            font: "50px Vagron",
            fill: "#FFF"
        }), scaleConverter(this.gameOver.width, this.boxContainer.width, 1, this.gameOver), 
        this.gameOver.position.y = 0, this.boxContainer.addChild(this.gameOver), this.newHigh = new PIXI.Text("NEW HIGHSCORE", {
            font: "20px Vagron",
            fill: "#FFF"
        }), this.newHigh.position.y = this.gameOver.position.y + this.gameOver.height, this.newHigh.position.x = this.boxContainer.width / 2 - this.newHigh.width / 2, 
        this.boxContainer.addChild(this.newHigh), this.playedLabel = new PIXI.Text("GAMES PLAYED", {
            font: "20px Vagron",
            fill: "#FFF"
        }), this.playedLabel.position.y = this.newHigh.position.y + this.newHigh.height, 
        this.playedLabel.position.x = this.boxContainer.width / 2 - this.playedLabel.width / 2, 
        this.boxContainer.addChild(this.playedLabel), this.playedLabelValue = new PIXI.Text("0", {
            font: "30px Vagron",
            fill: "#FFF"
        }), this.playedLabelValue.position.y = this.playedLabel.position.y + this.playedLabel.height, 
        this.playedLabelValue.position.x = this.boxContainer.width / 2 - this.playedLabelValue.width / 2, 
        this.boxContainer.addChild(this.playedLabelValue), this.score = new PIXI.Text("SCORE", {
            font: "20px Vagron",
            fill: "#FFF"
        }), this.score.position.y = this.playedLabelValue.position.y + this.playedLabelValue.height, 
        this.score.position.x = this.boxContainer.width / 2 - this.score.width / 2, this.boxContainer.addChild(this.score), 
        this.scoreValue = new PIXI.Text("0", {
            font: "30px Vagron",
            fill: "#FFF"
        }), this.scoreValue.position.y = this.score.position.y + this.score.height, this.scoreValue.position.x = this.boxContainer.width / 2 - this.scoreValue.width / 2, 
        this.boxContainer.addChild(this.scoreValue), this.bestScore = new PIXI.Text("BEST SCORE", {
            font: "20px Vagron",
            fill: "#FFF"
        }), this.bestScore.position.y = this.scoreValue.position.y + this.scoreValue.height, 
        this.bestScore.position.x = this.boxContainer.width / 2 - this.bestScore.width / 2, 
        this.boxContainer.addChild(this.bestScore), this.bestScoreValue = new PIXI.Text("0", {
            font: "30px Vagron",
            fill: "#FFF"
        }), this.bestScoreValue.position.y = this.bestScore.position.y + this.bestScore.height, 
        this.bestScoreValue.position.x = this.boxContainer.width / 2 - this.bestScoreValue.width / 2, 
        this.boxContainer.addChild(this.bestScoreValue), this.replayButton = new DefaultButton("UI_button_default_1.png", "UI_button_default_1.png"), 
        this.replayButton.build(), this.replayButton.addLabel(new PIXI.Text("REPLAY", {
            font: "30px Vagron",
            fill: "#db453c"
        }), 25, 2), scaleConverter(this.replayButton.getContent().width, this.boxContainer.width, .5, this.replayButton), 
        this.replayButton.setPosition(this.boxContainer.width / 2 - this.replayButton.getContent().width / 2, this.bestScoreValue.position.y + this.bestScoreValue.height), 
        this.replayButton.clickCallback = function() {
            self.hide(function() {
                self.screen.updateable = !0, self.screen.startGame();
            });
        }, this.boxContainer.addChild(this.replayButton.getContent()), this.newSeed = new DefaultButton("UI_button_default_1.png", "UI_button_default_1.png"), 
        this.newSeed.build(), this.newSeed.addLabel(new PIXI.Text("NEW", {
            font: "30px Vagron",
            fill: "#db453c"
        }), 45, 2), scaleConverter(this.newSeed.getContent().width, this.boxContainer.width, .5, this.newSeed), 
        this.newSeed.setPosition(this.boxContainer.width / 2 - this.newSeed.getContent().width / 2, this.replayButton.getContent().position.y + this.replayButton.getContent().height + 20), 
        this.newSeed.clickCallback = function() {
            self.hide(function() {
                self.screen.updateable = !0, APP.seed.seed = 65535 * Math.random(), self.screen.startGame();
            });
        }, this.boxContainer.addChild(this.newSeed.getContent()), this.shopButton = new DefaultButton("UI_button_default_1.png", "UI_button_default_1.png"), 
        this.shopButton.build(), this.shopButton.addLabel(new PIXI.Text("SHOP", {
            font: "30px Vagron",
            fill: "#db453c"
        }), 45, 2), scaleConverter(this.shopButton.getContent().width, this.boxContainer.width, .5, this.shopButton), 
        this.shopButton.setPosition(this.boxContainer.width / 2 - this.shopButton.getContent().width / 2, this.newSeed.getContent().position.y + this.newSeed.getContent().height + 20), 
        this.shopButton.clickCallback = function() {
            self.screen.screenManager.change("Choice");
        }, this.boxContainer.addChild(this.shopButton.getContent()), this.shareButton = new DefaultButton("UI_button_default_1.png", "UI_button_default_1.png"), 
        this.shareButton.build(), this.shareButton.addLabel(new PIXI.Text("SHARE", {
            font: "30px Vagron",
            fill: "#db453c"
        }), 30, 2), scaleConverter(this.shareButton.getContent().width, this.boxContainer.width, .5, this.shareButton), 
        this.shareButton.setPosition(this.boxContainer.width / 2 - this.shareButton.getContent().width / 2, this.shopButton.getContent().position.y + this.shopButton.getContent().height + 20), 
        this.shareButton.clickCallback = function() {}, this.boxContainer.addChild(this.shareButton.getContent()), 
        this.rateButton = new DefaultButton("UI_button_default_1.png", "UI_button_default_1.png"), 
        this.rateButton.build(), this.rateButton.addLabel(new PIXI.Text("RATE", {
            font: "30px Vagron",
            fill: "#db453c"
        }), 45, 2), scaleConverter(this.rateButton.getContent().width, this.boxContainer.width, .5, this.rateButton), 
        this.rateButton.setPosition(this.boxContainer.width / 2 - this.rateButton.getContent().width / 2, this.shareButton.getContent().position.y + this.shareButton.getContent().height + 20), 
        this.rateButton.clickCallback = function() {}, this.boxContainer.addChild(this.rateButton.getContent()), 
        this.backBox.height = this.boxContainer.height, scaleConverter(this.boxContainer.height, windowHeight, .9, this.boxContainer);
    },
    show: function() {
        this.screen.addChild(this), this.screen.blockPause = !0, this.boxContainer.visible = !0, 
        this.container.parent.setChildIndex(this.container, this.container.parent.children.length - 1), 
        APP.highScore < APP.currentPoints ? (APP.highScore = APP.currentPoints, this.newHigh.alpha = 1) : this.newHigh.alpha = 0, 
        this.scoreValue.setText(APP.currentPoints), this.bestScoreValue.setText(APP.highScore), 
        this.playedLabelValue.setText(APP.plays), this.scoreValue.position.x = windowWidth / 2 - this.scoreValue.width / 2, 
        this.bestScoreValue.position.x = windowWidth / 2 - this.bestScoreValue.width / 2, 
        this.playedLabelValue.position.x = windowWidth / 2 - this.playedLabelValue.width / 2, 
        this.boxContainer.position.x = windowWidth / 2 - this.boxContainer.width / 2, this.boxContainer.position.y = windowHeight / 2 - this.boxContainer.height / 2, 
        this.bg.alpha = .8, this.boxContainer.alpha = 1, TweenLite.from(this.bg, .5, {
            alpha: 0
        }), TweenLite.from(this.boxContainer, .5, {
            y: -this.boxContainer.height
        }), console.log("show"), APP.appModel.saveScore();
    },
    hide: function(callback) {
        var self = this;
        this.screen.blockPause = !1, this.screen.updateable = !0, TweenLite.to(this.bg, .5, {
            delay: .1,
            alpha: 0,
            onComplete: function() {
                self.container.parent && self.container.parent.removeChild(self.container), callback && callback();
            }
        }), TweenLite.to(this.boxContainer.position, .5, {
            y: -this.boxContainer.height,
            ease: "easeInBack"
        }), TweenLite.to(this.boxContainer, .5, {
            alpha: 0
        }), TweenLite.to(this.bg, .5, {
            alpha: 0
        });
    },
    getContent: function() {
        return this.container;
    }
}), NewBirdModal = Class.extend({
    init: function(screen) {
        this.screen = screen, this.container = new PIXI.DisplayObjectContainer(), this.boxContainer = new PIXI.DisplayObjectContainer(), 
        this.bg = new PIXI.Graphics(), this.bg.beginFill(74275), this.bg.drawRect(0, 0, windowWidth, windowHeight), 
        this.bg.alpha = 0, this.container.addChild(this.bg), this.container.addChild(this.boxContainer);
        this.feito = new SimpleSprite("feitoo.png"), this.container.addChild(this.feito.getContent()), 
        scaleConverter(this.feito.getContent().width, windowWidth, .35, this.feito), this.feito.setPosition(windowWidth / 2 - this.feito.getContent().width / 2, -10), 
        this.boxContainer.alpha = 0, this.boxContainer.visible = !1, scaleConverter(this.boxContainer.height, windowHeight, .18, this.boxContainer), 
        this.boxContainer.position.x = windowWidth / 2 - this.boxContainer.width / 2, this.boxContainer.position.y = windowHeight;
    },
    show: function(bird) {
        if (bird || (bird = [ APP.getGameModel().birdModels[Math.floor(Math.random() * APP.getGameModel().birdModels.length)] ]), 
        bird && bird.length > 0) {
            var self = this;
            this.newCharContainer = new PIXI.DisplayObjectContainer();
            var pista = new SimpleSprite("pista.png"), holofote = new SimpleSprite("holofote.png"), novo = new SimpleSprite("nova_ave.png"), ovoquebrado = new SimpleSprite("ovoquebrado.png"), penas1 = new SimpleSprite("penasfundo1.png"), penas2 = new SimpleSprite("penasfundo2.png");
            this.playerImage = null, this.playerImage = new SimpleSprite(bird[0].cover);
            var degrade = new SimpleSprite("dist/img/UI/fundo_degrade.png");
            this.container.addChild(degrade.getContent()), degrade.getContent().width = windowWidth / 1.5;
            var sH = scaleConverter(degrade.getContent().height, windowHeight, 1);
            degrade.getContent().scale.y = sH, degrade.getContent().height = windowHeight, degrade.setPosition(windowWidth / 2 - degrade.getContent().width / 2, windowHeight / 2 - degrade.getContent().height / 2), 
            this.newCharContainer.addChild(pista.getContent()), pista.setPosition(0, holofote.getContent().height - 35), 
            this.newCharContainer.addChild(holofote.getContent()), this.newCharContainer.addChild(ovoquebrado.getContent()), 
            this.newCharContainer.addChild(penas1.getContent()), this.newCharContainer.addChild(penas2.getContent()), 
            this.container.addChild(this.playerImage.getContent()), this.newCharContainer.addChild(novo.getContent()), 
            holofote.setPosition(pista.getContent().width / 2 - holofote.getContent().width / 2, 0);
            var charLabel = new PIXI.Text(bird[0].label, {
                align: "center",
                fill: "#FFFFFF",
                stroke: "#033E43",
                strokeThickness: 5,
                font: "30px Luckiest Guy",
                wordWrap: !0,
                wordWrapWidth: 500
            });
            this.newCharContainer.addChild(charLabel), this.container.addChild(this.newCharContainer), 
            charLabel.position.x = pista.getContent().width / 2 - charLabel.width / 2, charLabel.position.y = pista.getContent().position.y + pista.getContent().height - charLabel.height - 20, 
            novo.setPosition(pista.getContent().width / 2 - novo.getContent().width / 2, charLabel.position.y - novo.getContent().height - 20), 
            scaleConverter(ovoquebrado.getContent().height, this.newCharContainer.height, .15, ovoquebrado), 
            scaleConverter(penas1.getContent().height, this.newCharContainer.height, .2, penas1), 
            scaleConverter(penas2.getContent().height, this.newCharContainer.height, .2, penas2), 
            penas1.setPosition(pista.getContent().width / 2 - 2 * penas1.getContent().width, holofote.getContent().height - penas1.getContent().height), 
            penas2.setPosition(pista.getContent().width / 2 + penas1.getContent().width, holofote.getContent().height - penas2.getContent().height), 
            ovoquebrado.setPosition(pista.getContent().width / 2 - ovoquebrado.getContent().width / 2, holofote.getContent().height - ovoquebrado.getContent().height), 
            scaleConverter(this.newCharContainer.height, windowHeight, 1, this.newCharContainer), 
            this.playerImage.setPosition(windowWidth / 2 - this.playerImage.getContent().width / 2, windowHeight / 2 - this.playerImage.getContent().height / 2 - 20), 
            this.newCharContainer.position.x = windowWidth / 2 - this.newCharContainer.width / 2, 
            this.feito.getContent().parent.setChildIndex(this.feito.getContent(), this.feito.getContent().parent.children.length - 1), 
            setTimeout(function() {
                self.container.buttonMode = !0, self.container.interactive = !0, self.container.mousedown = self.container.touchstart = function(data) {
                    self.hide(function() {
                        self.screen.updateable = !0;
                    });
                };
            }, 2e3);
        }
        this.screen.addChild(this), this.screen.updateable = !1, TweenLite.to(this.bg, .5, {
            alpha: .8
        }), this.container.parent.setChildIndex(this.container, this.container.parent.children.length - 1), 
        this.playerImage.getContent().parent.setChildIndex(this.playerImage.getContent(), this.playerImage.getContent().parent.children.length - 1);
    },
    hide: function(callback) {
        var self = this;
        TweenLite.to(this.bg, .5, {
            alpha: 0,
            onComplete: function() {
                callback && (callback(), self.container.parent && self.container.parent.removeChild(self.container));
            }
        }), TweenLite.to(this.boxContainer.position, 1, {
            y: -this.boxContainer.height,
            ease: "easeInBack"
        }), TweenLite.to(this.boxContainer, .5, {
            alpha: 0
        }), TweenLite.to(this.container, .5, {
            alpha: 0
        });
    },
    getContent: function() {
        return this.container;
    }
}), PauseModal = Class.extend({
    init: function(screen) {
        this.screen = screen, this.container = new PIXI.DisplayObjectContainer(), this.boxContainer = new PIXI.DisplayObjectContainer(), 
        this.bg = new PIXI.Graphics(), this.bg.beginFill(1383495), this.bg.drawRect(0, 0, windowWidth, windowHeight), 
        this.bg.alpha = .8, this.container.addChild(this.bg), this.container.addChild(this.boxContainer);
        var self = this;
        this.back = new SimpleSprite("UI_modal_back_1.png"), this.boxContainer.addChild(this.back.getContent());
        var thirdPart = this.back.getContent().width / 3;
        this.backButton = new DefaultButton("UI_button_play_1.png", "UI_button_play_1.png"), 
        this.backButton.build(), this.backButton.setPosition(1 * thirdPart - thirdPart / 2 - this.backButton.getContent().width / 2, this.back.getContent().height / 2 - this.backButton.getContent().height / 2), 
        this.backButton.clickCallback = function() {
            self.hide(function() {
                self.screen.screenManager.prevScreen();
            });
        }, this.back.getContent().addChild(this.backButton.getContent()), this.continueButton = new DefaultButton("UI_button_play_1_retina.png", "UI_button_play_1_over_retina.png"), 
        this.continueButton.build(), scaleConverter(this.continueButton.getContent().width, this.back.getContent().width, .3, this.continueButton), 
        this.continueButton.setPosition(2 * thirdPart - thirdPart / 2 - this.continueButton.getContent().width / 2, this.back.getContent().height / 2 - this.continueButton.getContent().height / 2), 
        this.continueButton.clickCallback = function() {
            self.hide(function() {
                self.screen.updateable = !0;
            });
        }, this.back.getContent().addChild(this.continueButton.getContent()), this.restartButton = new DefaultButton("UI_button_play_1.png", "UI_button_play_1.png"), 
        this.restartButton.build(), this.restartButton.setPosition(3 * thirdPart - thirdPart / 2 - this.restartButton.getContent().width / 2, this.back.getContent().height / 2 - this.restartButton.getContent().height / 2), 
        this.restartButton.clickCallback = function() {
            self.hide(function() {
                self.screen.updateable = !0, self.screen.reset();
            });
        }, this.back.getContent().addChild(this.restartButton.getContent()), scaleConverter(this.boxContainer.width, windowWidth, .8, this.boxContainer);
    },
    show: function() {
        this.screen.addChild(this), this.screen.blockPause = !0, this.boxContainer.visible = !0, 
        this.container.parent.setChildIndex(this.container, this.container.parent.children.length - 1), 
        this.screen.updateable = !1, this.boxContainer.position.x = windowWidth / 2 - this.boxContainer.width / 2, 
        this.boxContainer.position.y = windowHeight / 2 - this.boxContainer.height / 2, 
        this.bg.alpha = .8, this.boxContainer.alpha = 1, TweenLite.from(this.bg, .5, {
            alpha: 0
        }), TweenLite.from(this.boxContainer, .5, {
            y: -this.boxContainer.height
        });
    },
    hide: function(callback) {
        var self = this;
        this.screen.blockPause = !1, this.screen.updateable = !0, TweenLite.to(this.bg, .5, {
            delay: .1,
            alpha: 0,
            onComplete: function() {
                self.container.parent && self.container.parent.removeChild(self.container), callback && callback(), 
                self.kill = !0;
            }
        }), TweenLite.to(this.boxContainer.position, .5, {
            y: -this.boxContainer.height,
            ease: "easeInBack"
        }), TweenLite.to(this.boxContainer, .5, {
            alpha: 0
        });
    },
    getContent: function() {
        return this.container;
    }
}), RankinkgModal = Class.extend({
    init: function(screen) {
        this.screen = screen, this.container = new PIXI.DisplayObjectContainer();
        var self = this;
        this.container.buttonMode = !0, this.container.interactive = !0, this.container.mousedown = this.container.touchstart = function(data) {
            self.hide();
        };
        var credits = new SimpleSprite("dist/img/UI/creditos.jpg");
        this.container.addChild(credits.getContent()), scaleConverter(credits.getContent().height, windowHeight, 1, credits), 
        credits.getContent().position.x = windowWidth / 2 - credits.getContent().width / 2, 
        credits.getContent().position.y = windowHeight / 2 - credits.getContent().height / 2;
    },
    show: function(points) {
        this.screen.addChild(this), this.container.parent.setChildIndex(this.container, this.container.parent.children.length - 1);
        var self = this;
        this.screen.updateable = !1, this.container.alpha = 0, TweenLite.to(this.container, .5, {
            alpha: 1,
            onComplete: function() {
                self.container.buttonMode = !0, self.container.interactive = !0;
            }
        }), this.container.buttonMode = !1, this.container.interactive = !1;
    },
    hide: function(callback) {
        var self = this;
        this.container.buttonMode = !1, this.container.interactive = !1, TweenLite.to(this.container, .5, {
            alpha: 0,
            onComplete: function() {
                callback && (callback(), self.container.parent && self.container.parent.removeChild(self.container));
            }
        });
    },
    getContent: function() {
        return this.container;
    }
}), InputManager = Class.extend({
    init: function(parent) {
        var game = parent, self = this;
        this.vecPositions = [], document.body.addEventListener("mouseup", function(e) {
            game.player && (game.mouseDown = !1);
        }), document.body.addEventListener("mousedown", function(e) {
            game.player && APP.getMousePos().x < windowWidth && APP.getMousePos().y < windowHeight - 70 && (game.mouseDown = !0);
        }), document.body.addEventListener("keyup", function(e) {
            if (game.player) {
                if (87 === e.keyCode || 38 === e.keyCode && game.player.velocity.y < 0) self.removePosition("up"); else if (83 === e.keyCode || 40 === e.keyCode && game.player.velocity.y > 0) self.removePosition("down"); else if (65 === e.keyCode || 37 === e.keyCode && game.player.velocity.x < 0) self.removePosition("left"); else if (68 === e.keyCode || 39 === e.keyCode && game.player.velocity.x > 0) self.removePosition("right"); else if (32 === e.keyCode) game.player.hurt(5); else if (49 === e.keyCode || 50 === e.keyCode || 51 === e.keyCode || 52 === e.keyCode || 81 === e.keyCode || 69 === e.keyCode) {
                    var id = 1;
                    50 === e.keyCode ? id = 2 : 51 === e.keyCode ? id = 3 : 52 === e.keyCode && (id = 4), 
                    game.useShortcut(id - 1);
                }
                game.player.updatePlayerVel(self.vecPositions);
            }
        }), document.body.addEventListener("keydown", function(e) {
            game.player && (87 === e.keyCode || 38 === e.keyCode ? (self.removePosition("down"), 
            self.addPosition("up")) : 83 === e.keyCode || 40 === e.keyCode ? (self.removePosition("up"), 
            self.addPosition("down")) : 65 === e.keyCode || 37 === e.keyCode ? (self.removePosition("right"), 
            self.addPosition("left")) : (68 === e.keyCode || 39 === e.keyCode) && (self.removePosition("left"), 
            self.addPosition("right")), game.player.updatePlayerVel(self.vecPositions));
        });
    },
    removePosition: function(position) {
        for (var i = this.vecPositions.length - 1; i >= 0; i--) this.vecPositions[i] === position && this.vecPositions.splice(i, 1);
    },
    addPosition: function(position) {
        for (var exists = !1, i = this.vecPositions.length - 1; i >= 0; i--) this.vecPositions[i] === position && (exists = !0);
        exists || this.vecPositions.push(position);
    }
}), CookieManager = Class.extend({
    init: function() {
        function getLocalStorage() {
            try {
                if (window.localStorage) return window.localStorage;
            } catch (e) {
                return void 0;
            }
        }
        this.db = getLocalStorage();
    },
    setCookie: function(cname, cvalue, exdays) {
        var d = new Date(), days = exdays ? exdays : 5e4;
        d.setTime(d.getTime() + 24 * days * 60 * 60 * 1e3);
        "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + days;
    },
    getCookie: function(name) {
        return (name = new RegExp("(?:^|;\\s*)" + ("" + name).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + "=([^;]*)").exec(document.cookie)) && name[1];
    },
    setSafeCookie: function(key, value) {
        window.localStorage.setItem(key, value);
    },
    getSafeCookie: function(key, callback) {
        var value = window.localStorage.getItem(key);
        return value;
    }
}), Environment = Class.extend({
    init: function(maxWidth, maxHeight) {
        this.velocity = {
            x: 0,
            y: 0
        }, this.texture = "", this.sprite = "", this.container = new PIXI.DisplayObjectContainer(), 
        this.updateable = !0, this.arraySprt = [], this.maxWidth = maxWidth, this.maxHeight = maxHeight, 
        this.texWidth = 0, this.spacing = 0, this.totTiles = 0, this.currentSprId = 0;
    },
    build: function(imgs, spacing) {
        this.arraySprt = imgs, spacing && (this.spacing = spacing);
        for (var i = Math.floor(this.arraySprt.length * Math.random()); i < this.arraySprt.length && !(this.container.width > this.maxWidth); i++) this.currentSprId = i, 
        this.addEnv();
    },
    addEnv: function() {
        this.sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(this.arraySprt[this.currentSprId])), 
        this.sprite.cacheAsBitmap = !0;
        var last = this.container.children[this.container.children.length - 1];
        last && (this.sprite.position.x = last.position.x + last.width - 2), this.sprite.position.y = this.maxHeight - this.sprite.height, 
        this.container.addChild(this.sprite);
    },
    update: function() {
        if (this.container.children) {
            for (var i = this.container.children.length - 1; i >= 0; i--) this.container.children[i].position.x + this.container.children[i].width < 0 && this.container.removeChild(this.container.children[i]), 
            this.container.children[i].position.x += this.velocity.x;
            var last = this.container.children[this.container.children.length - 1];
            last.position.x + last.width - 20 < this.maxWidth && (this.currentSprId++, this.currentSprId >= this.arraySprt.length && (this.currentSprId = 0), 
            this.addEnv());
        }
    },
    getContent: function() {
        return this.container;
    }
}), Paralax = Class.extend({
    init: function(maxWidth) {
        this.velocity = {
            x: 0,
            y: 0
        }, this.texture = "", this.sprite = "", this.container = new PIXI.DisplayObjectContainer(), 
        this.updateable = !0, this.arraySprt = [], this.maxWidth = maxWidth, this.texWidth = 0, 
        this.spacing = 0, this.totTiles = 0;
    },
    build: function(img, spacing) {
        spacing && (this.spacing = spacing), this.texture = PIXI.Texture.fromFrame(img), 
        this.texWidth = this.texture.width, this.totTiles = Math.ceil(this.maxWidth / this.texWidth) + 1;
        for (var i = 0; i < this.totTiles; i++) this.sprite = new PIXI.Sprite(this.texture), 
        this.sprite.position.x = (this.texWidth + this.spacing) * i, this.container.addChild(this.sprite);
        console.log("this");
    },
    update: function() {
        Math.abs(this.container.position.x + this.velocity.x) >= this.texWidth + this.totTiles * this.spacing ? this.container.position.x = 0 : this.container.position.x += this.velocity.x, 
        this.container.position.y += this.velocity.y;
    },
    getContent: function() {
        return this.container;
    }
}), Particles = Entity.extend({
    init: function(vel, timeLive, source, rotation) {
        this._super(!0), this.updateable = !1, this.colidable = !1, this.deading = !1, this.range = 40, 
        this.width = 1, this.height = 1, this.type = "particle", this.target = "enemy", 
        this.fireType = "physical", this.node = null, this.velocity.x = vel.x, this.velocity.y = vel.y, 
        this.timeLive = timeLive, this.power = 1, this.defaultVelocity = 1, this.imgSource = source, 
        this.alphadecress = .03, this.scaledecress = .03, this.gravity = 0, rotation && (this.rotation = rotation), 
        this.maxScale = 1, this.growType = 1, this.maxInitScale = 1, this.initScale = 1;
    },
    build: function() {
        this.updateable = !0, this.imgSource instanceof PIXI.Text || this.imgSource instanceof PIXI.Graphics ? this.sprite = this.imgSource : (this.sprite = new PIXI.Sprite.fromFrame(this.imgSource), 
        this.sprite.anchor.x = .5, this.sprite.anchor.y = .5), this.sprite.alpha = 1, this.sprite.scale.x = this.initScale, 
        this.sprite.scale.y = this.initScale, -1 === this.growType && (this.sprite.scale.x = this.maxScale, 
        this.sprite.scale.y = this.maxScale), this.getContent().rotation = this.rotation;
    },
    update: function() {
        this._super(), 0 !== this.gravity && (this.velocity.y += this.gravity), this.timeLive--, 
        this.timeLive <= 0 && this.preKill(), this.range = this.width, this.rotation && (this.getContent().rotation += this.rotation), 
        this.sprite.alpha > 0 && (this.sprite.alpha -= this.alphadecress, this.sprite.alpha <= 0 && this.preKill()), 
        this.sprite.scale.x < 0 && this.preKill(), this.sprite.scale.x > this.maxScale || (this.sprite.scale.x += this.scaledecress, 
        this.sprite.scale.y += this.scaledecress);
    },
    preKill: function() {
        this.sprite.alpha = 0, this.updateable = !0, this.kill = !0;
    }
}), res = {
    x: window.innerWidth,
    y: window.innerHeight
};

testMobile() && (res = {
    x: window.innerWidth,
    y: window.innerHeight
});

var resizeProportional = !0, windowWidth = res.x, windowHeight = res.y, realWindowWidth = res.x, realWindowHeight = res.y, gameScale = 1, screenOrientation = "portait", windowWidthVar = window.innerWidth, windowHeightVar = window.innerHeight, gameView = document.getElementById("game");

testMobile() || (document.body.className = "");

var ratio = 1, init = !1, renderer, APP, retina = window.devicePixelRatio >= 2 ? 2 : 1, isCordova = -1 === document.URL.indexOf("http://") && -1 === document.URL.indexOf("https://"), initialize = function() {
    PIXI.BaseTexture.SCALE_MODE = PIXI.scaleModes.NEAREST, requestAnimFrame(update);
}, isfull = !1, apps = -1 === document.URL.indexOf("http://") && -1 === document.URL.indexOf("https://");

apps ? document.addEventListener("deviceready", deviceReady) : setTimeout(deviceReady, 500);