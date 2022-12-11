import { BaseSyntheticEvent, useCallback, useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { PhotosContext } from '../contexts/PhotosContext';
import { PhotoInterface } from '../interfaces/PhotoInterface';
import { useApiRequest } from '../hooks/UseApiRequest';
import { usePhotoUpload } from '../hooks/UsePhotoUpload';
import { BlurhashCanvas } from 'react-blurhash';
import UserLayout from '../layouts/UserLayout';
import DeleteAlbumDialog from '../blocks/dialogs/DeleteAlbumDialog';
import PhotoOverlay from '../blocks/overlays/PhotoOverlay';
import UploadPhotoDialog from '../blocks/dialogs/UploadPhotoDialog';
import PhotosDropdown from '../blocks/dropdowns/PhotosDropdown';
import DeletePhotosDialog from '../blocks/dialogs/DeletePhotosDialog';
import MovePhotosDialog from '../blocks/dialogs/MovePhotosDialog';
import EditAlbumDialog from '../blocks/dialogs/EditAlbumDialog';

import './Album.scss';
import { AlbumType } from '../interfaces/Types';

export default function Album() {
  const { albumId } = useParams();
  const navigateTo = useNavigate();

  const [album, setAlbum] = useState<any>();
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeletingAlbum, setIsDeletingAlbum] = useState(false);
  const [isOpenDeleteAlbum, setIsOpenDeleteAlbum] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isOpenUploadPhoto, setIsOpenUploadPhoto] = useState(false);
  const [isMovingPhotos, setIsMovingPhotos] = useState(false);
  const [isOpenMovePhotos, setIsOpenMovePhotos] = useState(false);
  const [isDeletingPhotos, setIsDeletingPhotos] = useState(false);
  const [isOpenDeletePhotos, setIsOpenDeletePhotos] = useState(false);
  const [isEditingAlbum, setIsEditingAlbum] = useState(false);
  const [isOpenEditAlbum, setIsOpenEditAlbum] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  const getAllPhotos = useCallback(async () => {
    const searchParams = new URLSearchParams();
    searchParams.append('album', albumId as string);

    const { request } = useApiRequest();
    const { data, error } = await request({
      route: '/photo/all?' + searchParams,
      withAuth: true,
    });

    if ( error ) {
      // console.log(error);
    }

    if ( data ) {
      setPhotos(data);
      setLoading(false);
    }
  }, []);

  const getAlbumData = useCallback(async () => {
    const queryParams = new URLSearchParams();
    queryParams.append('albumId', albumId as string);

    const { request } = useApiRequest();
    const { data, error } = await request({
      route: '/album/?' + queryParams,
      withAuth: true,
    });

    if ( error ) {
      console.error(error);
    }

    if ( data ) {
      setAlbum(data.album);
    }
  }, []);

  useEffect(() => {
    getAllPhotos();
    getAlbumData();
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

    const { request } = useApiRequest();
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

    const { data, error } = await usePhotoUpload({
      albumId: albumId!,
      formData: formData
    });
    if ( error ) {
      throw new Error(error);
    }

    if ( data ) {
      setPhotos([...data.photos, ...photos]);
    }

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

    const { request } = useApiRequest();
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

    const { request } = useApiRequest();
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

  const onOpenEditAlbum = () => {
    setIsOpenEditAlbum(true);
  };

  const onConfirmEditAlbum = async (payload: AlbumType) => {
    setIsEditingAlbum(true);

    const queryParams = new URLSearchParams();
    queryParams.append('albumId', albumId as string);

    const { request } = useApiRequest();
    const { data, error } = await request({
      route: '/album',
      params: queryParams,
      method: 'put',
      withAuth: true,
      payload: payload,
    });

    if ( error ) {
      console.error(error);
    }

    if ( data ) {
      const a = album;
      if ( payload.albumName ) {
        a.name = payload.albumName;
      }
      if ( payload.albumCover ) {
        a.cover = payload.albumCover;
      }
      setAlbum(a);
      setIsEditingAlbum(false);
      setIsOpenEditAlbum(false);
    }
  };

  const onCancelEditAlbum = () => {
    setIsOpenEditAlbum(false);
  };

  return (
    <UserLayout>
      <div className="page-top">
        {album && album.name}
        <PhotosDropdown
          onClickDeleteAlbum={onOpenDeleteAlbum}
          onClickEditAlbum={onOpenEditAlbum}
          onClickUploadPhotos={onOpenUploadPhoto}
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
      {isOpenEditAlbum &&
        <EditAlbumDialog
          dialogIsActioning={isEditingAlbum}
          onConfirm={onConfirmEditAlbum}
          onCancel={onCancelEditAlbum}
          albumName={album.name}
          albumCover={album.cover}
        />
      }
      {isOpenDeleteAlbum &&
        <DeleteAlbumDialog
          onConfirm={onConfirmDeleteAlbum}
          onCancel={onCancelDeleteAlbum}
          dialogIsActioning={isDeletingAlbum}
        />
      }
      {isOpenUploadPhoto &&
        <UploadPhotoDialog
          dialogIsActioning={isUploadingPhoto}
          onConfirm={onConfirmUploadPhoto}
          onCancel={onCancelUploadPhoto}
        />
      }
      {isOpenMovePhotos &&
        <MovePhotosDialog
          dialogIsActioning={isMovingPhotos}
          onConfirm={onMovePhotosConfirm}
          onCancel={onMovePhotosCancel}
        />
      }
      {isOpenDeletePhotos &&
        <DeletePhotosDialog
          dialogIsActioning={isDeletingPhotos}
          onConfirm={onDeletePhotosConfirm}
          onCancel={onDeletePhotosCancel}
        />
      }
    </UserLayout>
  );
}

interface RenderPhotoListPropsInterface {
  onSelectionChange: (e: BaseSyntheticEvent, selection: string) => void;
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
}

function RenderPhoto(props: RenderPhotoPropsInterface) {
  const [userContext] = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [isSelected, setIsSelected] = useState(false);
  const [heightRatio, setHeightRatio] = useState(0);

  useEffect(() => {
    const hr = (props.photo.height * 100) / props.photo.width;
    setHeightRatio(() => hr);
  }, []);

  const handleOnLoad = () => {
    setLoading(() => false);
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
      className={'photo-item ' + (isSelected ? 'scale-90' : '')}
      onClick={handleOnClick}
    >
      <BlurhashCanvas
        hash={props.photo.blurhash.hash}
        height={32}
        width={32}
      />
      <img
        src={import.meta.env.VITE_API + '/photo/single?photoId=' + props.photo.id + '&digest=' + userContext.digest}
        alt={props.photo.name} onLoad={handleOnLoad}
        loading="lazy"
        sizes="(max-width: 600px) 480px, 800px"
      />
      <div style={{
        paddingBottom: `${heightRatio}%`
      }}></div>
      <div className={`photo-item__hover-effect`}>
        <input
          onClick={handleOnSelect}
          type="checkbox"
          className="checkbox"
        />
      </div>
    </div>
  );
}
