import { GGI } from "./internal";

export const GG_Experimental = () => {
  const gl = GGI.gl;

  const vertexShaderSrc = `
    attribute vec2 a_position;
    uniform vec2 u_resolution;
    void main() {
      // normalize pixels
      vec2 zeroToOne = a_position / u_resolution;

      // 0->1 to 0->2
      vec2 zeroToTwo = zeroToOne * 2.0;

      // 0->2 to -1->1
      vec2 clipSpace = zeroToTwo - 1.0;

      gl_Position = vec4(clipSpace${GGI.config.topLeft ? " * vec2(1, -1)":""}, 0, 1);
    }
  `;
  
  const fragmentShaderSrc = `
    precision mediump float;
    uniform vec4 u_color;
    void main() {
      gl_FragColor = u_color;
    }
  `;

  const createShader = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) return shader;
    console.warn("There was a problem creating the shader: " +
                      gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
  const fragmentShader = createShader(
                            gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);

  const createProgram = (gl, vertexShader, fragmentShader) => {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) return program;
    console.warn("There was a problem creating the GL program: " +
                          gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  const program = createProgram(gl, vertexShader, fragmentShader);

  const positionAttribLoc = gl.getAttribLocation(program, "a_position");
  const resolutionUniLoc = gl.getUniformLocation(program, "u_resolution");
  const colorUniLoc = gl.getUniformLocation(program, "u_color");

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [
    10, 20,
    80, 20,
    10, 30,
    10, 30,
    80, 20,
    80, 30,
  ]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0,0,0,0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.enableVertexAttribArray(positionAttribLoc);
  gl.uniform2f(resolutionUniLoc, gl.canvas.width, gl.canvas.height);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  const size = 2;         // 2 components per iteration
  const type = gl.FLOAT;  // data is 32bit floats
  const normalize = false;// don't normalize the data
  const stride = 0;       // 0 is move forward size * sizeof(type) for next pos
  const offset = 0;       // start at the beginning of buffer
  gl.vertexAttribPointer(
          positionAttribLoc, size, type, normalize, stride, offset);

  //gl.drawArrays(gl.TRIANGLES, 0, 6); // (primitiveType, offset, count)
  for (var ii = 0; ii < 50; ++ii) {
    // Setup a random rectangle
    // This will write to positionBuffer because
    // its the last thing we bound on the ARRAY_BUFFER
    // bind point
    setRectangle(
        gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));

    // Set a random color.
    gl.uniform4f(colorUniLoc, Math.random(), Math.random(), Math.random(), 1);

    // Draw the rectangle.
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  // Returns a random integer from 0 to range - 1.
  function randomInt(range) {
    return Math.floor(Math.random() * range);
  }

  // Fill the buffer with the values that define a rectangle.
  function setRectangle(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2,
    ]), gl.STATIC_DRAW);
  }

}