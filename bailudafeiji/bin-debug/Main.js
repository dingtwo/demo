//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        //工具
        this.util = new Utils();
        this.enemys = [];
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    p.createGameScene = function () {
        console.log("你好");
        //背景图
        this.sky = this.createBitmapByName("background_2_png");
        this.addChild(this.sky);
        this.sky.width = this.stage.stageWidth;
        this.sky.height = this.stage.stageHeight;
        this.sky_1 = this.createBitmapByName("background_2_png");
        this.addChild(this.sky_1);
        this.sky_1.width = this.stage.stageWidth;
        this.sky_1.height = this.stage.stageHeight;
        this.sky_1.y = -this.stage.stageHeight;
        this.backAnimation();
        //hero
        var hero = new Hero();
        this.hero = hero;
        hero.x = this.stage.stageWidth / 2 - hero.width / 2;
        hero.y = this.stage.stageHeight - 100;
        this.addChild(hero);
        //敌机
        var enemyTimer = new egret.Timer(500);
        enemyTimer.addEventListener(egret.TimerEvent.TIMER, this.addEnemy, this);
        enemyTimer.start();
        this.addEventListener(egret.Event.ENTER_FRAME, this.checkHit, this);
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 背景图动画
     */
    p.backAnimation = function () {
        var self = this;
        var y = 0;
        var change = function () {
            y++;
            if (y >= self.stage.stageHeight) {
                y = 0;
            }
            var tw = egret.Tween.get(self.sky);
            tw.to({ y: y }, 1);
            tw.call(change, self);
        };
        var change1 = function () {
            var tw_1 = egret.Tween.get(self.sky_1);
            tw_1.to({
                y: y - self.stage.stageHeight
            }, 1);
            tw_1.call(change1, self);
        };
        change();
        change1();
    };
    p.addEnemy = function () {
        var enemy = new Enemy();
        this.enemys.push(enemy);
        this.addChild(enemy);
        enemy.setFrame();
        this.removeEnemy();
    };
    //超出的删除
    p.removeEnemy = function () {
        for (var i = 0; i < this.enemys.length; i++) {
            if (this.enemys[i].y >= this.stage.stageHeight) {
                var index = this.getChildIndex(this.enemys[i]);
                this.removeChildAt(index);
                this.enemys.splice(i, 1);
                i--;
            }
        }
    };
    //子弹与敌机的碰撞检测
    p.checkHit = function () {
        for (var i = 0; i < this.enemys.length; i++) {
            for (var j = 0; j < this.hero.bullets.length; j++) {
                var bullet = this.hero.bullets[j];
                var enemy = this.enemys[i];
                var isHit = enemy.hitTestPoint(bullet.x, bullet.y);
                if (isHit) {
                    this.removeChild(enemy);
                    this.enemys.splice(i, 1);
                    i--;
                    break;
                }
            }
        }
    };
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
//# sourceMappingURL=Main.js.map