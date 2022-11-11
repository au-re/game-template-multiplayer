import { default as React } from "react";
import ReactDOM from "react-dom/client";
import { phaserConfig } from "./config";
import { Lobby } from "./scenes/Lobby";
import "./firebase";
import { GameUI } from "./ui/GameUI";

// create and mount game
const game = new Phaser.Game({ ...phaserConfig, scene: [Lobby] });

// mount React UI
ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(<GameUI game={game} />);
