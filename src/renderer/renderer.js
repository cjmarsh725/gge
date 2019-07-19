import { ggi } from '../core/internal';
import { vertShaders, fragShaders } from './shaders';
import { loadShader, createProgram } from './utils';

// const _name = new WeakMap();

export default class Renderer {
  constructor() {
    // _name.set(this, "foo");
  }
  
  testing() {
    const gl = ggi.gl;
    const program = createProgram(gl, [
      loadShader(gl, vertShaders.drawImage, gl.VERTEX_SHADER),
      loadShader(gl, fragShaders.drawImage, gl.FRAGMENT_SHADER)
    ]);
    // locations for vertex data
    const posLoc = gl.getAttribLocation(program, "a_position");
    const texcoordLoc = gl.getAttribLocation(program, "a_texcoord");
    // lookup uniforms
    const matrixLoc = gl.getUniformLocation(program, "u_matrix");
    const texLoc = gl.getUniformLocation(program, "u_texture");
    // create a buffer for the unit quad
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    const positions = [
      0, 0,
      0, 1,
      1, 0,
      1, 0,
      0, 1,
      1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    // create a buffer for texture coords
    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    const texcoords = [
      0, 0,
      0, 1,
      1, 0,
      1, 0,
      0, 1,
      1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);


  }

  run() {
    this.testing();
  }  
}