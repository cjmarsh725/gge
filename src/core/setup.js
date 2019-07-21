import { ggi } from "./internal";
import { experimental } from "./experimental";
import { defaultConfig } from "./defaults";

export const setup = (config = {}) => {
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

}