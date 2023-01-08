import { BaseSyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useApiRequest } from '../../hooks/UseApiRequest';
import Dialog from '../../components/dialog/Dialog';
import SpinnerIcon from '../../components/icons/SpinnerIcon';
import Loading from '../../components/loading/Loading';

interface MovePhotosDialogPropsInterface {
  dialogIsActioning: boolean;
  onConfirm: (e: BaseSyntheticEvent, albumId: string) => void;
  onCancel: (e: BaseSyntheticEvent | KeyboardEvent) => void;
}

export default function MovePhotosDialog(props: MovePhotosDialogPropsInterface) {

  const selectRef = useRef<HTMLSelectElement>(null);
  const [albums, setAlbums] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { request } = useApiRequest();

  const getAllAlbums = useCallback(async () => {
    const { data, error } = await request({
      route: '/album/all',
    });

    if ( error ) throw new Error(error);

    if ( data ) {
      setAlbums(data.albums);
      setIsLoading(false);
    }

  }, []);

  useEffect(() => {
    getAllAlbums();
  }, [getAllAlbums]);

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
      <Loading loading={isLoading} message={<SpinnerIcon className="w-5 mx-auto"/>}>
        <select ref={selectRef}>
          {albums.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </Loading>
    </Dialog>
  );
}
