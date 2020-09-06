import { createServer, IncomingMessage } from 'http';
import url, { Url } from 'url';
import qs from 'querystring';
import { Socket } from 'net';
import WebSocket, { Server, Data } from 'ws';
import app from './app';
import Game from './Game';

const { PORT } = process.env;
const server = createServer(app);

const connectedPlayers: Map<number, WebSocket> = new Map();

function getGamePayload() {
  return {
    game: game.toJSON(),
    players: [ ...connectedPlayers.keys() ]
  };
}

function sendGamePayload(socket: WebSocket): void {
  const json = getGamePayload()
  const payload: string = JSON.stringify(json);
  socket.send(payload);
}

const game: Game = Game.create();
game.onupdate = () => {
  wss.clients.forEach((socket: WebSocket) => {
    if (socket.readyState === WebSocket.OPEN) {
      sendGamePayload(socket);
    }
  });
};

app.set('getGamePayload', getGamePayload);
app.set('resetGame', () => game.reset());

const wss = new Server({ noServer: true, path: '/minesweeper' });
wss.on('connection', (socket: WebSocket, req: IncomingMessage, player: number) => {
  if (connectedPlayers.has(player)) return socket.close();
  
  socket.on('message', (data: Data) => {
    try {
      if (game.currentPlayer === player) {
        const [ row, col ]: [ number, number ] = JSON.parse(data.toString());
        game.revealCell(row, col);
      }
    } catch(e) {
      console.error(e);
    }
  });
  socket.on('error', (e: Error) => console.error());
  socket.on('close', (code: number, reason: string) => connectedPlayers.delete(player));

  connectedPlayers.set(player, socket);
  connectedPlayers.forEach(sendGamePayload);
});

server.on('upgrade', (req: IncomingMessage, socket: Socket, head) => {
  const { query }: Url = url.parse(req.url);
  const parsedQuery = qs.parse(query) as { player };
  const player: number = parseInt(parsedQuery.player);
  return wss.handleUpgrade(req, socket, head, (ws: WebSocket) => wss.emit('connection', ws, req, player));
});

server.listen(PORT || 4000, () => console.log(server.address()));
