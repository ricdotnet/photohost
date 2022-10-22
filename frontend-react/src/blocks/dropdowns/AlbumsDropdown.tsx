import { useState } from 'react';
import Dropdown from '../../components/dropdown/Dropdown';
import Button from '../../components/button/Button';
import DropdownChild from '../../components/dropdown/DropdownChild';
import ChevronDownIcon from '../../components/icons/ChevronDownIcon';
import ChevronUpIcon from '../../components/icons/ChevronUpIcon';

interface AlbumsDropdownPropsInterface {
  onAddAlbumClick: () => void;
}

export default function AlbumsDropdown(props: AlbumsDropdownPropsInterface) {

  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  const onAddAlbumClick = () => {
    props.onAddAlbumClick();
  };

  return (
    <div className="relative">
      <Button
        type="button"
        variant="primary"
        handleClick={onClick}
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
        id="albumsDropdown"
        isOpen={isOpen}
        handleRemoteClose={onClick}
      >
        <DropdownChild
          value="Add new album"
          handleOnClick={onAddAlbumClick}
        />
      </Dropdown>
    </div>
  );
}
