import { ggi } from '../core/internal';

const _name = new WeakMap();

export default class SceneManager {
  constructor() {
    ggi.sceneList = {};

  }

  set name(val) {_name.set(this, val)}
  get name() {return _name.get(this)}
}