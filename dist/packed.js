class GGE {
  constructor(config = {}) {
    // Defaults overwritten by config parameter, stored in object variable
    this.config = Object.assign({
      parent: null,
      canvasid: null,
      canvas: null,
      width: 800,
      height: 600,
    }, config);
    new GGESetup(this);
  }
}

class GGESetup {
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

