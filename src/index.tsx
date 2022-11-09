import React from "react";
import ReactDOM from 'react-dom/client';
import { App }  from "./App";

import Phaser from 'phaser';
import config from './config';
import ScreenSaver from './scenes/ScreenSaver';
import Lobby from './scenes/Lobby';

new Phaser.Game({
  ...config,
  scene: [
    Lobby,
  ]
});

ReactDOM.createRoot(document.getElementById("ui") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

