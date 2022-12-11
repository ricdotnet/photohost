import { Router } from 'express';
import { authorization } from '../middlwares/authorization';
import {
  doCreateAlbum,
  doDeleteAlbum,
  doGetAlbum,
  doGetAlbums,
  doUpdateAlbum
} from '../../services/album';
import validator from 'validator';
import isUUID = validator.isUUID;

export const album: Router = Router();

// TODO: Add error handling to these routes

/**
 * @Get a single album data
 */
album.get('/', authorization, async (req, res) => {
  const { albumId } = req.query;

  if ( albumId === 'default-album' ) {
    return res.status(200).send({ code: 200, album: { name: 'Default Album', cover: null } });
  }

  if ( !albumId || !isUUID(albumId as string) ) {
    return res.status(400).send({ code: 400, message: 'invalid albumId' });
  }

  const album = await doGetAlbum(albumId as string);

  if ( !album ) {
    return res.send(404).send({ code: 404, message: 'album not found' });
  }

  res.status(200).send({ code: 200, album });
});

/**
 * @Put edit an album
 */
album.put('/', async (req, res) => {
  const { albumId } = req.query;

  if ( albumId === 'default-album' ) {
    return res.status(400).send({ code: 400, message: 'default-album cannot be edited' });
  }

  if ( !albumId || !isUUID(albumId as string) ) {
    return res.status(400).send({ code: 400, message: 'invalid albumId' });
  }

  const a = await doUpdateAlbum(albumId as string, req.body);

  res.status(200).send({ code: 200, message: a });
});

/**
 * @Post create a new album
 */
album.post('/', authorization, async (req, res) => {

  const album = await doCreateAlbum(req);

  res.status(200).send({ code: 200, album });
});

/**
 * @Get get all albums from a user
 */
album.get('/all', authorization, async (req, res) => {

  const { albums, noAlbumCount } = await doGetAlbums(req);

  albums.unshift({ id: 'default-album', name: 'Default Album', photos: noAlbumCount[0].count });

  res.status(200).send({ code: 200, albums });
});

/**
 * @Delete delete one or more albums
 */
album.delete('/', authorization, async (req, res) => {
  if ( req.query['id'] === 'default-album' ) {
    return res.status(403).send({ code: 403, message: 'default-album cannot be deleted' });
  }

  await doDeleteAlbum(req);

  res.status(200).send({ code: 200, message: 'album deleted with success' });
});
