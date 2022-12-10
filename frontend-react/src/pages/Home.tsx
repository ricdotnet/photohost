import React, {
  BaseSyntheticEvent,
  memo,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { Link } from 'react-router-dom';
import { AlbumsContext } from '../contexts/AlbumsContext';
import { AlbumInterface } from '../interfaces/AlbumInterface';
import { useApiRequest } from '../hooks/UseApiRequest';
import UserLayout from '../layouts/UserLayout';
import NewAlbumDialog from '../blocks/dialogs/NewAlbumDialog';
import AlbumsDropdown from '../blocks/dropdowns/AlbumsDropdown';

import './Home.scss';
import { AlbumType } from '../interfaces/Types';

export default function Home() {
  const [albums, setAlbums] = useState<AlbumInterface[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddingNewAlbum, setIsAddingNewAlbum] = useState(false);
  const [isOpenAddNewAlbum, setIsOpenAddNewAlbum] = useState(false);

  const { request } = useApiRequest();

  const getAllAlbums = useCallback(async () => {

    // const { data, error } = await get('/album/all');
    const { data, error } = await request({
      route: '/album/all',
      withAuth: true,
    });

    if ( data ) {
      setAlbums(data.albums);
      setLoading(false);
    }

    if ( error ) {
      throw new Error(error);
    }

  }, []);

  useEffect(() => {
    getAllAlbums();
  }, [getAllAlbums]);

  const onOpenAddNewAlbum = () => {
    setIsOpenAddNewAlbum(true);
  };

  const onCancelAddNewAlbum = () => {
    setIsOpenAddNewAlbum(false);
  };

  const onConfirmAddNewAlbum = async (e: BaseSyntheticEvent, { albumName, albumCover }: AlbumType) => {
    e.preventDefault();
    setIsAddingNewAlbum(true);

    let payload = {
      name: albumName,
      cover: albumCover,
    };

    const { data, error } = await request({
      method: 'POST',
      route: '/album',
      withAuth: true,
      payload: payload,
    });

    if ( data ) {
      const newAlbums = [...albums];
      newAlbums.push(data.album);
      setAlbums(newAlbums);
      setIsAddingNewAlbum(false);
      setIsOpenAddNewAlbum(false);
    }

    if ( error ) {
      throw new Error(error);
    }
  };

  return (
    <UserLayout>
      <div className="page-top">
        Your Albums
        <AlbumsDropdown
          onAddAlbumClick={onOpenAddNewAlbum}
        />
      </div>
      {
        loading ? (<div>Loading albums...</div>)
          : (
            <AlbumsContext.Provider value={albums}>
              <RenderAlbums/>
            </AlbumsContext.Provider>
          )
      }
      {!isOpenAddNewAlbum ? null :
        (
          <NewAlbumDialog
            onConfirm={onConfirmAddNewAlbum}
            onCancel={onCancelAddNewAlbum}
            dialogIsActioning={isAddingNewAlbum}
          />
        )
      }
    </UserLayout>
  );
}

const RenderAlbums = memo(function RenderAlbums() {

  const albumsContext = useContext(AlbumsContext);

  return (
    <div className="album-grid">
      {
        !albumsContext.length ? (<div>You have no albums here</div>)
          : albumsContext.map((album) => (
            <AlbumItem
              name={album.name}
              photos={album.photos ?? 0}
              id={album.id}
              key={album.id}
              cover={album.cover}
            />
          ))
      }
    </div>
  );
});

interface AlbumItemPropsInterface {
  id: string;
  name: string;
  cover: string;
  photos: number;
}

function AlbumItem(props: AlbumItemPropsInterface) {
  return (
    <div className="album-item">
      <Link to={'/album/' + props.id} key={props.id}>
        <div className="album-item__cover">
          {props.cover &&
            <img
              className="album-item__cover-item"
              src={props.cover}
              alt="Album Cover"
            />
          }
        </div>
      </Link>
      <span className="album-item__name">{props.name}</span>
      <span className="pl-4 text-sm">{props.photos} photos</span>
    </div>
  );
}
