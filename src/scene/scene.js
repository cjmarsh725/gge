import { ggi } from '../core/internal';

const _name = new WeakMap();

export default class Scene {
  constructor(name) {
    _name.set(this, name);
  }

  set name(val) {_name.set(this, val)}
  get name() {return _name.get(this)}

  load(name) {
    if (ggi.currentScene.name === name)
      console.warn("Provided scene name is already loaded");
    if (ggi.sceneList.hasOwnProperty(name))
      ggi.currentScene = ggi.sceneList[name];
    else
      console.warn("Provided scene name was not found for load operation")
  }
}