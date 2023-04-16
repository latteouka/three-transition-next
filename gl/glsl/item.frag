#pragma glslify: snoise = require('./snoise3d.glsl')

uniform float u_time;
uniform float u_progress;
uniform float u_colorFactor;
uniform sampler2D u_texture;
uniform sampler2D u_mask;
uniform sampler2D u_brush;
uniform vec2 u_imageResolution;
uniform vec2 u_screen;
uniform vec4 u_resolution;

float PI = 3.1415926535897932384626433832795;

varying vec3 v_pos;
varying vec2 v_uv;

vec3 greyscale(vec3 color, float str) {
    float g = dot(color, vec3(0.299, 0.587, 0.114));
    return mix(color, vec3(g), str);
}

void main(void) {
  vec2 screenUv = gl_FragCoord.xy / u_screen;
  vec2 coverUv = (v_uv - vec2(0.5)) * u_resolution.zw + vec2(0.5);

  vec2 originUv = v_uv;
  originUv.y *= u_imageResolution.x/u_imageResolution.y;
  // originUv.y -= 0.5;
  float uvOffset = (1.0 + u_imageResolution.y / u_imageResolution.x) / 2.0;
  originUv.y -= uvOffset;

  vec2 uv = v_uv / (1.0 + sin(u_time * 1.1) * 0.025);
  // scale with progress
  vec2 maskUv = (uv + vec2(u_progress / 2.0)) / (1.0 + u_progress);

  // brush distort
  vec4 brush = texture2D(u_brush, screenUv);
  float theta = brush.r * PI * 2.0;
  vec2 dir = vec2(sin(theta), cos(theta));

  vec2 distort = dir * brush.r * 0.01;

  vec4 color = texture2D(u_texture, originUv + distort);

  if(originUv.y < 0.0 ) {
    color.rgb = vec3(1.0, 1.0, 1.0);
  }
  if(originUv.y > 1.0 ) {
    color.rgb = vec3(1.0, 1.0, 1.0);
  }

  vec4 mask = texture2D(u_mask, maskUv);

  float offx = v_uv.x + sin(v_uv.y + u_time) / 5.0;
  float offy = v_uv.y - u_time * 0.1 - cos(u_time) / 5.0;
  float n = snoise(vec3(offx, offy, u_time * 0.1) * 3.0) * 0.4;

  // float r = 0.5;
  // float dis = length(v_uv - vec2(0.5));
  // float blob = smoothstep(r, 0.0, dis) * 3.0;
  float blobMask = smoothstep(0.4, 0.4, n + mask.r);

  vec4 transparent = vec4(1.0, 1.0, 1.0, 0.0);

  vec4 final = mix(color, transparent, blobMask);

  vec3 grayFinal = greyscale(final.rgb, u_colorFactor);

  gl_FragColor = final;
  gl_FragColor = vec4(grayFinal, final.a);
  // gl_FragColor = brush;
  // gl_FragColor = vec4(vec3(blobMask), 1.0);
  // gl_FragColor = vec4(screenUv.y, 0.0, 0.0, 1.0);
}

