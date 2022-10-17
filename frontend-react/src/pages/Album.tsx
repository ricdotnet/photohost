import React, { BaseSyntheticEvent, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { PhotosContext } from '../contexts/PhotosContext';
import UserLayout from '../layouts/UserLayout';
import Button from '../components/button/Button';
import DeleteAlbumDialog from '../blocks/dialogs/DeleteAlbumDialog';

import './Album.scss';
import PhotoOverlay from '../blocks/overlays/PhotoOverlay';
import { PhotoInterface } from '../interfaces/PhotoInterface';

function Album() {
  const { slug } = useParams();
  const navigateTo = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isDeletingAlbum, setIsDeletingAlbum] = useState(false);
  const [isOpenDeleteAlbum, setIsOpenDeleteAlbum] = useState(false);

  const onOpenDeleteAlbum = () => {
    setIsOpenDeleteAlbum(true);
  };

  const onCancelDeleteAlbum = () => {
    setIsOpenDeleteAlbum(false);
  };

  useEffect(() => {
    const url = new URL(`${import.meta.env.VITE_API}photo/all`);
    url.searchParams.append('album', slug as string);

    fetch(url, {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('access-token')}`
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPhotos(data);
        setLoading(false);
      });
  }, []);

  const onConfirmDeleteAlbum = () => {
    setIsDeletingAlbum(true);
    const url = new URL(`${import.meta.env.VITE_API}album`);
    url.searchParams.append('album', slug as string);

    fetch(url, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${localStorage.getItem('access-token')}`
      },
      body: JSON.stringify({ album: slug })
    })
      .then((response) => response.json())
      .then(() => {
        setIsDeletingAlbum(false);
        navigateTo('/');
      });
  };

  return (
    <UserLayout>
      <div className="page-top">
        <Button value="Delete"
                variant="danger"
                handleClick={onOpenDeleteAlbum}
                type="button"
                disabled={slug === 'default-album'}/>
      </div>
      {
        loading ? (<div>Loading photos...</div>)
          : (
            <PhotosContext.Provider value={photos}>
              <RenderPhotoList/>
            </PhotosContext.Provider>
          )
      }
      {isOpenDeleteAlbum ? (
        <DeleteAlbumDialog
          onConfirm={onConfirmDeleteAlbum}
          onCancel={onCancelDeleteAlbum}
          dialogIsActioning={isDeletingAlbum}
        />
      ) : null}
    </UserLayout>
  );
}

function RenderPhotoList() {
  const photosContext = useContext(PhotosContext);

  const [photo, setPhoto] = useState<PhotoInterface | null>(null);
  const [isViewingPhoto, setIsViewingPhoto] = useState(false);

  if ( !photosContext.length ) {
    return (<div>You have no photos on this album.</div>);
  }

  const handleOnClickPhoto = (e: BaseSyntheticEvent, photo: PhotoInterface) => {
    setIsViewingPhoto(true);
    setPhoto(photo);

    document.body.classList.add('overflow-hidden');
  };

  const handleOnCloseViewer = () => {
    setIsViewingPhoto(false);
    setPhoto(null);

    document.body.classList.remove('overflow-hidden');
  };

  return (
    <div className="photo-grid">
      {photosContext.map((photo: any) => (
        <RenderPhoto photo={photo} key={photo.id} onClick={handleOnClickPhoto}/>
      ))}
      {isViewingPhoto ? (
        <PhotoOverlay photo={photo!}
                      onClose={handleOnCloseViewer}
        />
      ) : null}
    </div>
  );
}

interface RenderPhotoPropsInterface {
  photo: PhotoInterface;
  onClick: (e: BaseSyntheticEvent, photo: PhotoInterface) => void;
}

function RenderPhoto(props: RenderPhotoPropsInterface) {
  const userContext = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const handleOnLoad = () => {
    setLoading(false);
  };

  const handleOnClick = (e: BaseSyntheticEvent) => {
    props.onClick(e, props.photo);
  };

  return (
    <div className="photo-item" onClick={handleOnClick}>
      {/*<Link to={'/photo/' + props.photo.name} state={props.photo} key={props.photo.id}>*/}
      <div className={'photo-item__skeleton ' + (loading ? 'block' : 'hidden')}></div>
      <img className={'w-full rounded ' + (loading ? 'hidden' : 'block')}
           src={import.meta.env.VITE_API + 'photo/' + props.photo.name + '?digest=' + userContext.digest}
           alt={props.photo.name} onLoad={handleOnLoad}/>
      <div className="photo-item__hover-effect"></div>
      {/*</Link>*/}
    </div>
  );
}

export default Album;
