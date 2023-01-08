import React, {
  BaseSyntheticEvent,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { Link } from 'react-router-dom';
import { AlbumsContext } from '../contexts/AlbumsContext';
import { AlbumInterface } from '../interfaces/AlbumInterface';
import { AlbumType } from '../interfaces/Types';
import { useApiRequest } from '../hooks/UseApiRequest';
import UserLayout from '../layouts/UserLayout';
import NewAlbumDialog from '../blocks/dialogs/NewAlbumDialog';
import AlbumsDropdown from '../blocks/dropdowns/AlbumsDropdown';

import './Home.scss';

export default function Home() {
  const [albums, setAlbums] = useState<AlbumInterface[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddingNewAlbum, setIsAddingNewAlbum] = useState(false);
  const [isOpenAddNewAlbum, setIsOpenAddNewAlbum] = useState(false);

  const { request } = useApiRequest();

  const getAllAlbums = useCallback(async () => {

    const { data, error } = await request({
      route: '/album/all',
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

  const onConfirmAddNewAlbum = async (e: BaseSyntheticEvent, {
    albumName,
    albumCover
  }: AlbumType) => {
    e.preventDefault();
    setIsAddingNewAlbum(true);

    let payload = {
      name: albumName,
      cover: albumCover,
    };

    const { data, error } = await request({
      method: 'POST',
      route: '/album',
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
      {isOpenAddNewAlbum &&
        <NewAlbumDialog
          onConfirm={onConfirmAddNewAlbum}
          onCancel={onCancelAddNewAlbum}
          dialogIsActioning={isAddingNewAlbum}
        />
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
              randomCover={album.random_cover}
            />
          ))
      }
    </div>
  );
});

interface AlbumItemPropsInterface {
  id: string;
  name: string;
  cover: string & any;
  photos: number;
  randomCover: boolean;
}

// TODO: Refactor this usethumbnail to a hook and also refactor the current UseThumbnail hook
function AlbumItem(props: AlbumItemPropsInterface) {
  const thumbnailRef = useRef<HTMLImageElement>(null);

  const getThumbnail = useCallback(async () => {
    const queryParams = new URLSearchParams();
    queryParams.append('photoId', props.cover.id);

    const { request } = useApiRequest();
    const { data, error } = await request({
      route: '/photo/thumbnail?' + queryParams,
      responseType: 'blob',
    });

    if ( error ) return console.error(error);

    if ( data ) {
      thumbnailRef.current!.src = URL.createObjectURL(data);
    }
  }, []);

  useEffect(() => {
    if ( props.cover && props.cover instanceof Object) {
      getThumbnail();
    }
  }, []);

  return (
    <div className="album-item">
      <Link to={'/album/' + props.id} key={props.id}>
        <div className="album-item__cover">
          {props.cover && props.randomCover ?
            <img
              ref={thumbnailRef}
              className="album-item__cover-item"
              alt="Album Cover"
            />
            :
            <img
              className="album-item__cover-item"
              src={!!props.cover ? props.cover : `https://picsum.photos/seed/${props.name}/500/`}
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
