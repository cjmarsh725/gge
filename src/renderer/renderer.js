import { ggi } from '../core/internal';
import { vertShaders, fragShaders } from './shaders';
import { loadShader, createProgram } from './utils';

// const _name = new WeakMap();

export default class Renderer {
  constructor() {
    // _name.set(this, "foo");
  }
  
  draw() {
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
    // create a buffer for the texture coords
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
  
  createTextureInfo(url) {
    const gl = ggi.gl;
    // load image and get texture info
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    // set placeholder 1x1 transparent image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, 
              gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
    // set parameters for non power of 2 images
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  
    const textureInfo = {
      width: 1,
      height: 1,
      texture: tex,
    };
    const img = new Image();
    img.addEventListener('load', () => {
      textureInfo.width = img.width;
      textureInfo.height = img.height;
      gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    });
    img.src = url;

    return textureInfo;
  }

  render(time) {
    this.draw();
    requestAnimationFrame(this.render);
  }

  run() {
    requestAnimationFrame(this.render);
  }  
}