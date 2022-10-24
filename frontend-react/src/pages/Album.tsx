import React, { BaseSyntheticEvent, useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { PhotosContext } from '../contexts/PhotosContext';
import { PhotoInterface } from '../interfaces/PhotoInterface';
import UserLayout from '../layouts/UserLayout';
import DeleteAlbumDialog from '../blocks/dialogs/DeleteAlbumDialog';
import PhotoOverlay from '../blocks/overlays/PhotoOverlay';
import UploadPhotoDialog from '../blocks/dialogs/UploadPhotoDialog';
import PhotosDropdown from '../blocks/dropdowns/PhotosDropdown';

import './Album.scss';
import DeletePhotosDialog from '../blocks/dialogs/DeletePhotosDialog';
import MovePhotosDialog from '../blocks/dialogs/MovePhotosDialog';

function Album() {
  const { album } = useParams();
  const navigateTo = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeletingAlbum, setIsDeletingAlbum] = useState(false);
  const [isOpenDeleteAlbum, setIsOpenDeleteAlbum] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isOpenUploadPhoto, setIsOpenUploadPhoto] = useState(false);
  const [isMovingPhotos, setIsMovingPhotos] = useState(false);
  const [isOpenMovePhotos, setIsOpenMovePhotos] = useState(false);
  const [isDeletingPhotos, setIsDeletingPhotos] = useState(false);
  const [isOpenDeletePhotos, setIsOpenDeletePhotos] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  useEffect(() => {
    const url = new URL(`${import.meta.env.VITE_API}photo/all`);
    url.searchParams.append('album', album as string);

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

  const onOpenDeleteAlbum = () => {
    setIsOpenDeleteAlbum(true);
  };

  const onCancelDeleteAlbum = () => {
    setIsOpenDeleteAlbum(false);
  };

  const onConfirmDeleteAlbum = () => {
    setIsDeletingAlbum(true);
    const url = new URL(`${import.meta.env.VITE_API}album`);
    url.searchParams.append('album', album as string);

    fetch(url, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${localStorage.getItem('access-token')}`
      },
      body: JSON.stringify({ album: album })
    })
      .then((response) => response.json())
      .then(() => {
        setIsDeletingAlbum(false);
        navigateTo('/');
      });
  };

  const onOpenUploadPhoto = () => {
    setIsOpenUploadPhoto(true);
  };

  const onCancelUploadPhoto = () => {
    setIsOpenUploadPhoto(false);
  };

  const onConfirmUploadPhoto = (e: BaseSyntheticEvent, formData: FormData) => {
    setIsUploadingPhoto(true);

    // append the current album
    formData.append('album', album as string);

    fetch(`${import.meta.env.VITE_API}photo/upload`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${localStorage.getItem('access-token')}`
      },
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        setIsUploadingPhoto(false);
        setIsOpenUploadPhoto(false);
      })
      .catch((err) => console.log(err));
  };

  const handleOnSelectionChange = (e: BaseSyntheticEvent, photoId: string) => {
    if ( !e.target.checked ) {
      const tmp = selectedPhotos.filter(s => s !== photoId);
      setSelectedPhotos(tmp);
    } else {
      setSelectedPhotos((s) => [...s, photoId]);
    }
  };

  const handleMoveAllSelected = () => {
    setIsOpenMovePhotos(true);
  };

  const onMovePhotosCancel = () => {
    setIsOpenMovePhotos(false);
  };

  const onMovePhotosConfirm = (e: BaseSyntheticEvent, albumId: string) => {
    if ( albumId === album ) return;
    setIsMovingPhotos(true);

    const body = {
      album: albumId,
      photos: selectedPhotos
    };

    const url = new URL(`${import.meta.env.VITE_API}photo/move`);

    fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('access-token')}`
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data)
        setIsMovingPhotos(false);
        setIsOpenMovePhotos(false);
      });
  };

  const handleDeleteAllSelected = () => {
    setIsOpenDeletePhotos(true);
  };

  const onDeletePhotosCancel = () => {
    setIsOpenDeletePhotos(false);
  };

  const onDeletePhotosConfirm = () => {
    setIsDeletingPhotos(true);
    const url = new URL(`${import.meta.env.VITE_API}photo/delete`);

    fetch(url, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('access-token')}`,
      },
      body: JSON.stringify({ photos: selectedPhotos }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data)
        setIsDeletingPhotos(false);
        setIsOpenDeletePhotos(false);
      });
  };

  return (
    <UserLayout>
      <div className="page-top">
        <PhotosDropdown
          onClickUploadPhotos={onOpenUploadPhoto}
          onClickDeleteAlbum={onOpenDeleteAlbum}
          onClickMoveAllSelected={handleMoveAllSelected}
          onClickDeleteAllSelected={handleDeleteAllSelected}
          showSelectionOptions={selectedPhotos.length > 0}
        />
      </div>
      {
        loading ? (<div>Loading photos...</div>)
          : (
            <PhotosContext.Provider value={photos}>
              <RenderPhotoList
                onSelectionChange={handleOnSelectionChange}
              />
            </PhotosContext.Provider>
          )
      }
      {isOpenDeleteAlbum &&
        (
          <DeleteAlbumDialog
            onConfirm={onConfirmDeleteAlbum}
            onCancel={onCancelDeleteAlbum}
            dialogIsActioning={isDeletingAlbum}
          />
        )
      }
      {isOpenUploadPhoto &&
        (
          <UploadPhotoDialog
            dialogIsActioning={isUploadingPhoto}
            onConfirm={onConfirmUploadPhoto}
            onCancel={onCancelUploadPhoto}
          />
        )
      }
      {isOpenMovePhotos &&
        (
          <MovePhotosDialog
            dialogIsActioning={isMovingPhotos}
            onConfirm={onMovePhotosConfirm}
            onCancel={onMovePhotosCancel}
          />
        )
      }
      {isOpenDeletePhotos &&
        (
          <DeletePhotosDialog
            dialogIsActioning={isDeletingPhotos}
            onConfirm={onDeletePhotosConfirm}
            onCancel={onDeletePhotosCancel}
          />
        )
      }
    </UserLayout>
  );
}

