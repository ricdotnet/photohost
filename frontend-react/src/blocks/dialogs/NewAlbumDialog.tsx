import { BaseSyntheticEvent, useRef, useState } from 'react';
import { InputRefInterface } from '../../interfaces/InputRefInterface';
import Input from '../../components/input/Input';
import Dialog from '../../components/dialog/Dialog';

interface NewAlbumDialogPropsInterface {
  dialogIsActioning: boolean;
  onConfirm: (e: BaseSyntheticEvent, albumName: string) => void;
  onCancel: (e: BaseSyntheticEvent | KeyboardEvent) => void;
}

export default function NewAlbumDialog(props: NewAlbumDialogPropsInterface) {

  const albumNameRef = useRef<InputRefInterface>(null);

  const [albumNameError, setAlbumNameError] = useState(false);

  const handleOnConfirm = (e: BaseSyntheticEvent) => {
    if ( !albumNameRef.current!.value() ) return setAlbumNameError(true);
    props.onConfirm(e, albumNameRef.current!.value());
  };

  const handleOnCancel = (e: BaseSyntheticEvent | KeyboardEvent) => {
    props.onCancel(e);
  };

  return (
    <Dialog
      title="Create a new album"
      controls={true}
      onConfirm={handleOnConfirm}
      onCancel={handleOnCancel}
      isConfirming={props.dialogIsActioning}
    >
      <Input
        ref={albumNameRef}
        id="album-name"
        label="album-name"
        placeholder="New album name"
        handleOnFocus={() => setAlbumNameError(false)}
        hasError={albumNameError}
      />
    </Dialog>
  );
}
