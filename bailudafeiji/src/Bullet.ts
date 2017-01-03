class Bullet extends egret.DisplayObjectContainer {
	private util: Utils = new Utils();
	public constructor(x: number, y: number) {
		super();

		this.x = x;
		this.y = y;
		var bullet = this.util.createBitmapByName("bullet1_png");
		this.addChild(bullet);
		this.addEventListener(egret.Event.ENTER_FRAME, this.move, this);
	}

	private move(): void {
		this.y -= 5;
	}
}