import { Request } from 'express';
import { client } from '../../config/database';

// TODO: add error handling to this service

export async function doCreateAlbum(req: Request) {
  const { name } = req.body;
  const { id } = req.userContext!;

  const newAlbumResponse =
    await client.query('INSERT INTO albums ("user", name) VALUES ($1, $2) RETURNING *',
      [id, name]);

  return newAlbumResponse.rows[0];
}

export async function doGetAlbums(req: Request) {
  const { id } = req.userContext!;

  const noAlbumResponse =
    await client.query('SELECT count(*) FROM photos WHERE "user" = $1 AND album IS NULL',
      [id]);

  const query = `
      SELECT albums.id, albums.name, count(photos.*) as photos
      FROM albums
               LEFT OUTER JOIN photos ON photos.album = albums.id
      WHERE albums."user" = $1
      GROUP BY albums.id, albums.created_at
      ORDER BY albums.created_at
  `;

  const albumsResponse = await client.query(query, [id]);

  return { albums: albumsResponse.rows, noAlbumCount: noAlbumResponse.rows };
}

export function doDeleteAlbum(req: Request) {
  const { album } = req.query;

  return client.query('DELETE FROM albums WHERE id = $1', [album]);
}
