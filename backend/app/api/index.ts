import { Request, Response, Router } from 'express';
import { v1 } from './v1';
import { multipart } from './middlwares/multipart';

export const api: Router = Router();

// api.use(authorization);
api.use('/v1', v1);

api.get('/', (req: Request, res: Response) => {
  res.status(200).send({ code: 200, path: '/api' });
});
