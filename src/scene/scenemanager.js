import { ggi } from '../core/internal';
import Scene from './scene';

export default class SceneManager {
  constructor() {
    const main = new Scene("main");
    ggi.currentScene = main;
    ggi.sceneList = {};
    ggi.sceneList["main"] = main; 
    const test = new Scene("test");
    ggi.sceneList["test"] = test; 
  }

  loadScene() {
    return ggi.currentScene;
  }
}