import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout';
import Button from '../components/button/Button';
import Input from '../components/input/Input';

function Home() {

  const [albumName, setAlbumName] = useState('');

  const handleAlbumNameSubmit = (e: any) => {
    e.preventDefault();
    alert(albumName);
  };

  return (
    <UserLayout>
      <form onSubmit={handleAlbumNameSubmit} className="flex space-x-3">
        <Input handleChange={(d: string) => setAlbumName(d)} id="album-name" label="album-name"/>
        <Button value="Add Album" variant="primary" type="submit"/>
      </form>
      <RenderAlbums/>
    </UserLayout>
  );
}

function RenderAlbums() {

  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    console.log('effecting....');
  }, []);

  return (
    <div
      className="grid gap-x-4 gap-y-10 grid-cols-2 md:grid-cols-4 lg:grid-cols-5 justify-items-center mt-10">
      {
        Array.from(Array(10)).map((a: any) => (
          <Link to="/album/default-album">
            <AlbumItem name="Default Album" photos={200}/>
          </Link>
        ))
      }
    </div>
  );
}

interface IAlbumItemProps {
  name: string;
  photos: number;
}

function AlbumItem(props: IAlbumItemProps) {
  return (
    <div className="flex flex-col hover:bg-white/40 rounded-md transition ease-in-out">
      <div className="w-[200px] h-[200px] bg-zinc-700 rounded-md"></div>
      <span className="ml-5 text-lg">{props.name}</span>
      <span className="ml-5 text-sm">{props.photos} photos</span>
    </div>
  );
}

export default Home;
