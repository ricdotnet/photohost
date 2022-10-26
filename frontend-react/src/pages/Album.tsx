import { BaseSyntheticEvent, useCallback, useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { PhotosContext } from '../contexts/PhotosContext';
import { PhotoInterface } from '../interfaces/PhotoInterface';
import { useApiRequest } from '../hooks/UseApiRequest';
import UserLayout from '../layouts/UserLayout';
import DeleteAlbumDialog from '../blocks/dialogs/DeleteAlbumDialog';
import PhotoOverlay from '../blocks/overlays/PhotoOverlay';
import UploadPhotoDialog from '../blocks/dialogs/UploadPhotoDialog';
import PhotosDropdown from '../blocks/dropdowns/PhotosDropdown';
import DeletePhotosDialog from '../blocks/dialogs/DeletePhotosDialog';
import MovePhotosDialog from '../blocks/dialogs/MovePhotosDialog';

import './Album.scss';
import Button from '../components/button/Button';

function Album() {
  const { albumId } = useParams();
  const navigateTo = useNavigate();

  const userContext = useContext(UserContext);

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeletingAlbum, setIsDeletingAlbum] = useState(false);
  const [isOpenDeleteAlbum, setIsOpenDeleteAlbum] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isOpenUploadPhoto, setIsOpenUploadPhoto] = useState(false);
  const [isMovingPhotos, setIsMovingPhotos] = useState(false);
  const [isOpenMovePhotos, setIsOpenMovePhotos] = useState(false);
  const [isDeletingPhotos, setIsDeletingPhotos] = useState(false);
  const [isOpenDeletePhotos, setIsOpenDeletePhotos] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [layout, setLayout] = useState('');

  const { request } = useApiRequest();

  const getAllPhotos = useCallback(async () => {
    const searchParams = new URLSearchParams();
    searchParams.append('album', albumId as string);

    const { data, error } = await request({
      route: '/photo/all?' + searchParams,
      withAuth: true,
    });

    if ( error ) throw new Error(error);

    if ( data ) {
      setPhotos(data);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLayout(userContext.photos_layout);
    getAllPhotos();
  }, []);

  const onOpenDeleteAlbum = () => {
    setIsOpenDeleteAlbum(true);
  };

  const onCancelDeleteAlbum = () => {
    setIsOpenDeleteAlbum(false);
  };

  const onConfirmDeleteAlbum = async () => {
    setIsDeletingAlbum(true);
    const searchParams = new URLSearchParams();
    searchParams.append('id', albumId as string);

    const { data, error } = await request({
      route: '/album?' + searchParams,
      method: 'delete',
      withAuth: true,
    });

    if ( error ) throw new Error(error);

    setIsDeletingAlbum(false);
    navigateTo('/');
  };

  const onOpenUploadPhoto = () => {
    setIsOpenUploadPhoto(true);
  };

  const onCancelUploadPhoto = () => {
    setIsOpenUploadPhoto(false);
  };

  const onConfirmUploadPhoto = async (e: BaseSyntheticEvent, formData: FormData) => {
    setIsUploadingPhoto(true);

    // append the current album
    formData.append('album', albumId as string);

    const { data, error } = await request({
      route: '/photo/upload',
      method: 'post',
      withAuth: true,
      payload: formData,
    });

    if ( error ) throw new Error(error);
    // TODO: add uploaded photos to the list?

    setIsUploadingPhoto(false);
    setIsOpenUploadPhoto(false);
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

  const onMovePhotosConfirm = async (e: BaseSyntheticEvent, aId: string) => {
    if ( aId === albumId ) return;
    setIsMovingPhotos(true);

    const body = {
      album: aId,
      photos: selectedPhotos
    };

    const { data, error } = await request({
      route: '/photo/move',
      method: 'post',
      withAuth: true,
      payload: body,
    });

    if ( error ) throw new Error(error);

    removePhotosFromList();

    setIsMovingPhotos(false);
    setIsOpenMovePhotos(false);
  };

  const handleDeleteAllSelected = () => {
    setIsOpenDeletePhotos(true);
  };

  const onDeletePhotosCancel = () => {
    setIsOpenDeletePhotos(false);
  };

  const onDeletePhotosConfirm = async () => {
    setIsDeletingPhotos(true);

    const body = {
      photos: selectedPhotos,
    };

    const { data, error } = await request({
      route: '/photo/delete',
      method: 'delete',
      withAuth: true,
      payload: body,
    });

    if ( error ) throw new Error(error);

    removePhotosFromList();

    setIsDeletingPhotos(false);
    setIsOpenDeletePhotos(false);
  };

  const removePhotosFromList = () => {
    const tmp = [...photos].filter((p: PhotoInterface) => !selectedPhotos.includes(p.id));

    // whilst removing.... get the next amount of photos equal to the amount taken out of the list

    setPhotos(tmp);
  };

  const onChangeLayout = () => {
    (layout === 'columns')
      ? setLayout('rows')
      : setLayout('columns');
  };

  return (
    <UserLayout>
      <div className="page-top">
        <Button
          variant="primary"
          value="Layout"
          type="button"
          handleClick={onChangeLayout}
        />
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
                layout={layout}
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
  layout: string;
}

function RenderPhotoList(props: RenderPhotoListPropsInterface) {
  const photosContext = useContext(PhotosContext);

  const { albumId, photoId } = useParams();
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
    navigateTo(`/${albumId}/${photo.id}`);

    document.body.classList.add('overflow-hidden');
  };

  const handleOnCloseViewer = () => {
    setIsViewingPhoto(false);
    setPhoto(null);
    navigateTo(`/album/${albumId}`);

    document.body.classList.remove('overflow-hidden');
  };

  const handleOnSelect = (e: BaseSyntheticEvent, photoId: string) => {
    props.onSelectionChange(e, photoId);
  };

  return (
    <div className={'photo-grid-' + props.layout}>
      {photosContext.map((photo: any) => (
        <RenderPhoto
          photo={photo}
          key={photo.id}
          onClick={handleOnClickPhoto}
          onSelect={handleOnSelect}
          layout={props.layout}
        />
      ))}
      {isViewingPhoto &&
        (
          <PhotoOverlay
            album={albumId!}
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
  layout: string;
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
    <div
      className={'photo-item ' + (isSelected ? 'scale-90 ' : '') + (props.layout === 'columns' ? '' : 'flex-shrink-0')}
      onClick={handleOnClick}
    >
      <div
        className={'photo-item__skeleton-' + props.layout + (loading ? ' block' : ' hidden')}></div>
      <img
        className={'photo-item__img-' + props.layout + (loading ? ' hidden' : ' block')}
        src={import.meta.env.VITE_API + '/photo/single?photoId=' + props.photo.id + '&digest=' + userContext.digest}
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
