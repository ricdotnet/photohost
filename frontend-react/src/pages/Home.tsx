import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlbumsContext } from '../contexts/AlbumsContext';
import { AlbumInterface } from '../interfaces/AlbumInterface';
import UserLayout from '../layouts/UserLayout';
import Button from '../components/button/Button';
import Input from '../components/input/Input';

interface InputRefInterface {
  reset: () => void;
}

function Home() {

  const [albumName, setAlbumName] = useState('');
  const [albumNameError, setAlbumNameError] = useState(false);

  const [albums, setAlbums] = useState<AlbumInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const inputRef = useRef<InputRefInterface>(null);

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

  const handleAlbumNameChange = (d: string) => {
    if ( albumNameError ) setAlbumNameError(false);
    setAlbumName(d);
  };

  const handleAlbumNameSubmit = (e: any) => {
    e.preventDefault();

    if ( !albumName ) {
      return setAlbumNameError(true);
    }
    setIsAdding(true);

    fetch(`${import.meta.env.VITE_API}album`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${localStorage.getItem('access-token')}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({ name: albumName }),
    }).then((response) => response.json())
      .then((data) => {
        inputRef.current!.reset();
        setAlbumName('');
        const newAlbums = [...albums];
        newAlbums.push(data.album);
        setAlbums(newAlbums);
        setIsAdding(false);
      });
  };

  return (
    <UserLayout>
      <form onSubmit={handleAlbumNameSubmit}
            className="flex space-x-3 py-4 justify-end border-b border-b-gray-300">
        <Input ref={inputRef}
               handleChange={handleAlbumNameChange} id="album-name"
               label="album-name"
               hasError={albumNameError}/>
        <Button value="Add Album" variant="primary" type="submit" isActioning={isAdding}/>
      </form>
      {
        loading ? (<div>Loading albums...</div>)
          : (
            <AlbumsContext.Provider value={albums}>
              <RenderAlbums/>
            </AlbumsContext.Provider>
          )
      }
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
      <span className="ml-5 text-lg">{props.name}</span>
      <span className="ml-5 text-sm">{props.photos} photos</span>
    </div>
  );
}

export default Home;
