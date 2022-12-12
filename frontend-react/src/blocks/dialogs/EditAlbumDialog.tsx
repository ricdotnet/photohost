import { BaseSyntheticEvent, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { InputRefInterface } from '../../interfaces/InputRefInterface';
import { EditAlbumDialogPropsInterface } from '../../interfaces/PropsInterfaces';
import Input from '../../components/input/Input';
import Dialog from '../../components/dialog/Dialog';

export default function EditAlbumDialog(props: EditAlbumDialogPropsInterface) {

  const { albumId } = useParams();

  const albumNameRef = useRef<InputRefInterface>(null);
  const albumCoverRef = useRef<InputRefInterface>(null);

  const [albumNameError, setAlbumNameError] = useState(false);

  useEffect(() => {
    albumNameRef.current!.setValue(props.albumName);
    albumCoverRef.current!.setValue(props.albumCover);
  }, []);

  const handleOnConfirm = (e: BaseSyntheticEvent) => {
    if ( !albumNameRef.current!.value() ) return setAlbumNameError(true);
    props.onConfirm({
      albumName: albumNameRef.current!.value(),
      albumCover: albumCoverRef.current!.value(),
    });
  };

  const handleOnCancel = (e: BaseSyntheticEvent | KeyboardEvent) => {
    props.onCancel(e);
  };

  return (
    <Dialog
      title="Edit the album"
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
        disabled={albumId === 'default-album'}
      />
      <Input
        ref={albumCoverRef}
        id="album-cover"
        label="album-cover"
        placeholder="New album cover"
        disabled={albumId === 'default-album'}
      />
    </Dialog>
  );
}
