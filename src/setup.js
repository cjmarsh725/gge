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