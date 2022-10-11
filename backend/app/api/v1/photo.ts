import { Router } from 'express';
import { upload } from '../middlwares/upload';
import { doDelete, doGetAll, doGetOne, doInsert } from '../../services/photo';
import { lookup } from 'mime-types';
import { authorization } from '../middlwares/authorization';

export const photo: Router = Router();

// path by default will be blank which would then be populated by the current path the user is visiting in the app
// say if the user is visiting /2022/holidays/night then the path would be the that
photo.post('/', authorization, upload, async (req, res) => {
  if ( !req.files?.length ) {
    return res.status(401).send({ code: 401, message: 'No file was uploaded.' });
  }

  await doInsert(req);

  res.status(200).send({ code: 200, message: 'upload success' });
});

photo.delete('/:name', authorization, async (req, res) => {
  try {
    await doDelete(req);
  } catch (err) {
    // general error catching for now
    return res.status(400).send({ code: 400, message: 'photo could not be deleted' });
  }

  res.status(200).send({ code: 200, message: 'delete success' });
});

photo.get('/all', authorization, async (req, res) => {
  const photos = await doGetAll(req);

  res.status(200).send(photos);
});

photo.get('/:name', async (req, res) => {
  if ( !req.query.digest || req.query.digest !== process.env.DIGEST ) {
    return res.status(404).send({ code: 404, message: 'photo not found' });
  }

  const file: Buffer | undefined = await doGetOne(req);

  if ( !file ) {
    return res.status(404).send({ code: 404, message: 'photo not found' });
  }

  const mimeType = lookup(req.params.name);

  if ( !mimeType ) {
    return res.status(401).send({ code: 401, message: 'not possible to determine mime-type' });
  }

  res.setHeader('content-type', mimeType);
  res.status(200).send(file);
});
