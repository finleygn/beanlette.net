#version 300 es
#define PI 3.1415
precision highp float;

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_animation_progress;
uniform float u_loading_time;
uniform sampler2D u_depth_texture;
uniform sampler2D u_color_texture;
uniform sampler2D u_next_depth_texture;
uniform sampler2D u_next_color_texture;

in vec2 v_uv;

out vec4 fragColor;

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

vec2 correctUv(vec2 uv, sampler2D texture, vec2 resolution) {
  vec2 uvc = vec2(uv.x, uv.y);
  // fuck me this is awful
  ivec2 image_size_i=textureSize(texture,0);
  vec2 image_size=vec2(float(image_size_i.x),float(image_size_i.y));
  
  if(image_size.x/image_size.y>resolution.x/resolution.y){
    float l_image_ratio=image_size.x/image_size.y;
    float l_viewport_ratio=resolution.x/resolution.y;
    
    // we allow a little distortion
    float ratio=l_viewport_ratio/l_image_ratio;
    uvc.x=(uvc.x*(ratio))+((1.-ratio)*.5);
  }else{
    float l_image_ratio=image_size.y/image_size.x;
    float l_viewport_ratio=resolution.y/resolution.x;
    
    // and here
    float ratio=l_viewport_ratio/l_image_ratio;
    uvc.y=(uvc.y*(ratio))+((1.-ratio)*.5);
  }

  return uvc;
}

void main(){
  vec2 uv=correctUv(v_uv, u_color_texture, u_resolution);
  vec2 uv_next=correctUv(v_uv, u_next_color_texture, u_resolution);

  vec2 center_vector = signedRange(u_mouse) + vec2(0.0, u_loading_time);

  float depth=texture(u_depth_texture,uv).g;
  float next_depth=texture(u_next_depth_texture,uv_next).g;

  vec2 sample_position=mix(
    vec2(
      uv.x+(depth*center_vector.x*0.4),
      uv.y+(depth*center_vector.y*0.4)
    ),
    vec2(
      uv_next.x+(next_depth*center_vector.x*0.4),
      uv_next.y+(next_depth*center_vector.y*0.4)
    ), 
    u_animation_progress
  );

  vec4 color=texture(
    u_color_texture,
    vec2(
      sample_position.x,
      sample_position.y
    )
  );

  vec4 color_next=texture(
    u_next_color_texture,
    vec2(
      sample_position.x,
      sample_position.y
    )
  );

  vec4 resulting_colour=mix(color, color_next, clamp(u_animation_progress+(depth*u_animation_progress), 0.0, 1.0));

  float redColorCount = 8.;
  float greenColorCount = 8.;
  float blueColorCount = 8.;
  
  vec4 ditherFilter=dither4x4(gl_FragCoord.xy, resulting_colour);

  fragColor=vec4(
    floor((redColorCount - 1.0) * ditherFilter.r + 0.5) / (redColorCount - 1.0),
    floor((greenColorCount - 1.0) * ditherFilter.g + 0.5) / (greenColorCount - 1.0),
    floor((blueColorCount - 1.0) * ditherFilter.b + 0.5) / (blueColorCount - 1.0),
    1.0
  );
}