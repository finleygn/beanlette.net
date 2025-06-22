import {
  Geometry,
  OGLRenderingContext,
  Program,
  Renderer,
  Mesh,
  Texture,
} from "ogl";
import vertex_shader from "./shaders/vertex.glsl?raw";
import fragment_shader from "./shaders/displace.glsl?raw";
import { renderLoop, RenderLoopTimeData } from "@fishley/wwwgraphics/app";
import { AutonomousSmoothValue } from "@fishley/wwwgraphics/animation";
import { MousePositionTracker } from "@fishley/wwwgraphics/interaction";

const TURBO_CLICK_DELAY_MS = 150;

interface BackgroundPair {
  color: HTMLImageElement;
  depth: HTMLImageElement;
}

class BackgroundRenderer {
  private renderer: Renderer;
  private gl: OGLRenderingContext;
  private canvas: HTMLCanvasElement;

  private mousePositionTracker: MousePositionTracker =
    new MousePositionTracker();

  private subscribers: Set<() => void>;
  private geometry: Geometry;
  private program: Program;
  private mesh: Mesh;
  private turbo: AutonomousSmoothValue;

  public currentMousePosition: {
    x: AutonomousSmoothValue;
    y: AutonomousSmoothValue;
  };

  public scrollPercentage: AutonomousSmoothValue;

  constructor() {
    const renderer = new Renderer({
      antialias: false,
      depth: false,
      canvas: document.getElementById("bgcanvas") as HTMLCanvasElement || undefined
      // dpr: window.devicePixelRatio,
    });

    this.renderer = renderer;
    this.gl = renderer.gl;
    this.canvas = renderer.gl.canvas;
    this.subscribers = new Set();
    this.scrollPercentage = new AutonomousSmoothValue(0, 0.1);

    this.currentMousePosition = {
      x: new AutonomousSmoothValue(this.mousePositionTracker.x, 0.2),
      y: new AutonomousSmoothValue(this.mousePositionTracker.y, 0.2),
    };

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
        u_depth_texture: {
          value: new Texture(this.gl),
        },
        u_color_texture: {
          value: new Texture(this.gl),
        },
      },
      transparent: false,
      cullFace: false,
      depthTest: false,
    });

    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });

    this.turbo = new AutonomousSmoothValue(0, 0.1);

    this.initializeTurboMouseListener();

    this.initializeResizeWatch();
    renderLoop(this.render, { longestFrame: 60 });
  }

  public onUpdate = (cb: () => void) => {
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  };

  public setTextures = async ({ color, depth }: BackgroundPair) => {
    const newColorTexture = new Texture(this.gl, { generateMipmaps: false });
    const newDepthTexture = new Texture(this.gl, { generateMipmaps: false });

    newColorTexture.image = color;
    newDepthTexture.image = depth;

    await newColorTexture.loaded;
    await newDepthTexture.loaded;

    this.program.uniforms.u_color_texture.value = newColorTexture;
    this.program.uniforms.u_depth_texture.value = newDepthTexture;

    this.gl.texParameteri(
      newColorTexture.target,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.NEAREST
    );
    this.gl.texParameteri(
      newDepthTexture.target,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.NEAREST
    );
  };

  private render = ({ elapsed, dt }: RenderLoopTimeData) => {
    this.scrollPercentage.tick(dt);
    this.turbo.tick(dt);
    this.currentMousePosition.x.tick(dt);
    this.currentMousePosition.y.tick(dt);

    this.program.uniforms.u_scroll_percent.value = this.scrollPercentage.value;
    this.program.uniforms.u_time.value = elapsed;

    this.program.uniforms.u_mouse_turbo.value = this.turbo.value;
    this.currentMousePosition.x.target = this.mousePositionTracker.x;
    this.currentMousePosition.y.target = this.mousePositionTracker.y;

    if (window.innerWidth < 600) {
      this.program.uniforms.u_mouse.value[0] = 0.5;
      this.program.uniforms.u_mouse.value[1] = 0.5;
    } else {
      this.program.uniforms.u_mouse.value[0] = this.currentMousePosition.x.value;
      this.program.uniforms.u_mouse.value[1] =
        1 - this.currentMousePosition.y.value;
    }


    /**
     * Resolution updates
     */
    this.program.uniforms.u_resolution.value[0] = this.renderer.width;
    this.program.uniforms.u_resolution.value[1] = this.renderer.height;

    this.renderer.render({ scene: this.mesh });

    for (const notifySubscriber of this.subscribers) {
      notifySubscriber();
    }
  };

  // Initalizers
  // ------

  private initializeTurboMouseListener = () => {
    let selected = false;
    let timeout: ReturnType<typeof setTimeout>;

    window.addEventListener("mousedown", () => {
      selected = true;
      timeout = setTimeout(() => {
        if (selected) {
          this.turbo.target = 1;
        }
      }, TURBO_CLICK_DELAY_MS);
    });

    window.addEventListener("mouseup", () => {
      this.turbo.target = 0;
      selected = false;
      if (timeout) clearTimeout(timeout);
    });
  };

  private initializeResizeWatch = () => {
    const resize = () => {
      const {width, height} = this.canvas.getBoundingClientRect();
      if(width !== this.renderer.width || height !== this.renderer.height) {
        this.renderer.setSize(width, height);
      }
    }
    
    window.addEventListener("resize", resize, false);
    resize();
  };
}

export default BackgroundRenderer;
