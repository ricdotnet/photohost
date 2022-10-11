import fs from 'fs';
import path from 'path';
import fsp from 'fs/promises';
import { Request } from 'express';
import { client } from '../../config/database';
import { IPhoto, IUserContext } from '../../interfaces';
import { clone } from 'lodash';
import { IFile } from '@ricdotnet/upfile/src/types';
import { getUserData } from '../user';
import { lookup } from 'mime-types';

export function doInsert(req: Request): Promise<void> {
  return new Promise(async (resolve) => {
    for ( let fileEl in req.files! ) {
      const file: IFile = req.files![fileEl];
      await moveTmpFile(req.userContext!, file);

      let sanitizedName;
      if ( !req.body['fileName'] ) {
        sanitizedName = sanitizeFilename(file.originalName);
      } else {
        sanitizedName = req.body['fileName'];
      }

      await client.query<IPhoto>('INSERT INTO photos (username, path, filename, name) VALUES ($1, $2, $3, $4)',
        [req.userContext?.username, '', file.originalName, sanitizedName]);

      if ( parseInt(fileEl) === req.files!.length - 1 ) {
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

export async function doGetOne(req: Request): Promise<undefined | { file: Buffer, mimeType: string | boolean }> {
  const photoResult =
    await client.query<IPhoto>('SELECT * FROM photos WHERE name = $1',
      [req.params.name]);

  const photo = photoResult.rows[0];

  if ( !photo ) {
    return;
  }

  // Now we want to check if the user is allowed to see this photo
  let canSee;
  if ( req.path.includes('/p/') ) {
    canSee = !photo.private;
  } else {
    canSee = verifyDigest(photo.username, req.query['digest'] as string);
  }

  if ( !canSee ) {
    return;
  }

  const file = await fsp.readFile(path.join('uploads', photo.username, photo.path, photo.filename));

  const mimeType = lookup(photo.filename);

  if ( !mimeType ) {
    console.log('Not possible to determine mime-type.');
    return;
  }

  return {
    file,
    mimeType,
  };
}

export async function doGetAll(req: Request) {
  const photosResult =
    await client.query<IPhoto>('SELECT * FROM photos WHERE username = $1 LIMIT 10', [req.userContext?.username]);

  return clone(photosResult.rows);
}

/**
 * Move the file from the /uploads folder into the /{username} folder
 *
 * @param user The user data object
 * @param file The file object
 */
async function moveTmpFile(user: IUserContext, file: IFile) {

  const userDir = fs.existsSync(path.join('uploads', user.username));

  if ( !userDir ) {
    await fsp.mkdir(path.join('uploads', user.username));
  }

  await fsp.rename(file.file, path.join('uploads', user.username, file.originalName));
}

/**
 * If the user does not pass a name for the file, then get the filename without extension
 *
 * @param originalName The original filename
 * @returns The original filename without extension
 */
function sanitizeFilename(originalName: string): string {
  return originalName.split('.', 1)[0];
}

/**
 * We want photos to have some sort of privacy and to achieve this we use a digest
 *
 * @param username The user digest to verify photo access
 * @param requestDigest The digest present on the request sent
 * @returns A boolean value from the comparison of both digests
 */
function verifyDigest(username: string, requestDigest: string): boolean {

  const { digest } = getUserData(username);

  return digest === requestDigest;
}
