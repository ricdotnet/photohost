import { AlbumType } from './Types';
import { BaseSyntheticEvent } from 'react';

export interface PhotosDropDownPropsInterface {
  onClickDeleteAlbum: () => void;
  onClickEditAlbum: () => void;
  onClickUploadPhotos: () => void;
  onClickMoveAllSelected: () => void;
  onClickDeleteAllSelected: () => void;
  showSelectionOptions: boolean;
}

export interface EditAlbumDialogPropsInterface {
  dialogIsActioning: boolean;
  onConfirm: (albumInfo: AlbumType) => void;
  onCancel: (e: BaseSyntheticEvent | KeyboardEvent) => void;
  albumName: string;
  albumCover: string;
}
