var Hero = (function (_super) {
    __extends(Hero, _super);
    function Hero() {
        _super.call(this);
        this.util = new Utils();
        this.bullets = [];
        //hero
        var hero_1 = this.util.createBitmapByName("hero_fly_1_png");
        var hero_2 = this.util.createBitmapByName("hero_fly_2_png");
        this.hero_1 = hero_1;
        this.hero_2 = hero_2;
        this.addChild(hero_1);
        this.addChild(hero_2);
        this.setFrame();
        //飞机添加事件
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.planeMove, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        //背景动
        var timer = new egret.Timer(1000);
        timer.addEventListener(egret.TimerEvent.TIMER, this.fly, this);
        timer.start();
        //子弹
        var biuTimer = new egret.Timer(500);
        biuTimer.addEventListener(egret.TimerEvent.TIMER, this.biubiubiu, this);
        biuTimer.start();
    }
    var d = __define,c=Hero,p=c.prototype;
    p.setFrame = function () {
        this.hero_1.x = this.x;
        this.hero_1.y = this.y;
        this.hero_2.x = this.x;
        this.hero_2.y = this.y;
    };
    /**
     * 换图动画, 不好用
     */
    p.fly = function () {
        var i = this.getChildIndex(this.hero_1);
        // console.log(i);
        // console.log(this.getChildIndex(this.hero_2));
        i = 1 - i;
        this.setChildIndex(this.hero_1, i);
        this.setChildIndex(this.hero_2, 1 - i);
    };
    p.touchBegin = function (event) {
        //记录初始偏移
        this.touchX = event.localX;
        this.touchY = event.localY;
    };
    p.touchEnd = function (event) {
    };
    /**
     * 手势移动飞机随动
     */
    p.planeMove = function (event) {
        this.x = event.stageX - this.touchX;
        this.y = event.stageY - this.touchY;
        console.log(this.stage);
    };
    //添加子弹
    p.biubiubiu = function () {
        var bullet = new Bullet(this.x + this.width / 2, this.y);
        this.parent.addChild(bullet);
        this.bullets.push(bullet);
    };
    return Hero;
}(egret.DisplayObjectContainer));
egret.registerClass(Hero,'Hero');
//# sourceMappingURL=Hero.js.map