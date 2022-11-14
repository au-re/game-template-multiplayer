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