interface RenderPhotoListPropsInterface {
  onSelectionChange: (e: BaseSyntheticEvent, selection: string) => void;
}

function RenderPhotoList(props: RenderPhotoListPropsInterface) {
  const photosContext = useContext(PhotosContext);

  const { album, photoId } = useParams();
  const navigateTo = useNavigate();

  const [photo, setPhoto] = useState<PhotoInterface | null>(null);
  const [isViewingPhoto, setIsViewingPhoto] = useState(false);

  if ( !photosContext.length ) {
    return (<div>You have no photos on this album.</div>);
  }

  if ( !isViewingPhoto && photoId ) {
    return <Navigate to={`/photo/${photoId}`}/>;
  }

  const handleOnClickPhoto = (e: BaseSyntheticEvent, photo: PhotoInterface) => {
    setIsViewingPhoto(true);
    setPhoto(photo);
    navigateTo(`/${album}/${photo.id}`);

    document.body.classList.add('overflow-hidden');
  };

  const handleOnCloseViewer = () => {
    setIsViewingPhoto(false);
    setPhoto(null);
    navigateTo(`/album/${album}`);

    document.body.classList.remove('overflow-hidden');
  };

  const handleOnSelect = (e: BaseSyntheticEvent, photoId: string) => {
    props.onSelectionChange(e, photoId);
  };

  return (
    <div className="photo-grid">
      {photosContext.map((photo: any) => (
        <RenderPhoto
          photo={photo}
          key={photo.id}
          onClick={handleOnClickPhoto}
          onSelect={handleOnSelect}
        />
      ))}
      {isViewingPhoto &&
        (
          <PhotoOverlay
            album={album!}
            photo={photo!}
            onClose={handleOnCloseViewer}
          />
        )
      }
    </div>
  );
}

interface RenderPhotoPropsInterface {
  photo: PhotoInterface;
  onClick: (e: BaseSyntheticEvent, photo: PhotoInterface) => void;
  onSelect: (e: BaseSyntheticEvent, photoId: string) => void;
}

function RenderPhoto(props: RenderPhotoPropsInterface) {
  const userContext = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [isSelected, setIsSelected] = useState(false);

  const handleOnLoad = () => {
    setLoading(false);
  };

  const handleOnClick = (e: BaseSyntheticEvent) => {
    props.onClick(e, props.photo);
  };

  const handleOnSelect = (e: BaseSyntheticEvent) => {
    e.stopPropagation();
    props.onSelect(e, props.photo.id);
    setIsSelected(!isSelected);
  };

  return (
    <div className={'photo-item ' + (isSelected ? 'scale-90' : '')} onClick={handleOnClick}>
      <div className={'photo-item__skeleton ' + (loading ? 'block' : 'hidden')}></div>
      <img
        className={'w-full rounded ' + (loading ? 'hidden' : 'block')}
        src={import.meta.env.VITE_API + 'photo/single?photoId=' + props.photo.id + '&digest=' + userContext.digest}
        alt={props.photo.name} onLoad={handleOnLoad}
      />
      <div className="photo-item__hover-effect">
        <input
          onClick={handleOnSelect}
          type="checkbox"
          className="checkbox"
        />
      </div>
    </div>
  );
}

export default Album;
