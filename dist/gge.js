const GG_Config = {
  parent: null,
  canvasid: null,
  canvas: null,
  width: 800,
  height: 600,
}

class GG {
  constructor(config = {}) {
    this.config = Object.assign(GG_Config, config);
    new GG_Setup(this);
  }
}

class GG_Setup {
  constructor(gge) {
    if(gge.config.canvas) {
      gge.canvas = gge.config.canvas;
    } else {
      gge.canvas = document.createElement('canvas');
    }
    gge.canvas.width = gge.config.width;
    gge.canvas.height = gge.config.height
    document.body.append(gge.canvas);
  }
}

