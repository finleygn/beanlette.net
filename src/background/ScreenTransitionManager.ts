import { AutonomousSmoothValue } from "@fishley/wwwgraphics/animation";
import { OGLRenderingContext, Texture } from "ogl";

interface ScreenContent {
  color: Texture;
  depth: Texture;
}

class ScreenTransitionManager {
  private transitionQueue: ScreenContent[];

  private hasCurrentScreen: boolean;
  private currentScreen: ScreenContent;
  private backupTextures: ScreenContent;

  private transitionProgress: AutonomousSmoothValue;

  constructor(gl: OGLRenderingContext) {
    this.hasCurrentScreen = false;

    const emptyTextures = {
      color: new Texture(gl),
      depth: new Texture(gl),
    };
    this.currentScreen = { ...emptyTextures };
    this.backupTextures = { ...emptyTextures };
    this.transitionQueue = [];

    this.transitionProgress = new AutonomousSmoothValue(0, 0.2);
  }

  public getProgress(): number {
    return this.transitionProgress.value;
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
      this.transitionProgress.target = 1;
    }
  }

  public tick(dt: number) {
    if (!this.transitionQueue.length) return;

    this.transitionProgress.tick(dt);

    if (this.transitionProgress.isFinished()) {
      const completedTransition = this.transitionQueue.shift();
      if (completedTransition) this.currentScreen = completedTransition;
      this.transitionProgress.setAbsolute(0);
      this.transitionProgress.target = 1;
    }
  }
}

export default ScreenTransitionManager;
