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
import { clamp } from "@fishley/wwwgraphics/math";
import { isMobile } from "../utility/isMobile";

const TURBO_CLICK_DELAY_MS = 150;

interface BackgroundPair {
  color: HTMLImageElement;
  depth: HTMLImageElement;
}

class Positioner {
  private useGyro: boolean = false;
  private mousePositionTracker: MousePositionTracker =
    new MousePositionTracker();

  private gyroCoords = {
    x: 0,
    y: 0,
  };

  constructor() {
    window.addEventListener("deviceorientation", this.handleDeviceOrientation);
  }

  private handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    if (event.gamma === null || event.beta === null) {
      return;
    }
    this.useGyro = true;
    this.gyroCoords.x = (clamp(event.gamma, -45, 45) + 45) / 90;
    this.gyroCoords.y = (clamp(event.beta, -45, 45) + 45) / 90;
  };

  get x() {
    if (this.useGyro) {
      return this.gyroCoords.x;
    }

    return this.mousePositionTracker.x;
  }

  get y() {
    if (this.useGyro) {
      return this.gyroCoords.y;
    }

    return this.mousePositionTracker.y;
  }
}

class BackgroundRenderer {
  private renderer: Renderer;
  private gl: OGLRenderingContext;
  private canvas: HTMLCanvasElement;

  private positioner: Positioner = new Positioner();

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
      dpr: 1,
      webgl: 2,
      powerPreference: "high-performance",
      canvas:
        (document.getElementById("bgcanvas") as HTMLCanvasElement) || undefined,
    });

    this.renderer = renderer;
    this.gl = renderer.gl;
    this.canvas = renderer.gl.canvas;
    this.subscribers = new Set();
    this.scrollPercentage = new AutonomousSmoothValue(0, 0.1);

    this.currentMousePosition = {
      x: new AutonomousSmoothValue(0.5, 0.2),
      y: new AutonomousSmoothValue(0.5, 0.2),
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
    renderLoop(this.render, { longestFrame: 100 });
  }

  public onUpdate = (cb: () => void) => {
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  };

  public setTextures = async ({ color, depth }: BackgroundPair) => {
    await Promise.all([color.decode(), depth.decode()]);

    const newColorTexture = new Texture(this.gl, {
      generateMipmaps: false,
      minFilter: this.gl.NEAREST,
      magFilter: this.gl.NEAREST,
    });
    const newDepthTexture = new Texture(this.gl, {
      generateMipmaps: false,
      minFilter: this.gl.NEAREST,
      magFilter: this.gl.NEAREST,
    });

    newColorTexture.image = color;
    newDepthTexture.image = depth;

    await newColorTexture.loaded;
    await newDepthTexture.loaded;

    this.program.uniforms.u_color_texture.value = newColorTexture;
    this.program.uniforms.u_depth_texture.value = newDepthTexture;
  };

  private render = ({ elapsed, dt }: RenderLoopTimeData) => {
    this.resize();

    this.scrollPercentage.tick(dt);
    this.turbo.tick(dt);
    this.currentMousePosition.x.tick(dt);
    this.currentMousePosition.y.tick(dt);

    this.program.uniforms.u_scroll_percent.value = this.scrollPercentage.value;
    this.program.uniforms.u_time.value = elapsed;

    this.program.uniforms.u_mouse_turbo.value = this.turbo.value;
    this.currentMousePosition.x.target = this.positioner.x;
    this.currentMousePosition.y.target = this.positioner.y;

    this.program.uniforms.u_mouse.value[0] = this.currentMousePosition.x.value;
    this.program.uniforms.u_mouse.value[1] =
      1 - this.currentMousePosition.y.value;

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

  private resize = () => {
    const { width, height } = this.canvas.getBoundingClientRect();
    if (width !== this.renderer.width || height !== this.renderer.height) {
      this.renderer.setSize(width, height);
    }
  };

  private initializeResizeWatch = () => {
    window.addEventListener("resize", this.resize, false);
    this.resize();
  };
}

export default BackgroundRenderer;
