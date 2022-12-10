import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Dropdown from '../../components/dropdown/Dropdown';
import DropdownChild from '../../components/dropdown/DropdownChild';
import Button from '../../components/button/Button';
import ChevronUpIcon from '../../components/icons/ChevronUpIcon';
import ChevronDownIcon from '../../components/icons/ChevronDownIcon';

interface PhotosDropDownPropsInterface {
  onClickDeleteAlbum: () => void;
  onClickEditAlbum: () => void;
  onClickUploadPhotos: () => void;
  onClickMoveAllSelected: () => void;
  onClickDeleteAllSelected: () => void;
  showSelectionOptions: boolean;
}

export default function PhotosDropdown(props: PhotosDropDownPropsInterface) {

  const { albumId } = useParams();

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

  return (
    <div className="relative">
      <Button
        variant="primary"
        type="button"
        handleClick={onButtonClick}
      >
        <div className="flex space-x-2 items-center">
          <span>More Options</span>
          {isOpen
            ? (<ChevronUpIcon className="w-5"/>)
            : (<ChevronDownIcon className="w-5"/>)
          }
        </div>
      </Button>
      <Dropdown
        id="photosDropdown"
        isOpen={isOpen}
        handleRemoteClose={onRemoteClose}
      >
        <DropdownChild value="Upload photos" handleOnClick={onClickUpload}/>
        {props.showSelectionOptions &&
          (
            <>
              <DropdownChild
                value="Move all selected"
                handleOnClick={onClickMoveAllSelected}
              />
              <DropdownChild
                value="Delete all selected"
                handleOnClick={onClickDeleteAllSelected}
              />
            </>
          )
        }
        <DropdownChild
          value="Edit Album"
          handleOnClick={onClickEdit}
        />
        <DropdownChild
          value="Delete album"
          handleOnClick={onClickDeleteAlbum}
          disabled={albumId === 'default-album'}
        />
      </Dropdown>
    </div>
  );
}
