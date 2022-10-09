import { Router } from 'express';
import { client } from '../../config/database';
import { clone } from 'lodash';
import path from 'path';
import fsp from 'fs/promises';
import fs from 'fs';
import { upload } from '../middlwares/upload';
import { IUserContext } from '../../interfaces';

export const photos: Router = Router();

photos.get('/all', async (req, res) => {
  const photosResult =
    await client.query('SELECT * FROM photos WHERE username = $1 LIMIT 10', [req.userContext?.username]);

  const photos = clone(photosResult.rows);

  photos.forEach(p => {
    p['fullPath'] = path.join(p.username, p.path, p.filename);
  });

  res.status(200).send(photos);
});

photos.get('/:name', async (req, res) => {
  const photoResult =
    await client.query('SELECT * FROM photos WHERE username = $1 AND filename = $2',
      [req.userContext?.username, req.params.name]);

  const photo = photoResult.rows[0];

  const file = await fsp.readFile(path.join('uploads', photo.username, photo.path, photo.filename));

  res.setHeader('content-type', 'image/jpeg');

  res.status(200).send(file);
});

photos.delete('/:name', async (req, res) => {
  const photoResult = await client.query('SELECT * FROM photos WHERE username = $1 AND filename = $2',
    [req.userContext?.username, req.params.name]);
  await client.query('DELETE FROM photos WHERE filename = $1', [req.params.name]);

  const photo = photoResult.rows[0];

  await fsp.rm(path.join('uploads', photo.username, photo.path, photo.filename));

  res.status(200).send({ code: 200, message: 'delete success' });
});

// path by default will be blank which would then be populated by the current path the user is visiting in the app
// say if the user is visiting /2022/holidays/night then the path would be the that
photos.post('/', upload, async (req, res) => {
  if ( !req.files?.length ) {
    return res.status(401).send({ code: 401, message: 'No file was uploaded.' });
  }

  for ( let file of req.files ) {
    await moveTmpFile(req.userContext!, file);
  }

  await client.query('INSERT INTO photos (username, path, filename) VALUES ($1, $2, $3)',
    [req.userContext?.username, '', req.files[0].originalName]);

  res.status(200).send({ code: 200, message: 'upload success' });
});

async function moveTmpFile(user: IUserContext, f: any) {

  const userDir = fs.existsSync(path.join('uploads', user.username));

  if ( !userDir ) {
    await fsp.mkdir(path.join('uploads', user.username));
  }

  await fsp.rename(f.file, path.join('uploads', user.username, f.originalName));
}
