import { ggi } from '../core/internal';
import Scene from './scene';

export default class SceneManager {
  constructor() {
    const main = new Scene("main");
    ggi.currentScene = main;
    ggi.sceneList = {};
    ggi.sceneList["main"] = main;
  }

  loadScene() {
    return ggi.currentScene;
  }
}