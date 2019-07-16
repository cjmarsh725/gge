
const _name = new WeakMap();

export default class Renderer {
  constructor() {
    _name.set(this, "foo");
  }
  
  
}