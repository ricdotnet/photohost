import { BaseSyntheticEvent, useCallback, useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { PhotosContext } from '../contexts/PhotosContext';
import { useApiRequest } from '../hooks/UseApiRequest';
import { usePhotoUpload } from '../hooks/UsePhotoUpload';
import { useThumbnail } from '../hooks/UseThumbnail';
import { BlurhashCanvas } from 'react-blurhash';
import { AlbumType } from '../interfaces/Types';
import { PhotoInterface } from '../interfaces/PhotoInterface';
import { RenderPhotoPropsInterface } from '../interfaces/RenderPhotoPropsInterface';
import UserLayout from '../layouts/UserLayout';
import DeleteAlbumDialog from '../blocks/dialogs/DeleteAlbumDialog';
import PhotoOverlay from '../blocks/overlays/PhotoOverlay';
import UploadPhotoDialog from '../blocks/dialogs/UploadPhotoDialog';
import PhotosDropdown from '../blocks/dropdowns/PhotosDropdown';
import DeletePhotosDialog from '../blocks/dialogs/DeletePhotosDialog';
import MovePhotosDialog from '../blocks/dialogs/MovePhotosDialog';
import EditAlbumDialog from '../blocks/dialogs/EditAlbumDialog';

import './Album.scss';
import Loading from '../components/loading/Loading';
import SpinnerIcon from '../components/icons/SpinnerIcon';

// TODO: Extract logic into a hook?
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
    const { error } = await request({
      route: '/photo/move',
      method: 'post',
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
    const { error } = await request({
      route: '/photo/delete',
      method: 'delete',
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
      method: 'patch',
      withAuth: true,
      payload: payload,
    });

    if ( error ) {
      throw new Error(error);
    }

    if ( data ) {
      const a = album;
      a.name = payload.albumName;
      a.cover = payload.albumCover;
      a.random_cover = payload.randomCover;
      setAlbum(() => a);
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
      <Loading loading={loading} message={<SpinnerIcon className="w-10 mx-auto"/>}>
        <PhotosContext.Provider value={photos}>
          <RenderPhotoList
            onSelectionChange={handleOnSelectionChange}
          />
        </PhotosContext.Provider>
      </Loading>
      {isOpenEditAlbum &&
        <EditAlbumDialog
          dialogIsActioning={isEditingAlbum}
          onConfirm={onConfirmEditAlbum}
          onCancel={onCancelEditAlbum}
          albumName={album.name}
          albumCover={album.cover}
          randomCover={album.random_cover}
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

function RenderPhoto(props: RenderPhotoPropsInterface) {

  const {
    loading,
    isSelected,
    heightRatio,
    thumbnailRef,
    handleOnClick,
    handleOnLoad,
    handleOnSelect
  } = useThumbnail(props);

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
      {/*{loadingPreview && <SpinnerIcon className="w-5 mx-auto"/>}*/}
      <img
        className={loading ? 'hidden' : 'block'}
        ref={thumbnailRef}
        alt={props.photo.name}
        onLoad={handleOnLoad}
        // loading="eager"
        sizes="(max-width: 600px) 480px, 800px"
      />
      <div style={{
        paddingBottom: `${heightRatio}%`
      }}></div>
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
