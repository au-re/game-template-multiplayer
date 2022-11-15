import { default as React } from "react";
import ReactDOM from "react-dom/client";
import { phaserConfig } from "./config";
import "./firebase";
import { GridGame } from "./scenes/GridGame";
import { Init } from "./scenes/Init";
import { Lobby } from "./scenes/Lobby";
import { GameUI } from "./ui/GameUI";

// create and mount game
const game = new Phaser.Game({ ...phaserConfig, scene: [Init, Lobby, GridGame] });

// mount React UI
ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(<GameUI game={game} />);
