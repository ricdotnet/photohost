import { Request, Response, Router } from 'express';
import { photo } from './photo';
import { user } from './user';
import { album } from './album';
import { multipart } from '../middlwares/multipart';

export const v1: Router = Router();

v1.use('/album', album);
v1.use('/photo', photo);
v1.use('/user', user);

v1.get('/', (req: Request, res: Response) => {
  res.status(200).send({ code: 200, path: '/api/v1' });
});

v1.post('/test-upload', multipart, (req, res) => {
  console.log(req.files);

  res.status(200).send({ code: 200, message: 'all files uploaded' });
});
