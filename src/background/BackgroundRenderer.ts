import { Geometry, OGLRenderingContext, Program, Renderer, Mesh, Texture } from "ogl";
import vertex_shader from './shaders/vertex.glsl?raw';
import fragment_shader from './shaders/displace.glsl?raw';
import MousePositionTracker from "./MousePositionTracker";
import LerpedValue from "./LerpedValue";
import ScreenTransitionManager from "./ScreenTransitionManager";
import { renderLoop, RenderLoopTimeData } from "@fishley/wwwgraphics/app";
import { AutonomousSmoothValue } from "@fishley/wwwgraphics/animation";

class BackgroundRenderer {
  private renderer: Renderer;
  private gl: OGLRenderingContext;
  private canvas: HTMLCanvasElement;

  private mousePositionTracker: MousePositionTracker = new MousePositionTracker();

  private subscribers: Set<() => void>;
  private geometry: Geometry;
  private program: Program;
  private mesh: Mesh;
  private turbo: AutonomousSmoothValue;

  public currentMousePosition: {
    x: LerpedValue,
    y: LerpedValue
  }

  public scrollPercentage: LerpedValue;

  private screenTransitionManager: ScreenTransitionManager;

  constructor() {
    const renderer = new Renderer({
      antialias: false,
      depth: false
    });

    this.renderer = renderer;
    this.gl = renderer.gl;
    this.canvas = renderer.gl.canvas;
    this.subscribers = new Set();
    this.scrollPercentage = new LerpedValue(0, 0.1);

    this.screenTransitionManager = new ScreenTransitionManager(this.gl);

    this.currentMousePosition = {
      x: new LerpedValue(this.mousePositionTracker.getX(), 0.05),
      y: new LerpedValue(this.mousePositionTracker.getY(), 0.05)
    }

    this.geometry = new Geometry(renderer.gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });

    this.program = new Program(this.gl, {
      vertex: vertex_shader,
      fragment: fragment_shader,
      uniforms: {
        u_mouse: { value: [0.5, 0.5] },
        u_mouse_turbo: { value: 0 },
        u_time: { value: 0 },
        u_scroll_percent: { value: 0 },
        u_resolution: { value: [this.renderer.width, this.renderer.height] },
        u_a_depth_texture: { value: this.screenTransitionManager.getStartTexture().depth },
        u_a_color_texture: { value: this.screenTransitionManager.getStartTexture().color },
        u_b_depth_texture: { value: this.screenTransitionManager.getEndTexture().depth },
        u_b_color_texture: { value: this.screenTransitionManager.getEndTexture().color },
        u_animation_progress: { value: 0 },
        u_loading_time: { value: 0 }
      },
      transparent: false,
      cullFace: false,
      depthTest: false
    });

    this.turbo = new AutonomousSmoothValue(0, 0.1);
    let selected = false;
    let timeout: ReturnType<typeof setTimeout>;
    window.addEventListener("mousedown", () => {
      selected = true;
      timeout = setTimeout(() => {
        if(selected) {
          this.turbo.target = 1;
        }
      }, 75)
    });
    window.addEventListener("mouseup", () => {
      this.turbo.target = 0;
      selected = false;
      if(timeout) clearTimeout(timeout)
    });

    this.mesh = new Mesh(this.gl, { geometry: this.geometry, program: this.program });

    document.body.prepend(this.canvas);
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0px';
    this.canvas.style.left = '0px';
    this.canvas.style.right = '0px';
    this.canvas.style.bottom = '0px';

    this.watchScreenResize();
    renderLoop(this.render, { longestFrame: 60 });
  }

  private watchScreenResize = () => {
    const resize = () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', resize, false);
    resize();
  }

  public onUpdate = (cb: () => void) => {
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  }

  public setCurrentBackground = async ({ color, depth }:  {
    color: HTMLImageElement;
    depth: HTMLImageElement;
  }) => {
    const newcolorTexture = new Texture(this.gl, { generateMipmaps: false });
    const newDepthTexture = new Texture(this.gl, { generateMipmaps: false });

    newcolorTexture.image = color;
    newDepthTexture.image = depth;
    
    await this.screenTransitionManager.setScreen({
      color: newcolorTexture,
      depth: newDepthTexture,
    });
  }

  public setNextBackground = async ({ color, depth }:  {
    color: HTMLImageElement;
    depth: HTMLImageElement;
  }) => {
    const newcolorTexture = new Texture(this.gl, { generateMipmaps: false });
    const newDepthTexture = new Texture(this.gl, { generateMipmaps: false });

    newcolorTexture.image = color;
    newDepthTexture.image = depth;

    this.screenTransitionManager.addNextScreen({
      color: newcolorTexture,
      depth: newDepthTexture,
    });

    await this.screenTransitionManager.nextScreenLoaded()
  }

  public shouldSetInitialBackground() {
    return !this.screenTransitionManager.hasInitialCurrentScreen()
  }

  private render = ({ elapsed, dt }: RenderLoopTimeData) => {
    /**
     * Background textures and transition
     */
    this.screenTransitionManager.tick();

    const currentScreen = this.screenTransitionManager.getStartTexture();
    const nextScreen = this.screenTransitionManager.getEndTexture();

    if(currentScreen.color.image) {
      this.gl.texParameteri(currentScreen.color.target, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
      this.gl.texParameteri(currentScreen.color.target, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    }

    if(nextScreen.color.image) {
      this.gl.texParameteri(nextScreen.color.target, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
      this.gl.texParameteri(nextScreen.color.target, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    }

    this.scrollPercentage.tick();
    this.program.uniforms.u_scroll_percent.value = this.scrollPercentage.get();

    this.program.uniforms.u_time.value = elapsed;
    this.program.uniforms.u_loading_time.value = 0;
    this.program.uniforms.u_mouse_turbo.value = this.turbo.value;
    this.program.uniforms.u_animation_progress.value = this.screenTransitionManager.getProgress();

    this.program.uniforms.u_a_color_texture.value = currentScreen.color;
    this.program.uniforms.u_a_depth_texture.value = currentScreen.depth;

    this.program.uniforms.u_b_color_texture.value = nextScreen.color;
    this.program.uniforms.u_b_depth_texture.value = nextScreen.depth;

    this.turbo.tick(dt);
    
    /**
     * Mouse position updates
     * TODO: Move these to AutonomousSmoothedValue
     */
    this.currentMousePosition.x.tick();
    this.currentMousePosition.y.tick();

    this.currentMousePosition.x.set(this.mousePositionTracker.getX());
    this.currentMousePosition.y.set(this.mousePositionTracker.getY());

    const lerpedMouseX = this.currentMousePosition.x.get();
    const lerpedMouseY = this.currentMousePosition.y.get();

    this.program.uniforms.u_mouse.value[0] = lerpedMouseX;
    this.program.uniforms.u_mouse.value[1] = lerpedMouseY;

    /**
     * Resolution updates
     */
    this.program.uniforms.u_resolution.value[0] = this.renderer.width;
    this.program.uniforms.u_resolution.value[1] = this.renderer.height;

    this.renderer.render({ scene: this.mesh });

    for(const subscriber of this.subscribers) {
      subscriber()
    }
  }
}

export default BackgroundRenderer;