import { Request, Response, Router } from 'express';
import { authorization } from './middlwares/authorization';
import { v1 } from './v1';

export const api: Router = Router();

// api.use(authorization);
api.use('/v1', v1);

api.get('/', (req: Request, res: Response) => {
  res.status(200).send({ code: 200, path: '/api' });
});
