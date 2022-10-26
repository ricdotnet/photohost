import { Request } from 'express';
import { client } from '../../config/database';
import { IPhoto, IUserContext } from '../../interfaces';
import { clone } from 'lodash';
import { IFile } from '@ricdotnet/upfile/src/types';
import { getUserData } from '../user';
import { lookup } from 'mime-types';
import { SQLColumnValue } from '../../types';
import fs from 'fs';
import path from 'path';
import fsp from 'fs/promises';

export function doInsert(req: Request): Promise<void> {
  return new Promise(async (resolve) => {
    const { album } = req.formData;
    for ( let fileEl in req.files! ) {
      const file: IFile = req.files![fileEl];

      let sanitizedName;
      if ( !req.body['fileName'] ) {
        sanitizedName = sanitizeFilename(file.originalName);
      } else {
        sanitizedName = req.body['fileName'];
      }

      // do not set an album if default-album
      const albumToSave = album === 'default-album' ? null : album;

      await client.query<IPhoto>('INSERT INTO photos ("user", path, filename, name, album) VALUES ($1, $2, $3, $4, $5)',
        [req.userContext!.id, '', file.originalName, sanitizedName, albumToSave]);

      // if the insert is successful then move the file
      await moveTmpFile(req.userContext!, file);

      if ( parseInt(fileEl) === req.files!.length - 1 ) {
        resolve();
      }
    }
  });
}

export async function doDelete(req: Request) {
  const { id, username } = req.userContext!;

  for ( const photo of req.body.photos ) {
    await deletePhoto(id, username, photo);
  }
}

// TODO: get user data from digest?
export async function doGetOne(req: Request): Promise<undefined | { file: Buffer, mimeType: string | boolean }> {
  const photoResult =
    await client.query<IPhoto>('SELECT * FROM photos WHERE id = $1',
      [req.query.photoId]);

  const photo = photoResult.rows[0];

  if ( !photo ) {
    return;
  }

  // Now we want to check if the user is allowed to see this photo
  let canSee;
  if ( req.path.includes('/public/') ) {
    canSee = !photo.private;
  } else {
    canSee = await verifyDigest(photo.user, req.query['digest'] as string);
  }

  if ( !canSee ) {
    return;
  }

  const file = await fsp.readFile(path.join('uploads', 'ricdotnet', photo.path, photo.filename));

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
  let columnValues: SQLColumnValue[] = [req.userContext!.id];
  let query = 'SELECT * FROM photos WHERE "user" = $1 ';

  if ( req.query['album'] !== 'default-album' ) {
    columnValues.push(req.query['album'] as string);
    query += 'AND album = $2';
  } else {
    query += 'AND album IS NULL';
  }

  const photosResult =
    await client.query<IPhoto>(`${query} ORDER BY created_at LIMIT 10`, [...columnValues]);

  return clone(photosResult.rows);
}

export async function doMove(req: Request) {
  const { album, photos } = req.body;

  const albumValue = (album === 'default-album') ? null : album;
  let columnValues: SQLColumnValue[] = [];
  let preparedColumns = '';

  for ( const photo of photos ) {
    columnValues.push(photo);
    // +1 because we already have 1 prepared statement
    preparedColumns += `$${columnValues.length + 1}`;
    if ( columnValues.length < photos.length ) {
      preparedColumns += ',';
    }
  }

  await client.query(`UPDATE photos
                      SET album = $1
                      WHERE id IN (${preparedColumns})`,
    [albumValue, ...columnValues]);
}

export async function getPhotoData(req: Request) {
  const { photoId } = req.query;
  const { id } = req.userContext!;

  const photoDataResult =
    await client.query('SELECT * FROM photos WHERE "user" = $1 AND name = $2',
      [id, photoId]);

  return photoDataResult.rows;
}

/**
 * Get the current viewing photo cursors (previous and next)
 *
 * @param {e.Request} req
 * @returns {Promise<any>}
 */
export async function doGetCursors(req: Request) {
  const { photoId, album } = req.query;
  const { id } = req.userContext!;

  const columnValues: SQLColumnValue[] = [id, photoId as string];
  let albumQuery = 'album IS NULL';
  if ( album !== 'default-album' ) {
    albumQuery = 'album = $3';
    columnValues.push(album as string);
  }

  const cursorsResult =
    await client.query(`SELECT *
                        FROM (SELECT id,
                                     LAG(id) OVER (ORDER by created_at)  AS prev,
                                     LEAD(id) OVER (ORDER by created_at) AS next
                              FROM photos
                              WHERE "user" = $1
                                AND ${albumQuery}) x
                        WHERE id = $2`,
      [...columnValues]);

  return cursorsResult.rows[0];
}

async function deletePhoto(userId: number, username: string, photoId: string) {
  const photoResult = await client.query<IPhoto>('SELECT * FROM photos WHERE "user" = $1 AND id = $2',
    [userId, photoId]);

  const photo = photoResult.rows[0];

  // remove the file first
  await fsp.rm(path.join('uploads', username, photo.path, photo.filename));

  // then delete entry from the database
  await client.query('DELETE FROM photos WHERE id = $1', [photoId]);
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
 * @param userId The user to get a digest from
 * @param requestDigest The digest present on the request sent
 * @returns A boolean value from the comparison of both digests
 */
async function verifyDigest(userId: number, requestDigest: string): Promise<boolean> {

  const { digest } = await getUserData(userId);

  return digest === requestDigest;
}
