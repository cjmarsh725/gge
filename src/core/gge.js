export { setup } from "./setup";
export { renderer } from '../renderer';
import { sceneManager } from '../scene';

Object.defineProperty(exports, 'scene', { 
  get() { return sceneManager.loadScene() },
  set(val) { console.error("Scene cannot be modified directly, try scene.load instead") }
})