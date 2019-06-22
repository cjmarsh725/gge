const GG_Experimental = () => {
  const gl = GGI.gl;

  const vertexShaderSrc = `
    // an attribute will receive data from a buffer
    attribute vec4 a_position;
  
    // all shaders have a main function
    void main() {
  
      // gl_Position is a special variable a vertex shader
      // is responsible for setting
      gl_Position = a_position;
    }
  `;
  
  const fragmentShaderSrc = `
    // fragment shaders don't have a default precision so we need
    // to pick one. mediump is a good default
    precision mediump float;
  
    void main() {
      // gl_FragColor is a special variable a fragment shader
      // is responsible for setting
      gl_FragColor = vec4(1, 0, 0.5, 1); // return redish-purple
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

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [
    0,  0,
    0,  0.5,
    0.7,0,
  ]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0,0,0,0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.enableVertexAttribArray(positionAttribLoc);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  const size = 2;         // 2 components per iteration
  const type = gl.FLOAT;  // data is 32bit floats
  const normalize = false;// don't normalize the data
  const stride = 0;       // 0 is move forward size * sizeof(type) for next pos
  const offset = 0;       // start at the beginning of buffer
  gl.vertexAttribPointer(
          positionAttribLoc, size, type, normalize, stride, offset);

  gl.drawArrays(gl.TRIANGLES, 0, 3); // (primitiveType, offset, count)
}