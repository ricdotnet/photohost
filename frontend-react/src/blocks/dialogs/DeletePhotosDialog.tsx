import { BaseSyntheticEvent } from 'react';
import Dialog from '../../components/dialog/Dialog';

interface DeletePhotosDialogPropsInterface {
  dialogIsActioning: boolean;
  onConfirm: (e: BaseSyntheticEvent) => void;
  onCancel: (e: BaseSyntheticEvent | KeyboardEvent) => void;
}

export default function DeletePhotosDialog(props: DeletePhotosDialogPropsInterface) {

  return (
    <Dialog
      title="Delete selected photos"
      controls={true}
      onConfirm={props.onConfirm}
      onCancel={props.onCancel}
      isConfirming={props.dialogIsActioning}
    >
      <span>
        Are you sure you want to delete the selected photos?
        This action is irreversible.
      </span>
    </Dialog>
  );
}
