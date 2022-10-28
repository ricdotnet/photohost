import { Router } from 'express';
import { multipart } from '../middlwares/multipart';
import {
  doDelete,
  doGetAll,
  doGetCursors,
  doGetOne,
  doInsert,
  doMove,
  getPhotoData
} from '../../services/photo';
import { authorization } from '../middlwares/authorization';
import validator from 'validator';

export const photo: Router = Router();

// TODO: refactor this later on
photo.get('/cursors', authorization, async (req, res) => {
  const cursors = await doGetCursors(req);

  res.status(200).send({ code: 200, cursors });
});

/**
 * @Post one or more photos
 *
 * the path by default will be blank which would then be populated by the current path the user is visiting in the app
 * say if the user is visiting /2022/holidays/night then the path would be the that
 */
photo.post('/upload', authorization, multipart, async (req, res) => {
  if ( !req.files?.length ) {
    return res.status(401).send({ code: 401, message: 'No file was uploaded.' });
  }

  const photos = await doInsert(req);

  res.status(200).send({ code: 200, photos });
});

/**
 * @Delete a single photo
 */
photo.delete('/delete', authorization, async (req, res) => {
  try {
    await doDelete(req);
  } catch (err) {
    // general error catching for now
    return res.status(400).send({ code: 400, message: 'photos could not be deleted' });
  }

  res.status(200).send({ code: 200, message: 'delete success' });
});

/**
 * @Get all photos from a user
 *
 * TODO: pagination
 */
photo.get('/all', authorization, async (req, res) => {
  if ( req.query['album'] !== 'default-album' ) {
    if ( !validator.isUUID(req.query['album'] as string) ) {
      return res.status(404).send({ code: 404, message: 'invalid uuid so, album does not exist' });
    }
  }

  const photos = await doGetAll(req);

  res.status(200).send(photos);
});

// TODO: merge the following routes into one single route with permissions check?
/**
 * @Get a single photo by name
 *
 * This route will get the image inside the frontend app. When the user is navigating through their album
 *  or looking at a single photo page.
 */
photo.get('/single', async (req, res) => {
  if ( !req.query.digest ) {
    return res.status(404).send({ code: 404, message: 'photo not found' });
  }

  const file = await doGetOne(req);

  if ( !file?.file ) {
    return res.status(404).send({ code: 404, message: 'photo not found' });
  }

  if ( !file?.mimeType ) {
    return res.status(401).send({ code: 401, message: 'not possible to determine mime-type' });
  }

  res.setHeader('content-type', file?.mimeType as string);
  res.status(200).send(file?.file);
});

photo.post('/move', authorization, async (req, res) => {

  await doMove(req);

  res.status(200).send({ code: 200, message: 'photos moved' });
});

/**
 * @Get a single photo via a public url
 *
 * This will be used by users to allow access to their photos. Whoever gets this link will be able to see
 *  the photo, BUT, only if the photo is not set to private
 */
// photo.get('/single', async (req, res) => {
//
//   const file = await doGetOne(req);
//
//   if ( !file?.file ) {
//     return res.status(404).send({ code: 404, message: 'photo not found' });
//   }
//
//   if ( !file?.mimeType ) {
//     return res.status(401).send({ code: 401, message: 'not possible to determine mime-type' });
//   }
//
//   res.setHeader('content-type', file?.mimeType as string);
//   res.status(200).send(file?.file);
// });

/**
 * @Get a single photo data
 *
 * This route will be used to get data from a photo such as path, name, original filename, id,
 *  upload date...
 */
photo.get('/meta', authorization, async (req, res) => {

  const photoData = await getPhotoData(req);

  res.status(200).send({ code: 200, photo: photoData[0] });
});
