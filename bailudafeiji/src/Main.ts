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

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView:LoadingUI;

    //工具
    private util: Utils = new Utils();
    //背景
    private sky: egret.Bitmap;
    private sky_1: egret.Bitmap;
    private hero: Hero;
    private enemys: Array<Enemy> = [];


    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event:RES.ResourceEvent):void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }


    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield:egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene():void {
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
        var hero: Hero = new Hero();
        this.hero = hero;
        hero.x = this.stage.stageWidth/2 - hero.width/2;
        hero.y = this.stage.stageHeight - 100;
        this.addChild(hero);

        //敌机
        var enemyTimer: egret.Timer = new egret.Timer(500);
        enemyTimer.addEventListener(egret.TimerEvent.TIMER, this.addEnemy, this); 
        enemyTimer.start();

        this.addEventListener(egret.Event.ENTER_FRAME, this.checkHit, this);
    

    }

    

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name:string):egret.Bitmap {
        let result = new egret.Bitmap();
        let texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 背景图动画
     */
    private backAnimation(): void {
        var self = this;
        let y = 0;
        let change:Function = function () {
            y++;
            if (y >= self.stage.stageHeight) {
                y = 0;
            }
            let tw = egret.Tween.get(self.sky);
            
            tw.to({y: y}, 1);
            tw.call(change, self);
        };

        let change1: Function = function() {
            let tw_1 = egret.Tween.get(self.sky_1);
            tw_1.to({
                y: y-self.stage.stageHeight
            }, 1);
            tw_1.call(change1, self);
        }

        change();
        change1();
    }
    

    private addEnemy(): void {
        var enemy: Enemy = new Enemy();
        this.enemys.push(enemy);
        this.addChild(enemy);
        enemy.setFrame();
        this.removeEnemy();
    }

    //超出的删除
    private removeEnemy(): void {
        for(let i = 0;i < this.enemys.length; i++){
            if(this.enemys[i].y >= this.stage.stageHeight) {
                let index = this.getChildIndex(this.enemys[i]);
                this.removeChildAt(index);
                this.enemys.splice(i, 1);
                i--; 
            }
        }
    }

    //子弹与敌机的碰撞检测
    private checkHit(): void {
        for(let i = 0; i < this.enemys.length; i++){
            for(let j = 0; j < this.hero.bullets.length; j++){
                var bullet = this.hero.bullets[j];
                var enemy = this.enemys[i];
                var isHit: boolean = enemy.hitTestPoint(bullet.x, bullet.y);
                if(isHit) {
                    this.removeChild(enemy);
                    this.enemys.splice(i, 1);
                    i--;
                    break;
                }
            }
        }
    }
}


