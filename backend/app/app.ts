import express, { Express, Request, Response } from 'express';
import cors from 'cors';

import { api } from './api';
import { config } from './config';

const app: Express = express();

app.use(cors());

// app.use('/photo', express.static('uploads'));

app.use('/api', api);

app.get('/', (req: Request, res: Response) => {
  res.status(200).send({ code: 200, path: '/' });
});

const PORT = config.port;

app.listen(PORT, () => {
  console.log('Running on port:', PORT);
});
