/*----- SETUP -----*/
const GG_Setup = () => {
  // Complete supplied config with default values
  GG_I.config = Object.assign(GG_Config, config);

  // Assign or create canvas and initialize its properties
  if (GG_I.config.canvasID) {
    const providedCanvas = document.getElementById(GG_I.config.canvasID);
    if (providedCanvas instanceof HTMLCanvasElement) {
      GG_I.canvas = providedCanvas;
      if (config.width) GG_I.canvas.width = GG_I.config.width;
      if (config.height) GG_I.canvas.height = GG_I.config.height;
    } else {
      console.warn("The provided canvasID was invalid.");
    }
  }
  if (!(GG_I.canvas instanceof HTMLCanvasElement)) {
    GG_I.canvas = document.createElement("canvas");
    GG_I.canvas.width = GG_I.config.width;
    GG_I.canvas.height = GG_I.config.height;
    document.body.appendChild(GG_I.canvas);
  }
  if (GG_I.config.parentID) {
    const parent = document.getElementById(GG_I.config.parentID);
    if (parent) {
      parent.appendChild(GG_I.canvas);
    } else {
      console.warn("The provided parentID was invalid.");
    }
  }

  // Get WebGL rendering context
  const gl = GG_I.canvas.getContext("webgl") || 
              GG_I.canvas.getContext("experimental-webgl");
  if (gl === null) {
    throw Error("WebGL is not supported.");
  }

  // Clear viewport to background color
  gl.clearColor(0.0,0.0,0.0,1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //document.body.append(GG_I.canvas);
}