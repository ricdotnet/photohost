import { Request } from 'express';
import { client } from '../../config/database';
import { IPhoto, IUserContext } from '../../interfaces';
import fs from 'fs';
import path from 'path';
import fsp from 'fs/promises';
import { clone } from 'lodash';

export function doInsert(req: Request): Promise<void> {
  return new Promise(async (resolve) => {
    for ( let file in req.files! ) {
      await moveTmpFile(req.userContext!, req.files![file]);

      await client.query<IPhoto>('INSERT INTO photos (username, path, filename) VALUES ($1, $2, $3)',
        [req.userContext?.username, '', req.files![file].originalName]);

      if ( parseInt(file) === req.files!.length - 1 ) {
        resolve();
      }
    }
  });
}

export async function doDelete(req: Request) {
  const photoResult = await client.query<IPhoto>('SELECT * FROM photos WHERE username = $1 AND filename = $2',
    [req.userContext?.username, req.params.name]);

  const photo = photoResult.rows[0];

  // remove the file first
  await fsp.rm(path.join('uploads', photo.username, photo.path, photo.filename));

  // then delete entry from the database
  await client.query('DELETE FROM photos WHERE filename = $1', [req.params.name]);
}

export async function doGetOne(req: Request): Promise<undefined | Buffer> {
  const photoResult =
    // await client.query<IPhoto>('SELECT * FROM photos WHERE username = $1 AND filename = $2',
    await client.query<IPhoto>('SELECT * FROM photos WHERE filename = $1',
      [req.params.name]);

  const photo = photoResult.rows[0];

  if ( !photo ) {
    return;
  }

  return await fsp.readFile(path.join('uploads', photo.username, photo.path, photo.filename));
}

export async function doGetAll(req: Request) {
  const photosResult =
    await client.query<IPhoto>('SELECT * FROM photos WHERE username = $1 LIMIT 10', [req.userContext?.username]);

  const photos = clone(photosResult.rows);

  photos.forEach(p => {
    p.fullPath = path.join(p.username, p.path, p.filename);
  });

  return photos;
}

async function moveTmpFile(user: IUserContext, f: any) {

  const userDir = fs.existsSync(path.join('uploads', user.username));

  if ( !userDir ) {
    await fsp.mkdir(path.join('uploads', user.username));
  }

  await fsp.rename(f.file, path.join('uploads', user.username, f.originalName));
}
