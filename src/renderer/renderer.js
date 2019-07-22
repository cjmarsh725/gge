import { ggi } from '../core/internal';
import { vertShaders, fragShaders } from './shaders';
import { loadShader, createProgram } from './utils';
import { m4 } from './matrix';

// const _name = new WeakMap();

export default class Renderer {
  constructor() {
    // _name.set(this, "foo");
  }
  
  init() {
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
      0, 1,
      0, 0,
      1, 1,
      1, 1,
      0, 0,
      1, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
    // assign program data to object
    this.programData = { program, posLoc, texcoordLoc, matrixLoc, texLoc, posBuffer, texcoordBuffer };
    // temporarily assign texture info
    this.textureInfo = this.createTextureInfo("./img/alligator.png");
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

  drawImage(tex, width, height, x, y) {
    const gl = ggi.gl;
    const { program, posBuffer, posLoc, texcoordBuffer, texcoordLoc, matrixLoc, texLoc } = this.programData;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.useProgram(program);
    // setup attributes to get data from buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.enableVertexAttribArray(texcoordLoc);
    gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);
    // create a matrix to convert from pixels to clip space
    let matrix = m4.orthographic(0, gl.canvas.width, 0, gl.canvas.height, -1, 1);
    // move the matrix to the appropriate x,y position
    matrix = m4.translate(matrix, x, y, 0);
    // change the height and width to the image's
    matrix = m4.scale(matrix, width, height, 1);
    // set the matrix
    gl.uniformMatrix4fv(matrixLoc, false, matrix);
    // tell the shader to get texture from texture unit 0
    gl.uniform1i(texLoc, 0);
    // draw the quad (2 tris, 6 verts)
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  draw() {
    ggi.gl.clear(ggi.gl.COLOR_BUFFER_BIT);
    this.drawImage(this.textureInfo.texture,
                  this.textureInfo.width,
                  this.textureInfo.height,
                  0,
                  0);
  }

  render(time) {
    this.draw();
    requestAnimationFrame(this.render.bind(this));
  }

  run() {
    this.init();
    requestAnimationFrame(this.render.bind(this));
  }  
}