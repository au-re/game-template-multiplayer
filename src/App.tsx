import React from "react";
import { MainMenu } from "./components/MainMenu/MainMenu"
import { getAuth, signInAnonymously } from "firebase/auth";
import Phaser from 'phaser';
import Lobby from './scenes/Lobby';
import { phaserConfig } from "./config"
import { GameWrapper } from "./contexts/GameContext"
import { GameStateWrapper } from "./contexts/GameStateContext"
 
export function App() {
    return (
        <GameStateWrapper config={{ ...phaserConfig, scene: [Lobby] }}>
            <MainMenu />
        </GameStateWrapper>
    )
}