import { Request, Response, Router } from 'express';
import { photos } from './photos';

export const v1: Router = Router();

v1.use('/photos', photos);

v1.get('/', (req: Request, res: Response) => {
  res.status(200).send({ code: 200, path: '/api/v1' });
});
