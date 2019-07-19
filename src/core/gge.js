export { setup } from "./setup";

import { renderer } from '../renderer';
export const run = renderer.run;

import { sceneManager } from '../scene';
Object.defineProperty(exports, 'scene', { 
  get() { return sceneManager.loadScene() },
  set(val) { console.error("Scene cannot be modified directly, try scene.load instead") }
})