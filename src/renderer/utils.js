export const loadShader = (gl, shaderSource, shaderType) => {
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
}

export const createProgram = (gl, shaders, attribs, locations) => {
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
}