class GG {
  constructor(config = {}) {
    this.config = Object.assign(GG_Config, config);
    new GG_Setup(this);
  }
}