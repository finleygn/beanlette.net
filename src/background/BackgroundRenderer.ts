import { Geometry, OGLRenderingContext, Program, Renderer, Mesh, Texture } from "ogl";
import RenderLoop, { LoopTimings } from "./RenderLoop";
import vertex_shader from './shaders/vertex.glsl?raw';
import fragment_shader from './shaders/displace.glsl?raw';
import MousePositionTracker from "./MousePositionTracker";
import LerpedValue from "./LerpedValue";


class BackgroundRenderer {
  private renderer: Renderer;
  private gl: OGLRenderingContext;
  private canvas: HTMLCanvasElement;

  private mousePositionTracker: MousePositionTracker = new MousePositionTracker();

  private geometry: Geometry;
  private program: Program;
  private mesh: Mesh;

  private currentBackgrounds: {
    colour: Texture;
    depth : Texture;
  };

  private currentMousePosition: {
    x: LerpedValue,
    y: LerpedValue
  }

  constructor() {
    const renderer = new Renderer({
      antialias: false,
      depth: false,
    });

    this.renderer = renderer;
    this.gl = renderer.gl;
    this.canvas = renderer.gl.canvas;
    

    this.currentBackgrounds = {
      colour: new Texture(this.gl, {
        generateMipmaps: false,
      }),
      depth: new Texture(this.gl, {
        generateMipmaps: false,
       })
    };

    this.currentMousePosition = {
      x: new LerpedValue(this.mousePositionTracker.getX(), 0.1),
      y: new LerpedValue(this.mousePositionTracker.getY(), 0.1)
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
        u_resolution: { value: [this.renderer.width, this.renderer.height] },
        u_depth_texture: { value: this.currentBackgrounds.depth },
        u_color_texture: { value: this.currentBackgrounds.colour },
      },
    });

    this.mesh = new Mesh(this.gl, { geometry: this.geometry, program: this.program });

    this.currentBackgrounds = {
      colour: new Texture(this.gl),
      depth : new Texture(this.gl)
    }

    document.body.prepend(this.canvas);
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0px';
    this.canvas.style.left = '0px';
    this.canvas.style.right = '0px';
    this.canvas.style.bottom = '0px';

    this.watchScreenResize();
    RenderLoop.start(this.render)
  }

  private watchScreenResize = () => {
    const resize = () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', resize, false);
    resize();
  }

  public setInitialBackgroundTexture({ colour, depth }:  {
    colour: HTMLImageElement;
    depth : HTMLImageElement;
  }) {
    this.currentBackgrounds.colour.image = colour;
    this.currentBackgrounds.depth.image = depth;
  }

  private render = (timings: LoopTimings) => {
    this.gl.texParameteri(this.currentBackgrounds.colour.target, this.gl.TEXTURE_WRAP_S, this.gl.MIRRORED_REPEAT);
    this.gl.texParameteri(this.currentBackgrounds.colour.target, this.gl.TEXTURE_WRAP_T, this.gl.MIRRORED_REPEAT);
    this.gl.texParameteri(this.currentBackgrounds.colour.target, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.currentBackgrounds.colour.target, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

    /**
     * Mouse position updates
     */
    this.currentMousePosition.x.tick();
    this.currentMousePosition.y.tick();

    this.currentMousePosition.x.set(this.mousePositionTracker.getX());
    this.currentMousePosition.y.set(this.mousePositionTracker.getY());

    const lerpedMouseX = this.currentMousePosition.x.get();
    const lerpedMouseY = this.currentMousePosition.y.get();

    console.log(lerpedMouseX)
    this.program.uniforms.u_mouse.value[0] = lerpedMouseX;
    this.program.uniforms.u_mouse.value[1] = lerpedMouseY;

    /**
     * Resolution updates
     */
    this.program.uniforms.u_resolution[0] = this.renderer.width;
    this.program.uniforms.u_resolution[1] = this.renderer.height;

    /**
     * Background updates
     */
    this.program.uniforms.u_color_texture.value = this.currentBackgrounds.colour;
    this.program.uniforms.u_depth_texture.value = this.currentBackgrounds.depth;

    this.renderer.render({ scene: this.mesh });
  }
}

export default BackgroundRenderer;