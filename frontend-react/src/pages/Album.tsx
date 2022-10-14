import { Link, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import UserLayout from '../layouts/UserLayout';

function Album() {

  const { slug } = useParams();

  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const url = new URL(`${import.meta.env.VITE_API}photo/all`);
    url.searchParams.append('album', slug as string);

    fetch(url, {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('access-token')}`
      },
    })
      .then((response) => response.json())
      .then((data) => setPhotos(data));
  }, []);

  if ( !photos.length ) {
    return (
      <UserLayout>
        <div>You have no photos here.</div>
      </UserLayout>);
  }

  return (
    <UserLayout>
      <div className="w-[90%] mx-auto my-10 columns-1 md:columns-2 lg:columns-3 xl: columns-4">
        {photos.map((photo: any) => (
          <RenderPhoto photo={photo} key={photo.id}/>
        ))}
      </div>
    </UserLayout>
  );
}

interface IRenderPhotoProps {
  photo: {
    id: number;
    name: string;
  };
}

function RenderPhoto(props: IRenderPhotoProps) {
  const userContext = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const handleOnLoad = () => {
    setLoading(false);
  };

  return (
    <div className="rounded-md mb-4 relative bg-white p-3 break-inside-avoid">
      <Link to={'/photo/' + props.photo.name} state={props.photo} key={props.photo.id}>
        <div
          className={'w-full h-[100px] animate-pulse bg-gray-400 rounded-md ' + ((loading) ? 'block' : 'hidden')}></div>
        <img className={'w-full rounded-md ' + ((loading) ? 'hidden' : 'block')}
             src={import.meta.env.VITE_API + 'photo/' + props.photo.name + '?digest=' + userContext.digest}
             alt={props.photo.name} onLoad={handleOnLoad}/>
        <div
          className="absolute w-full h-full rounded-md left-0 bottom-0 hover:bg-white/20 transition ease-in-out"></div>
      </Link>
    </div>
  );
}

export default Album;
