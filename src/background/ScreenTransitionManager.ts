import { OGLRenderingContext, Texture } from "ogl";
import LerpedValue from "./LerpedValue";

interface ScreenContent {
  color: Texture;
  depth: Texture;
}

class ScreenTransitionManager {
  private transitionQueue: ScreenContent[];

  private hasCurrentScreen: boolean;
  private currentScreen: ScreenContent;
  private backupTextures: ScreenContent;

  private transitionProgress: LerpedValue;

  constructor(gl: OGLRenderingContext) {
    this.hasCurrentScreen = false;

    const emptyTextures = {
      color: new Texture(gl),
      depth: new Texture(gl),
    };
    this.currentScreen = { ...emptyTextures };
    this.backupTextures = { ...emptyTextures };
    this.transitionQueue = [];

    this.transitionProgress = new LerpedValue(0, 0.2);
  }

  public getProgress(): number {
    return this.transitionProgress.get();
  }

  public getStartTexture(): ScreenContent {
    return this.currentScreen;
  }

  public getEndTexture(): ScreenContent {
    return this.transitionQueue[0] || this.backupTextures;
  }

  public hasInitialCurrentScreen() {
    return this.hasCurrentScreen;
  }

  public async setScreen({ depth, color }: ScreenContent) {
    await depth.loaded;
    await color.loaded;
    this.currentScreen.depth = depth;
    this.currentScreen.color = color;
    this.hasCurrentScreen = true;
  }

  public addNextScreen({ depth, color }: ScreenContent) {
    if (this.transitionQueue.length > 1) {
      // Replace screen that hasn't been queued up yet
      this.transitionQueue[1] = { depth, color };
    } else {
      // Needs to add next item
      this.transitionQueue.push({ depth, color });
    }
  }

  public async nextScreenLoaded() {
    const { color, depth } = this.getEndTexture();
    await color.loaded;
    await depth.loaded;

    if (this.transitionQueue.length === 1) {
      this.transitionProgress.set(1);
    }
  }

  public tick() {
    if (!this.transitionQueue.length) return;

    this.transitionProgress.tick();

    if (this.transitionProgress.isFinished()) {
      const completedTransition = this.transitionQueue.shift();
      if (completedTransition) this.currentScreen = completedTransition;
      this.transitionProgress.setAbsolute(0);
      this.transitionProgress.set(1);
    }
  }
}

export default ScreenTransitionManager;
