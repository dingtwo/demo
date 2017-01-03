class Enemy extends egret.DisplayObjectContainer {
	private util: Utils = new Utils();
	public constructor() {
		super();
		var enemyImg = this.util.createBitmapByName("enemy1_fly_1_png");
		this.addChild(enemyImg);
		this.addEventListener(egret.Event.ENTER_FRAME, this.move, this);
	}
	public setFrame(): void {
		this.x = this.util.rand(0, this.parent.stage.stageWidth);
		this.y = -this.height;
	}
	private move(): void {
		this.y += 5;
	}
}