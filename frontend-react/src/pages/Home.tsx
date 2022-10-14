import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import UserLayout from '../layouts/UserLayout';

function Home() {

  return (
    <UserLayout>
      <PageContent/>
    </UserLayout>
  );
}

function PageContent() {
  const userContext = useContext(UserContext);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}photo/all`, {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('access-token')}`
      }
    })
      .then((response) => response.json())
      .then((data) => setPhotos(data));
  }, []);

  return (
    <div className="w-[90%] mx-auto columns-1 md:columns-2 lg:columns-3 xl:columns-4 mt-10">
      {photos.map((photo: any) => (
        <RenderPhoto photo={photo} key={photo.id}/>
      ))}
    </div>
  );
}

interface IRenderPhoto {
  photo: {
    id: number;
    name: string;
  };
}

function RenderPhoto(props: IRenderPhoto) {
  const userContext = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const handleOnLoad = () => {
    setLoading(false);
  };

  return (
    <div className="rounded-md mb-4 relative">
      <Link to={'/photo/' + props.photo.name} state={props.photo} key={props.photo.id}>
        <div className={'w-full h-[100px] animate-pulse bg-gray-400 rounded-md ' + ((loading) ? 'block' : 'hidden')}></div>
        <img className={'w-full rounded-md ' + ((loading) ? 'hidden' : 'block')}
             src={import.meta.env.VITE_API + 'photo/' + props.photo.name + '?digest=' + userContext.digest}
             alt={props.photo.name} onLoad={handleOnLoad}/>
        <div
          className="absolute w-full h-full rounded-md bottom-0 hover:bg-white/20 transition ease-in-out"></div>
      </Link>
    </div>
  );
}

export default Home;
