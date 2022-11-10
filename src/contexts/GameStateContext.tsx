import React from "react";
import { Game } from "./Game";
import { doc, setDoc, onSnapshot, deleteField } from "firebase/firestore"; 
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {db} from "../firebase";

interface PlayerState {
    xPos: number,
    yPos: number
}

interface GameState {
    host: string
    status: "menu" | "lobby" | "game"
    playerState: {
        [playerId: string]: PlayerState
    }
}

interface LocalState {
    isAuthenticated: boolean
    gameId: string
    uid: string
}

const initialLocalState = {
    isAuthenticated: false,
    uid: "",
    gameId: "",
}

export const GameStateContext = React.createContext({
    localState: initialLocalState,
    gameState: { playerState: {} },
    createGame: () => {},
    joinGame: (gameId: string) => {},
    leaveGame: () => {},
    updatePlayerPosition: (xPos: number, yPos:number) => {},
});

export function GameStateWrapper({ children, config}: any) {
    const [game, setGame] = React.useState<Phaser.Game | null>(null);
    const [localState, setLocalState] = React.useState<LocalState>(initialLocalState);
    const [gameState, setGameState] = React.useState<GameState | {}>({});
    
    // create a reference to the phaser game
    // callback allows you to update the shared state
    React.useEffect(() => {
        setGame(new Game(config, (update) => {
            // console.log("onPhaserUpdate", update)
            updatePlayerPosition(update.gameId, update.playerX, update.playerY);
        }))
    }, [])
    
    // subscribe to auth events
    React.useEffect(() => {
        const auth = getAuth();
        const unsub = onAuthStateChanged(auth, (user) => {
          if (user) {
            setLocalState({ ...localState, uid: user.uid, isAuthenticated: true });
          } else {
            setLocalState({ ...localState, uid: "", isAuthenticated: false })
          }
        });
        return () => unsub();
    }, [game])
    
    // if we have joined a game, subscribe to the game state
    React.useEffect(() => {
        if(localState.gameId) {
            const unsub = onSnapshot(doc(db, "games", localState.gameId), (doc) => {
                setGameState(doc.data() as GameState)
            });
            return () => unsub()
        }
    }, [localState.gameId])
    
    // we pass the game state down to phaser
    React.useEffect(() => {
        if(!game) return;
        const payload =  {
            uid: localState.uid,
            gameId: localState.gameId,
            players: gameState.playerState || {}
        }
        game?.scene.keys.Lobby?.events.emit('game_data', payload)
    }, [game, gameState, localState.gameId])
    
    
    // actions
    async function createGame() {
        const uid = getAuth().currentUser?.uid;
        
        if(uid) {
            await setDoc(doc(db, "games", uid), {
              host: uid,
              playerState: { [uid]: {} },
            }); 
            setLocalState({...localState, gameId: uid})
        }
    }
    
    async function joinGame(gameId: string) {
        const uid = getAuth().currentUser?.uid;
        if(uid) {
            await setDoc(doc(db, "games", gameId), {
              playerState: { [uid]: {} },
            }, {merge: true}); 
            setLocalState({...localState, gameId})
        }
    }
    
    async function leaveGame() {
        const uid = getAuth().currentUser?.uid;
        if(uid) {
            await setDoc(doc(db, "games", localState.gameId), {
              playerState: { [uid]: deleteField() },
            }, {merge: true}); 
            setLocalState({...localState, gameId: ""})
        }
    }
    
    async function updatePlayerPosition(gameId: string, xPos: number, yPos:number) {
        const uid = getAuth().currentUser?.uid;
        if(!uid || !gameId) return 
        await setDoc(doc(db, "games", gameId), {
            playerState: {
                [uid]: { xPos, yPos }
            },
        }, { merge: true }); 
    }
        
    return (
        <GameStateContext.Provider value={{
            localState,
            gameState,
            createGame,
            leaveGame,
            joinGame,
        }}>
            {children}
            <div id="game" />
        </GameStateContext.Provider>
    )
}
