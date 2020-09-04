import path from 'path';
import express from 'express';

const staticPath: string = path.resolve(__dirname, '../client/dist');
const app = express();

app.use(express.static(staticPath))

export default app;