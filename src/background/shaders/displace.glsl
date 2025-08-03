#version 300 es
precision highp float;

uniform vec2 u_mouse;
uniform float u_mouse_turbo;
uniform vec2 u_resolution;
uniform float u_colour_per_channel;
uniform float u_contrast_boost;
uniform float u_scroll_percent;
uniform float u_time;
uniform sampler2D u_depth_texture;
uniform sampler2D u_color_texture;

in vec2 v_uv;

out vec4 fragColor;

#define PI 3.1415
#define MAX_SCROLL_AMOUNT 0.05
#define SCROLL_DISTORT 0.15
#define ZOOM 0.99
#define PORTRAIT_ZOOM 0.9

// 0-1 to -1-1 range
vec2 signedRange(vec2 v) {
    return vec2(
        (v.x * 2.0) - 1.0,
        (v.y * 2.0) - 1.0
    );
}

// -1-1 to 0-1 range
vec2 unsignedRange(vec2 v) {
    return vec2(
        (v.x + 1.0) * 0.5,
        (v.y + 1.0) * 0.5
    );
}

vec3 quantizeColour(vec3 colour, float n) {
    return floor(colour * (n - 1.0) + 0.5) / (n - 1.0);
}

const mat4 DITHER_BAYER_MAT_4x4 = mat4(
        0.0, 8.0, 2.0, 10.0,
        12.0, 4.0, 14.0, 6.0,
        3.0, 11.0, 1.0, 9.0,
        15.0, 7.0, 13.0, 5.0
    ) / 16.0;

vec3 dither4x4Colour(
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
    colour = quantizeColour(colour, colour_count);

    return colour;
}

void main() {
    vec2 uv = v_uv;

    ivec2 image_size_i = textureSize(u_color_texture, 0);
    vec2 image_size = vec2(float(image_size_i.x), float(image_size_i.y));

    float ratio_image = image_size.x / image_size.y;
    float ratio_frame = u_resolution.x / u_resolution.y;

    // Landscape
    if(ratio_frame > ratio_image) {
        // Zoom for fun
        uv = unsignedRange(signedRange(uv) * ZOOM);

        // Fix Y scaling
        uv.y *= ratio_image;
        uv.y /= ratio_frame;

        // Get spare image size left to scroll
        float max_uv = 1.0 * ratio_image / ratio_frame;
        float remaining_uv = (1.0 - max_uv);

        // Center image
        uv.y += remaining_uv * .5;

        // Pull image up, and pan across when scrolling
        float full_scroll_range = min(remaining_uv, MAX_SCROLL_AMOUNT);
        uv.y += full_scroll_range * .5;
        uv.y -= (u_scroll_percent * full_scroll_range);
    }

    // Portrait
    if(ratio_frame <= ratio_image) { 
        // Zoom in a little for scroll
        uv = unsignedRange(signedRange(uv) * PORTRAIT_ZOOM);
        
        // Fix X scaling
        uv.x /= ratio_image;
        uv.x *= ratio_frame;

        // Get remaining visible X
        float max_uv = 1.0 * ratio_frame / ratio_image;
        float remaining_uv = (1.0 - max_uv);

        // Get remaining visible Y
        float max_uv_y = 1.0 * ratio_image / ratio_frame;
        float remaining_uv_y = (1.0 - max_uv);

        // Center image
        uv.x += remaining_uv * .5;

        // Pull image up, and pan across when scrolling
        float full_scroll_range = min(remaining_uv_y, MAX_SCROLL_AMOUNT);
        uv.y += full_scroll_range * .5;
        uv.y -= (u_scroll_percent * full_scroll_range);
    }

    // Take depth sample fixed in place
    float depth = texture(u_depth_texture, uv).g;

    vec2 colour_distort = vec2(0.0);

    // Scroll distort
    colour_distort.y += u_scroll_percent * SCROLL_DISTORT;
    
    // Wiggle wilglgel  wllgigleeellele 
    colour_distort.x += sin(u_time * 0.5 * .5 * PI * 2.) * .15 * cos(u_time * .6) * 0.05;
    colour_distort.y += cos(u_time * 0.5 * .8 * PI * 2.) * .025 * sin(u_time) * 0.1;

    // Mouse movement
    colour_distort += mix(
        signedRange(u_mouse) * 0.2,
        signedRange(u_mouse),
        u_mouse_turbo
    );

    // Sample colour with displacement
    vec3 colour = texture(u_color_texture, uv + colour_distort * depth).rgb;
    colour = pow(colour.rgb, vec3(u_contrast_boost));

    
    // Sickums
    fragColor = vec4(
        mix(
            colour.rgb,
            dither4x4Colour(
                v_uv,
                u_resolution,
                colour.rgb,
                u_colour_per_channel
            ).rgb,
            1.0
        ),
        1.0
    );
}
