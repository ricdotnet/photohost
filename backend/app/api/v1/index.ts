import { Request, Response, Router } from 'express';
import { photo } from './photo';

export const v1: Router = Router();

v1.use('/photo', photo);

v1.get('/', (req: Request, res: Response) => {
  res.status(200).send({ code: 200, path: '/api/v1' });
});
