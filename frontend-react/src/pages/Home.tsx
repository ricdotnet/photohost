import React, { BaseSyntheticEvent, memo, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlbumsContext } from '../contexts/AlbumsContext';
import { AlbumInterface } from '../interfaces/AlbumInterface';
import UserLayout from '../layouts/UserLayout';
import Button from '../components/button/Button';
import NewAlbumDialog from '../blocks/dialogs/NewAlbumDialog';

import './Home.scss';

function Home() {

  const [albums, setAlbums] = useState<AlbumInterface[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddingNewAlbum, setIsAddingNewAlbum] = useState(false);
  const [isOpenAddNewAlbum, setIsOpenAddNewAlbum] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}album/all`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('access-token')}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setAlbums(data.albums);
        setLoading(false);
      });
  }, []);

  const onOpenAddNewAlbum = () => {
    setIsOpenAddNewAlbum(true);
  };

  const onCancelAddNewAlbum = () => {
    setIsOpenAddNewAlbum(false);
  };

  const onConfirmAddNewAlbum = (e: BaseSyntheticEvent, albumName: string) => {
    e.preventDefault();
    setIsAddingNewAlbum(true);

    fetch(`${import.meta.env.VITE_API}album`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${localStorage.getItem('access-token')}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({ name: albumName }),
    }).then((response) => response.json())
      .then((data) => {
        const newAlbums = [...albums];
        newAlbums.push(data.album);
        setAlbums(newAlbums);
        setIsAddingNewAlbum(false);
        setIsOpenAddNewAlbum(false);
      });
  };

  return (
    <UserLayout>
      <div className="page-top">
        <Button
          value="Add Album"
          variant="primary"
          handleClick={onOpenAddNewAlbum}
          type="button"
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
            <AlbumItem name={album.name} photos={album.photos ?? 0} id={album.id} key={album.id}/>
          ))
      }
    </div>
  );
});

interface AlbumItemPropsInterface {
  id: string;
  name: string;
  photos: number;
}

function AlbumItem(props: AlbumItemPropsInterface) {
  return (
    <div className="album-item">
      <Link to={'/album/' + props.id} key={props.id}>
        <div className="album-item__cover">
          <img
            className="album-item__cover-item"
            src={`https://picsum.photos/seed/${props.name}/800/800`}
            alt="Album Cover"
          />
        </div>
      </Link>
      <span className="album-item__name">{props.name}</span>
      <span className="pl-4 text-sm">{props.photos} photos</span>
    </div>
  );
}

export default Home;
