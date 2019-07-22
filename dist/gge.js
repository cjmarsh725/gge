
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var gge = (function (exports) {
  'use strict';

  const ggi = {};

  const defaultConfig = {
    parentID: null,
    canvasID: null,
    width: 800,
    height: 600,
  };

  const setup = (config = {}) => {
    // Complete supplied config with default values
    ggi.config = Object.assign(defaultConfig, config);

    // Assign or create canvas and initialize its properties
    if (ggi.config.canvasID) {
      const providedCanvas = document.getElementById(ggi.config.canvasID);
      if (providedCanvas instanceof HTMLCanvasElement) {
        ggi.canvas = providedCanvas;
        if (config.width) ggi.canvas.width = ggi.config.width;
        if (config.height) ggi.canvas.height = ggi.config.height;
      } else {
        console.warn("The provided canvasID was invalid.");
      }
    }
    if (!(ggi.canvas instanceof HTMLCanvasElement)) {
      ggi.canvas = document.createElement("canvas");
      ggi.canvas.width = ggi.config.width;
      ggi.canvas.height = ggi.config.height;
      document.body.appendChild(ggi.canvas);
    }
    if (ggi.config.parentID) {
      const parent = document.getElementById(ggi.config.parentID);
      if (parent) {
        parent.appendChild(ggi.canvas);
      } else {
        console.warn("The provided parentID was invalid.");
      }
    }

    // Get WebGL rendering context
    const gl = ggi.canvas.getContext("webgl") || 
                ggi.canvas.getContext("experimental-webgl");
    if (gl === null) throw Error("WebGL is not supported.");
    else ggi.gl = gl;

    //experimental();

  };

  const vertShaders = {
    "drawImage": `  
    attribute vec4 a_position;
    attribute vec2 a_texcoord;

    uniform mat4 u_matrix;

    varying vec2 v_texcoord;

    void main() {
      gl_Position = u_matrix * a_position;
      v_texcoord = a_texcoord;
    }
  `
  };

  const fragShaders = {
    "drawImage": `
    precision mediump float;

    varying vec2 v_texcoord;

    uniform sampler2D u_texture;

    void main() {
      gl_FragColor = texture2D(u_texture, v_texcoord);
    }
  `
  };

  const loadShader = (gl, shaderSource, shaderType) => {
    // create, load, and compile shader
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    // check compile status
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      const lastError = gl.getShaderInfoLog(shader);
      console.error("There was an error compiling the shader: " + lastError);
      gl.deleteShader(shader);
    }

    return shader;
  };

  const createProgram = (gl, shaders, attribs, locations) => {
    // create program and attach shaders
    const program = gl.createProgram();
    shaders.forEach(shader => {
      gl.attachShader(program, shader);
    });
    // bind attributes and link program
    if (attribs) {
      attribs.forEach((attrib, i) => {
        gl.bindAttribLocation(program, locations ? locations[i] : i, attrib);
      });
    }
    gl.linkProgram(program);
    // check the link status
    const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      const lastError = gl.getProgramInfoLog(program);
      console.error("There was an error in program linking: " + lastError);
      gl.deleteProgram(program);
      return null;
    }
    
    return program;
  };

  const orthographic = (left, right, bottom, top, near, far, dst) => {
    dst = dst || new Float32Array(16);

    dst[ 0] = 2 / (right - left);
    dst[ 1] = 0;
    dst[ 2] = 0;
    dst[ 3] = 0;
    dst[ 4] = 0;
    dst[ 5] = 2 / (top - bottom);
    dst[ 6] = 0;
    dst[ 7] = 0;
    dst[ 8] = 0;
    dst[ 9] = 0;
    dst[10] = 2 / (near - far);
    dst[11] = 0;
    dst[12] = (left + right) / (left - right);
    dst[13] = (bottom + top) / (bottom - top);
    dst[14] = (near + far) / (near - far);
    dst[15] = 1;

    return dst;
  };

  const translate = (m, tx, ty, tz, dst) => {
    dst = dst || new Float32Array(16);

    const m00 = m[0];
    const m01 = m[1];
    const m02 = m[2];
    const m03 = m[3];
    const m10 = m[1 * 4 + 0];
    const m11 = m[1 * 4 + 1];
    const m12 = m[1 * 4 + 2];
    const m13 = m[1 * 4 + 3];
    const m20 = m[2 * 4 + 0];
    const m21 = m[2 * 4 + 1];
    const m22 = m[2 * 4 + 2];
    const m23 = m[2 * 4 + 3];
    const m30 = m[3 * 4 + 0];
    const m31 = m[3 * 4 + 1];
    const m32 = m[3 * 4 + 2];
    const m33 = m[3 * 4 + 3];

    if (m !== dst) {
      dst[ 0] = m00;
      dst[ 1] = m01;
      dst[ 2] = m02;
      dst[ 3] = m03;
      dst[ 4] = m10;
      dst[ 5] = m11;
      dst[ 6] = m12;
      dst[ 7] = m13;
      dst[ 8] = m20;
      dst[ 9] = m21;
      dst[10] = m22;
      dst[11] = m23;
    }

    dst[12] = m00 * tx + m10 * ty + m20 * tz + m30;
    dst[13] = m01 * tx + m11 * ty + m21 * tz + m31;
    dst[14] = m02 * tx + m12 * ty + m22 * tz + m32;
    dst[15] = m03 * tx + m13 * ty + m23 * tz + m33;

    return dst;
  };

  const scale = (m, sx, sy, sz, dst) => {
    dst = dst || new Float32Array(16);

    dst[ 0] = sx * m[0 * 4 + 0];
    dst[ 1] = sx * m[0 * 4 + 1];
    dst[ 2] = sx * m[0 * 4 + 2];
    dst[ 3] = sx * m[0 * 4 + 3];
    dst[ 4] = sy * m[1 * 4 + 0];
    dst[ 5] = sy * m[1 * 4 + 1];
    dst[ 6] = sy * m[1 * 4 + 2];
    dst[ 7] = sy * m[1 * 4 + 3];
    dst[ 8] = sz * m[2 * 4 + 0];
    dst[ 9] = sz * m[2 * 4 + 1];
    dst[10] = sz * m[2 * 4 + 2];
    dst[11] = sz * m[2 * 4 + 3];

    if (m !== dst) {
      dst[12] = m[12];
      dst[13] = m[13];
      dst[14] = m[14];
      dst[15] = m[15];
    }

    return dst;
  };

  const m4 = {orthographic, translate, scale};

  // const _name = new WeakMap();

  class Renderer {
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

  const renderer = new Renderer();

  const _name = new WeakMap();

  class Scene {
    constructor(name) {
      _name.set(this, name);
    }

    set name(val) {_name.set(this, val);}
    get name() {return _name.get(this)}

    load(name) {
      if (ggi.currentScene.name === name)
        console.warn("Provided scene name is already loaded");
      if (ggi.sceneList.hasOwnProperty(name))
        ggi.currentScene = ggi.sceneList[name];
      else
        console.warn("Provided scene name was not found for load operation");
    }
  }

  class SceneManager {
    constructor() {
      const main = new Scene("main");
      ggi.currentScene = main;
      ggi.sceneList = {};
      ggi.sceneList["main"] = main;
    }

    loadScene() {
      return ggi.currentScene;
    }
  }

  const sceneManager = new SceneManager();

  const run = () => renderer.run();
  Object.defineProperty(exports, 'scene', { 
    get() { return sceneManager.loadScene() },
    set(val) { console.error("Scene cannot be modified directly, try scene.load instead"); }
  });

  exports.run = run;
  exports.setup = setup;

  return exports;

}({}));
