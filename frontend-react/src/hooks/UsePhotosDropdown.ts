import { useState } from 'react';
import { PhotosDropDownPropsInterface } from '../interfaces/PropsInterfaces';

export const usePhotosDropdown = (props: PhotosDropDownPropsInterface) => {
  const [isOpen, setIsOpen] = useState(false);

  const onButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const onRemoteClose = () => {
    setIsOpen(false);
  };

  const onClickEdit = () => {
    props.onClickEditAlbum();
  };

  const onClickUpload = () => {
    props.onClickUploadPhotos();
  };

  const onClickDeleteAlbum = () => {
    props.onClickDeleteAlbum();
  };

  const onClickMoveAllSelected = () => {
    props.onClickMoveAllSelected();
  };

  const onClickDeleteAllSelected = () => {
    props.onClickDeleteAllSelected();
  };

  return {
    isOpen,
    onButtonClick,
    onRemoteClose,
    onClickEdit,
    onClickUpload,
    onClickDeleteAlbum,
    onClickMoveAllSelected,
    onClickDeleteAllSelected,
  };
};
