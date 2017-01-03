var Utils = (function () {
    function Utils() {
    }
    var d = __define,c=Utils,p=c.prototype;
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    p.rand = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + 1;
    };
    return Utils;
}());
egret.registerClass(Utils,'Utils');
//# sourceMappingURL=Utils.js.map