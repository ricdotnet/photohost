import { Router } from 'express';
import { authorization } from '../middlwares/authorization';
import { doCreateAlbum, doGetAlbums } from '../../services/album';

export const album: Router = Router();

// TODO: Add error handling to these routes

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
