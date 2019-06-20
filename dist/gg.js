const GG = config => {
const GG_E = {};
const GG_I = {}

const GG_Config = {
  parent: null,
  canvasid: null,
  canvas: null,
  width: 800,
  height: 600,
}



/*----- SETUP -----*/
const GG_Setup = () => {
  // Complete supplied config with default values
  GG_I.config = Object.assign(GG_Config, config);

  // Assign or create canvas and initialize its properties
  if(GG_I.config.canvas) {
    GG_I.canvas = GG_I.config.canvas;
  } else {
    GG_I.canvas = document.createElement("canvas");
  }
  GG_I.canvas.width = GG_I.config.width;
  GG_I.canvas.height = GG_I.config.height

  // Get WebGL rendering context
  const gl = GG_I.canvas.getContext("webgl") || 
              GG_I.canvas.getContext("experimental-webgl");
  if (gl === null) {
    throw Error("WebGL is not supported.");
  }

  // Clear viewport to background color
  gl.clearColor(0.0,0.0,0.0,1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  document.body.append(GG_I.canvas);
}

GG_Setup();

return GG_E;
}