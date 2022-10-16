import React, { BaseSyntheticEvent, memo, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlbumsContext } from '../contexts/AlbumsContext';
import { AlbumInterface } from '../interfaces/AlbumInterface';
import UserLayout from '../layouts/UserLayout';
import Button from '../components/button/Button';
import NewAlbumDialog from '../blocks/dialogs/NewAlbumDialog';

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
      <div className="flex space-x-3 py-4 justify-end border-b border-b-gray-300">
        <Button value="Add Album" variant="primary" handleClick={onOpenAddNewAlbum} type="button"/>
      </div>
      {
        loading ? (<div>Loading albums...</div>)
          : (
            <AlbumsContext.Provider value={albums}>
              <RenderAlbums/>
            </AlbumsContext.Provider>
          )
      }
      {isOpenAddNewAlbum ? (
        <NewAlbumDialog
          onConfirm={onConfirmAddNewAlbum}
          onCancel={onCancelAddNewAlbum}
          dialogIsActioning={isAddingNewAlbum}
        />
      ) : null}
    </UserLayout>
  );
}

const RenderAlbums = memo(function RenderAlbums() {

  const albumsContext = useContext(AlbumsContext);

  return (
    <div
      className="grid gap-x-4 gap-y-10 grid-cols-2 md:grid-cols-4 justify-items-center mt-10">
      {
        !albumsContext.length ? (<div>You have no albums here</div>)
          : albumsContext.map((album) => (
            <Link to={'/album/' + album.id} key={album.id}>
              <AlbumItem name={album.name} photos={album.photos ?? 0}/>
            </Link>
          ))
      }
    </div>
  );
});

interface IAlbumItemProps {
  name: string;
  photos: number;
}

function AlbumItem(props: IAlbumItemProps) {
  return (
    <div className="flex flex-col hover:bg-white/40 rounded-md transition ease-in-out">
      <div className="w-[200px] h-[200px] bg-zinc-700 rounded-md overflow-hidden">
        <img
          className="rounded-md hover:scale-125 hover:rotate-6 transition ease-in-out duration-200"
          src={`https://picsum.photos/seed/${props.name}/200/200`}
          alt="Album Cover"/>
      </div>
      <span
        className="w-[200px] pl-4 text-lg whitespace-nowrap text-ellipsis overflow-hidden">{props.name}</span>
      <span className="ml-5 text-sm">{props.photos} photos</span>
    </div>
  );
}

export default Home;
