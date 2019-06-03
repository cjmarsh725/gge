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