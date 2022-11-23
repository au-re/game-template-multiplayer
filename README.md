# Template for prototyping multiplayer games

After cloning this repo, you need to add a `.env` file with your firebase environment values:

```
VITE_API_KEY=xxx
VITE_AUTH_DOMAIN=xxx
VITE_PROJECT_ID=xxx
VITE_STORAGE_BUCKET=xxx
VITE_MESSAGING_SENDER_ID=xxx
VITE_APP_ID=xxx
```

## Available Commands

| Command        | Description                                              |
| -------------- | -------------------------------------------------------- |
| `yarn install` | Install project dependencies                             |
| `yarn dev`     | Builds project and open web server, watching for changes |
| `yarn build`   | Builds code bundle with production settings              |
| `yarn serve`   | Run a web server to serve built code bundle              |

## Development

After cloning the repo, run `yarn install` from your project directory. Then, you can start the local development
server by running `yarn dev` and navigate to http://localhost:3000.

## Production

After running `yarn build`, the files you need for production will be on the `dist` folder. To test code on your `dist` folder, run `yarn serve` and navigate to http://localhost:5000

## Combining Phaser and Firebase

You can subscribe to updates on firebase collections as follows

```ts
export function listenToGameStateUpdates(gameId: string, onChange: (gameState: GameState) => void) {
  const unsub = onSnapshot(doc(db, gameCollectionId, gameId), (doc) => {
    onChange(doc.data() as GameState);
  });
  return unsub;
}
```

In Phaser you might do this in two places, a gameObject or a scene. In both you can initialize the listener in the
create lifecycle method.

```ts
export class MyScene extends Phaser.Scene {
  // called when the scene is loaded the first time
  create() {
    this.unsubFromGameStateUpdates = listenToGameStateUpdates(gameId, this.onGameStateUpdates);
  }

  onGameStateUpdates(gameState: GameState) {
    // do something with the game state
  }
}
```

> Scenes are not destroyed and recreated, this means that hooks might be still trigger even if the scene is not active

Scenes are usually not dess
