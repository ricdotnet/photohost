import { useParams } from 'react-router-dom';
import { usePhotosDropdown } from '../../hooks/UsePhotosDropdown';
import { PhotosDropDownPropsInterface } from '../../interfaces/PropsInterfaces';
import Dropdown from '../../components/dropdown/Dropdown';
import DropdownChild from '../../components/dropdown/DropdownChild';
import Button from '../../components/button/Button';
import ChevronUpIcon from '../../components/icons/ChevronUpIcon';
import ChevronDownIcon from '../../components/icons/ChevronDownIcon';

export default function PhotosDropdown(props: PhotosDropDownPropsInterface) {

  const { albumId } = useParams();

  const {
    isOpen,
    onButtonClick,
    onRemoteClose,
    onClickEdit,
    onClickUpload,
    onClickDeleteAlbum,
    onClickMoveAllSelected,
    onClickDeleteAllSelected
  } = usePhotosDropdown(props);

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
          disabled={albumId === 'default-album'}
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
