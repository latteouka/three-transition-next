import { Util } from "../libs/util";

export class Conf {
  private static _instance: Conf;

  // #############################################
  // 本番フラグ
  // #############################################
  public IS_BUILD: boolean = false;

  // テスト用 パラメータ
  public FLG_PARAM: boolean = this.IS_BUILD ? false : true;
  public FLG_LOW_FPS: boolean = this.IS_BUILD ? false : false;
  public FLG_DEBUG_TXT: boolean = this.IS_BUILD ? false : false;
  public FLG_STATS: boolean = this.IS_BUILD ? false : true;

  // パス
  public PATH_IMG: string = "./assets/img/";

  // タッチデバイス
  public USE_TOUCH: boolean = Util.instance.isTouchDevice();

  // ブレイクポイント
  public BREAKPOINT: number = 768;

  // PSDサイズ
  public LG_PSD_WIDTH: number = 1600;
  public XS_PSD_WIDTH: number = 750;

  constructor() {}
  public static get instance(): Conf {
    if (!this._instance) {
      this._instance = new Conf();
    }
    return this._instance;
  }
}
