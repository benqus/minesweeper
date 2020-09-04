import { createServer, IncomingMessage } from 'http';
import url, { Url } from 'url';
import qs from 'querystring';
import { Socket } from 'net';
import WebSocket, { Server } from 'ws';
import app from './app';

const { PORT } = process.env;
const server = createServer(app);

const wss = new Server({ noServer: true, path: '/minesweeper' });
wss.on('connection', (socket: WebSocket, req: IncomingMessage, game: string) => {
  console.log(game);
});

server.on('upgrade', (req: IncomingMessage, socket: Socket, head) => {
  const { query }: Url = url.parse(req.url);
  const { game = null } = qs.parse(query);
  return wss.handleUpgrade(req, socket, head, (ws: WebSocket) => wss.emit('connection', ws, req, game));
});

server.listen(PORT || 4000, () => {
  console.log(server.address());
});
