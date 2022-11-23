import React, { useContext } from "react";
import { gameTitle } from "../../constants";
import { GameStatus } from "../../typings";
import { GameStateContext } from "../contexts/GameStateContext";
import { Button } from "./Button";
import { GameTitle, Label, Menu, Spacer } from "./Menu";

export function InGameMenu() {
  const [inGameMenuStatus, toggleInGameMenu] = React.useState(false);
  const { leaveGame, gameState, localState } = useContext(GameStateContext);
  const { status } = gameState;
  const { gameId } = localState;

  const showInGameMenu = gameId && status === GameStatus.IN_GAME && inGameMenuStatus;

  const onKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      toggleInGameMenu(!inGameMenuStatus);
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", onKeyPress, false);

    return () => {
      document.removeEventListener("keydown", onKeyPress, false);
    };
  }, [onKeyPress]);

  if (!showInGameMenu) return null;

  return (
    <Menu>
      <GameTitle>{gameTitle}</GameTitle>
      <Spacer />
      <h3>IN GAME</h3>
      <Spacer />
      <Label>Game ID</Label>
      <div style={{ textAlign: "left" }}>{gameId}</div>
      <Spacer />
      <div>{gameState.timer}</div>
      <Button
        onClick={() => {
          toggleInGameMenu(false);
          leaveGame();
        }}
      >
        leave game
      </Button>
    </Menu>
  );
}
