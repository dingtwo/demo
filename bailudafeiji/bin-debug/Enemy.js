var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy() {
        _super.call(this);
        this.util = new Utils();
        var enemyImg = this.util.createBitmapByName("enemy1_fly_1_png");
        this.addChild(enemyImg);
        this.addEventListener(egret.Event.ENTER_FRAME, this.move, this);
    }
    var d = __define,c=Enemy,p=c.prototype;
    p.setFrame = function () {
        this.x = this.util.rand(0, this.parent.stage.stageWidth);
        this.y = -this.height;
    };
    p.move = function () {
        this.y += 5;
    };
    return Enemy;
}(egret.DisplayObjectContainer));
egret.registerClass(Enemy,'Enemy');
//# sourceMappingURL=Enemy.js.map