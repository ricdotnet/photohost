import { BaseSyntheticEvent, useEffect, useRef, useState } from 'react';
import Dialog from '../../components/dialog/Dialog';

interface MovePhotosDialogPropsInterface {
  dialogIsActioning: boolean;
  onConfirm: (e: BaseSyntheticEvent, albumId: string) => void;
  onCancel: (e: BaseSyntheticEvent | KeyboardEvent) => void;
}

export default function MovePhotosDialog(props: MovePhotosDialogPropsInterface) {

  const selectRef = useRef<HTMLSelectElement>(null);
  const [albums, setAlbums] = useState<any[]>([]);

  useEffect(() => {
    const url = new URL(`${import.meta.env.VITE_API}album/all`);

    fetch(url, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('access-token')}`
      }
    })
      .then((response) => response.json())
      .then((data) => setAlbums(data.albums));
  }, []);

  const onConfirmClick = (e: BaseSyntheticEvent) => {
    props.onConfirm(e, selectRef.current!.value);
  };

  return (
    <Dialog
      title="Move selected photos"
      controls={true}
      onConfirm={onConfirmClick}
      onCancel={props.onCancel}
      isConfirming={props.dialogIsActioning}
    >
      <select ref={selectRef}>
        {albums.map(a => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>
    </Dialog>
  );
}
