import path from 'path';
import express, { Request, Response } from 'express';
import cors from 'cors';

const staticPath: string = path.resolve(__dirname, '../client/dist');
const app = express();

app.use(express.static(staticPath));
app.use(cors({
  origin: '*'
}));

app.get('/game', (req: Request, res: Response) => {
  const getGamePayload = req.app.get('getGamePayload');
  res.status(200).json(getGamePayload());
});

app.post('/game', (req: Request, res: Response) => {
  const resetGame = req.app.get('resetGame');
  resetGame();

  const getGamePayload = req.app.get('getGamePayload');
  res.status(200).json(getGamePayload());
});

export default app;