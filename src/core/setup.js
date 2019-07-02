import { GG_Experimental } from "./experimental";
import { GG_Config } from "./defaults";
import { GGI } from "./internal";

export const GG_Setup = (config = {}) => {
  // Complete supplied config with default values
  GGI.config = Object.assign(GG_Config, config);

  // Assign or create canvas and initialize its properties
  if (GGI.config.canvasID) {
    const providedCanvas = document.getElementById(GGI.config.canvasID);
    if (providedCanvas instanceof HTMLCanvasElement) {
      GGI.canvas = providedCanvas;
      if (config.width) GGI.canvas.width = GGI.config.width;
      if (config.height) GGI.canvas.height = GGI.config.height;
    } else {
      console.warn("The provided canvasID was invalid.");
    }
  }
  if (!(GGI.canvas instanceof HTMLCanvasElement)) {
    GGI.canvas = document.createElement("canvas");
    GGI.canvas.width = GGI.config.width;
    GGI.canvas.height = GGI.config.height;
    document.body.appendChild(GGI.canvas);
  }
  if (GGI.config.parentID) {
    const parent = document.getElementById(GGI.config.parentID);
    if (parent) {
      parent.appendChild(GGI.canvas);
    } else {
      console.warn("The provided parentID was invalid.");
    }
  }

  // Get WebGL rendering context
  const gl = GGI.canvas.getContext("webgl") || 
              GGI.canvas.getContext("experimental-webgl");
  if (gl === null) throw Error("WebGL is not supported.");
  else GGI.gl = gl;

  GG_Experimental();

}