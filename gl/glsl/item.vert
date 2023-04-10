uniform float u_time;

varying vec3 v_pos;
varying vec2 v_uv;

void main(){
  v_pos = position;
  v_uv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
