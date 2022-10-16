import React, { BaseSyntheticEvent, useRef, useState } from 'react';
import Input from '../../components/input/Input';
import Dialog from '../../components/dialog/Dialog';

interface NewAlbumDialogPropsInterface {
  dialogIsActioning: boolean;
  onConfirm: (e: BaseSyntheticEvent, albumName: string) => void;
  onCancel: (e: BaseSyntheticEvent | KeyboardEvent) => void;
}

function NewAlbumDialog(props: NewAlbumDialogPropsInterface) {

  const inputRef = useRef(null);

  const [albumName, setAlbumName] = useState('');
  const [albumNameError, setAlbumNameError] = useState(false);

  const handleAlbumNameChange = (d: string) => {
    if ( albumNameError ) setAlbumNameError(false);

    setAlbumName(d);
  };

  const handleOnConfirm = (e: BaseSyntheticEvent) => {
    if ( !albumName ) return setAlbumNameError(true);
    props.onConfirm(e, albumName);
  };

  const handleOnCancel = (e: BaseSyntheticEvent | KeyboardEvent) => {
    props.onCancel(e);
  };

  return (
    <Dialog title="Create a new album"
            controls={true}
            onConfirm={handleOnConfirm}
            onCancel={handleOnCancel}
            isConfirming={props.dialogIsActioning}>
      <Input ref={inputRef}
             handleChange={handleAlbumNameChange} id="album-name"
             label="album-name"
             placeholder="New album name"
             hasError={albumNameError}/>
    </Dialog>
  );
}

export default NewAlbumDialog;
