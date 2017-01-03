class Utils {
	public constructor() {
	}
	public createBitmapByName(name:string):egret.Bitmap {
        let result = new egret.Bitmap();
        let texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    public rand(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min)) + 1;
	}
}