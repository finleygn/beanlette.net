#version 300 es
#define PI 3.1415
precision highp float;

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform sampler2D u_depth_texture;
uniform sampler2D u_color_texture;

in vec2 v_uv;

out vec4 fragColor;

// used to mirror the image when samples go off screen
float zig_zag(float x) {
  float a = -1.0 + 2.0 * mod(floor(x), 2.0);
  float b = -1.0 * mod(floor(x), 2.0);
  return (x - floor(x)) * a + b + 0.5;
}

// 0-1 to -1-1 range
vec2 signedRange(vec2 v) {
  return vec2(
    (v.x * 2.0) - 1.0,
    (v.y * 2.0) - 1.0
  );
}

float luma(vec4 color) {
  return dot(color.rgb, vec3(0.3, 0.3, 0.3));
}

float dither4x4(vec2 position, float brightness) {
  int x = int(mod(position.x, 4.0));
  int y = int(mod(position.y, 4.0));
  int index = x + y * 4;
  float limit = 0.0;

  if (x < 8) {
    if (index == 0) limit = 0.0625;
    if (index == 1) limit = 0.5625;
    if (index == 2) limit = 0.1875;
    if (index == 3) limit = 0.6875;
    if (index == 4) limit = 0.8125;
    if (index == 5) limit = 0.3125;
    if (index == 6) limit = 0.9375;
    if (index == 7) limit = 0.4375;
    if (index == 8) limit = 0.25;
    if (index == 9) limit = 0.75;
    if (index == 10) limit = 0.125;
    if (index == 11) limit = 0.625;
    if (index == 12) limit = 1.0;
    if (index == 13) limit = 0.5;
    if (index == 14) limit = 0.875;
    if (index == 15) limit = 0.375;
  }

  return brightness < limit ? 0.0 : 1.0;
}

vec4 dither4x4(vec2 position, vec4 color) {
  return vec4(color.rgb * dither4x4(position, luma(color)), 1.0);
}

void main(){
  vec2 uv=v_uv;

   // fuck me this is awful
  ivec2 image_size_i=textureSize(u_color_texture,0);
  vec2 image_size=vec2(float(image_size_i.x),float(image_size_i.y));
  
  if(image_size.x/image_size.y>u_resolution.x/u_resolution.y){
    float l_image_ratio=image_size.x/image_size.y;
    float l_viewport_ratio=u_resolution.x/u_resolution.y;
    
    // we allow a little distortion
    float ratio=l_viewport_ratio/l_image_ratio;
    uv.x=(uv.x*(ratio))+((1.-ratio)*.5);
  }else{
    float l_image_ratio=image_size.y/image_size.x;
    float l_viewport_ratio=u_resolution.y/u_resolution.x;
    
    // and here
    float ratio=l_viewport_ratio/l_image_ratio;
    uv.y=(uv.y*(ratio))+((1.-ratio)*.5);
  }

  vec2 center_vector = signedRange(u_mouse);

  float depth=texture(u_depth_texture,uv).g;

  
  vec2 sample_position = vec2(
    uv.x+(depth*center_vector.x*0.4),
    uv.y+(depth*center_vector.y*0.4)
  );

  vec4 color=texture(
    u_color_texture,
    vec2(
      sample_position.x,
      sample_position.y
    )
  );

  float redColorCount = 8.;
  float greenColorCount = 8.;
  float blueColorCount = 8.;
  
  vec4 ditherFilter=dither4x4(gl_FragCoord.xy, color);

  fragColor=vec4(
    floor((redColorCount - 1.0) * ditherFilter.r + 0.5) / (redColorCount - 1.0),
    floor((greenColorCount - 1.0) * ditherFilter.g + 0.5) / (greenColorCount - 1.0),
    floor((blueColorCount - 1.0) * ditherFilter.b + 0.5) / (blueColorCount - 1.0),
    1.0
  );
}