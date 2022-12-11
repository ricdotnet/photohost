import { Request } from 'express';
import { client } from '../../config/database';

// TODO: add error handling to this service

export async function doGetAlbum(albumId: string) {
  const albumData =
    await client.query('SELECT * FROM albums WHERE id = $1', [albumId]);

  return albumData.rows[0];
}

interface EditAlbumPayload {
  albumName: string | undefined;
  albumCover: string | undefined;
}

export async function doUpdateAlbum(albumId: string, payload: EditAlbumPayload) {
  const { albumName, albumCover } = payload;

  const columns = [];
  const values = [];

  if ( albumName ) {
    values.push(albumName);
    columns.push(`name = $${values.length}`);
  }

  if ( albumCover ) {
    values.push(albumCover);
    columns.push(`cover = $${values.length}`);
  }

  const query = `UPDATE albums
                 SET ${columns.join()}
                 WHERE id = $${values.length + 1}`;
  await client.query(query, [...values, albumId]);
}

export async function doCreateAlbum(req: Request) {
  const { name, cover } = req.body;
  const { id } = req.userContext!;

  const columns = ['"user"', 'name'];
  const values = [id, name];
  if ( !!cover ) {
    columns.push('cover');
    values.push(cover);
  }

  const preparedVars = columns.map((c, i) => `$${i + 1}`);
  let query = `INSERT INTO albums (${columns.join(',')})
               VALUES (${preparedVars.join(',')})
               RETURNING *`;

  const newAlbumResponse =
    await client.query(query, values);

  return newAlbumResponse.rows[0];
}

export async function doGetAlbums(req: Request) {
  const { id } = req.userContext!;

  const noAlbumResponse =
    await client.query('SELECT count(*) FROM photos WHERE "user" = $1 AND album IS NULL',
      [id]);

  const query = `
      SELECT albums.id, albums.name, albums.cover, count(photos.*) as photos
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
  const { id } = req.query;

  return client.query('DELETE FROM albums WHERE id = $1', [id]);
}
