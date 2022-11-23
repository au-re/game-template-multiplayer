import React, { useContext } from "react";
import { gameTitle } from "../../constants";
import { GameStateContext } from "../contexts/GameStateContext";
import { useAnonAuth } from "../hooks/useAnonAuth";
import { Button } from "./Button";
import { Input } from "./Input";
import { GameTitle, Label, Menu, Spacer } from "./Menu";

export function LoggedInMenu() {
  const { isLoading } = useAnonAuth();
  const { createGame, joinGame, localState } = useContext(GameStateContext);
  const { uid } = localState;
  const { gameId, isAuthenticated } = localState;
  const [gameIdInput, setGameIdInput] = React.useState("");
  const showLoggedInMenu = !isLoading && !gameId && isAuthenticated;
  if (!showLoggedInMenu) return null;
  return (
    <Menu>
      <GameTitle>{gameTitle}</GameTitle>
      <Spacer />
      {isLoading && <div>loading...</div>}
      <Label>player name</Label>
      <div style={{ textAlign: "left" }}>{uid}</div>
      <Spacer />
      <Label>
        <Input placeholder="enter gamecode" onChange={(e) => setGameIdInput(e.target.value)} />
        <Button disabled={!gameIdInput} onClick={() => joinGame(gameIdInput)}>
          join game
        </Button>
      </Label>
      <Spacer />
      <Button style={{ width: "100%" }} onClick={createGame}>
        create game
      </Button>
    </Menu>
  );
}
