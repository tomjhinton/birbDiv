const float PI = 3.1415926535897932384626433832795;

uniform vec2 uMouse;
uniform float uTime;
varying float vTime;
varying vec2 vUv;
varying vec3 vNorm;
uniform vec2 uFrequency;
uniform vec3 uPosition;
uniform vec3 uRotation;
uniform vec2 uResolution;


vec2 rotateUV(vec2 uv, vec2 pivot, float rotation) {
  mat2 rotation_matrix=mat2(  vec2(sin(rotation),-cos(rotation)),
                              vec2(cos(rotation),sin(rotation))
                              );
  uv -= pivot;
  uv= uv*rotation_matrix;
  uv += pivot;
  return uv;
}



void main()

{




  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  vec4 viewPosition = viewMatrix * modelPosition;

  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;



  // gl_Position = vec4(position, 1.0);
  // //

  vUv = uv;
  vTime = uTime;
  vNorm = normal;

}
