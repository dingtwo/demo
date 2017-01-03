var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet(x, y) {
        _super.call(this);
        this.util = new Utils();
        this.x = x;
        this.y = y;
        var bullet = this.util.createBitmapByName("bullet1_png");
        this.addChild(bullet);
        this.addEventListener(egret.Event.ENTER_FRAME, this.move, this);
    }
    var d = __define,c=Bullet,p=c.prototype;
    p.move = function () {
        this.y -= 5;
    };
    return Bullet;
}(egret.DisplayObjectContainer));
egret.registerClass(Bullet,'Bullet');
//# sourceMappingURL=Bullet.js.map