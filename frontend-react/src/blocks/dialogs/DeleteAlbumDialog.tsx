import { BaseSyntheticEvent } from 'react';
import Dialog from '../../components/dialog/Dialog';

interface DeleteAlbumDialogPropsInterface {
  dialogIsActioning: boolean;
  onConfirm: (e: BaseSyntheticEvent) => void;
  onCancel: (e: BaseSyntheticEvent | KeyboardEvent) => void;
}

function DeleteAlbumDialog(props: DeleteAlbumDialogPropsInterface) {

  return (
    <Dialog title="Delete album"
            controls={true}
            onConfirm={props.onConfirm}
            onCancel={props.onCancel}
            isConfirming={props.dialogIsActioning}>
      <span>
        Are you sure you want to delete this album?
        Any photos here will be moved to 'default-album'.
      </span>
    </Dialog>
  );
}

export default DeleteAlbumDialog;
