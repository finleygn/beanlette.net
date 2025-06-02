#version 300 es
#define PI 3.1415
precision highp float;

uniform vec2 u_mouse;
uniform float u_mouse_turbo;
uniform vec2 u_resolution;
uniform float u_scroll_percent;
uniform float u_animation_progress;
uniform float u_loading_time;
uniform float u_time;
uniform sampler2D u_a_depth_texture;
uniform sampler2D u_a_color_texture;
uniform sampler2D u_b_depth_texture;
uniform sampler2D u_b_color_texture;

in vec2 v_uv;

out vec4 fragColor;

// 0-1 to -1-1 range
vec2 signedRange(vec2 v) {
  return vec2(
    (v.x * 2.0) - 1.0,
    (v.y * 2.0) - 1.0
  );
}

vec2 unsignedRange(vec2 v) {
  return vec2(
    (v.x + 1.0) * 0.5,
    (v.y + 1.0) * 0.5
  );
}

float basic_luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

vec3 quantize_colour(vec3 colour, float n) {
    return floor(colour * (n - 1.0) + 0.5) / (n - 1.0);
}

const mat4 DITHER_BAYER_MAT_4x4 = mat4(
    0.0,  8.0,  2.0, 10.0,
    12.0, 4.0,  14.0, 6.0,
    3.0,  11.0, 1.0, 9.0,
    15.0, 7.0,  13.0, 5.0
) / 16.0;

vec3 dither_4x4_colour(
    in vec2 position,
    in vec2 resolution,
    in vec3 colour,
    in float colour_count
) {
    float step_size = 1.0 / (colour_count - 1.0);

    // Get threshold required for this pixel to be active
    int x_thresh = int(position.x * resolution.x) % 4;
    int y_thresh = int(position.y * resolution.y) % 4;
    float thresh = (DITHER_BAYER_MAT_4x4[x_thresh][y_thresh] - 0.5) * step_size;

    // Apply dither and quantize
    colour.rgb += thresh;
    colour = quantize_colour(colour, colour_count);

    return colour;
}

vec2 coverBackgroundPosition(vec2 uv, sampler2D texture, vec2 resolution) {
  vec2 cuv = uv;
  vec2 new, offset;

  ivec2 image_size_i=textureSize(texture, 0);
  vec2 image_size=vec2(float(image_size_i.x),float(image_size_i.y));

  float ratio_screen = resolution.x/resolution.y;
  float ratio_image = image_size.x/image_size.y;

  if(ratio_screen < ratio_image) {
    new = vec2(image_size.x * resolution.y / image_size.y, resolution.y);
    offset = vec2((new.x - resolution.x) / 2.0, 0.0);
  } else {
    new = vec2(resolution.x, image_size.y * resolution.x / image_size.x);
    offset = vec2(0.0, (new.y - resolution.y) / 2.0);
  }

  cuv = uv * (resolution / new) + (offset / new);
  return cuv;
}

void main(){
  vec2 uvp = unsignedRange(signedRange(v_uv) * 0.9);
  uvp.y -= (-.05)+(u_scroll_percent*.1);

  vec2 uv = coverBackgroundPosition(uvp, u_a_color_texture, u_resolution);
  vec2 uv_next = coverBackgroundPosition(v_uv, u_b_color_texture, u_resolution);

  float depth=texture(u_a_depth_texture,uv).g;
  float next_depth=texture(u_b_depth_texture,uv_next).g;

  vec2 center_vector = mix(
    signedRange(u_mouse) * 0.2,
    signedRange(u_mouse),
    u_mouse_turbo
  )+ vec2(0.0, u_loading_time);

  float x_wiggle = sin(u_time * 0.5 *.000125*PI*2.)*.004*cos(u_time * 0.5 *.003) * 0.75;
  float y_wiggle = cos(u_time * 0.5 *.0002*PI*2.)*.004*sin(u_time * 0.5 *.005) * 0.75;

  vec2 sample_position=mix(
    vec2(
      uv.x+(depth*(center_vector.x + x_wiggle)),
      uv.y+(depth*(center_vector.y + y_wiggle))
    ),
    vec2(
      uv_next.x+(next_depth*(center_vector.x + x_wiggle)),
      uv_next.y+(next_depth*(center_vector.y + y_wiggle))
    ),
    u_animation_progress
  );

  vec4 color=texture(
    u_a_color_texture,
    vec2(sample_position.x, sample_position.y)
  );

  vec4 color_next=texture(
    u_b_color_texture,
    vec2(sample_position.x, sample_position.y)
  );

  vec4 resulting_colour=mix(color, color_next, clamp(u_animation_progress+(depth*u_animation_progress), 0.0, 1.0));
  fragColor=vec4(
    dither_4x4_colour(
      v_uv,
      u_resolution,
      resulting_colour.rgb,
      4.0
    ),
    1.0
  );
}
