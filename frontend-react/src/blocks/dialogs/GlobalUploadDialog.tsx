import { BaseSyntheticEvent, useRef } from 'react';
import { useImagePreview } from '../../hooks/UseImagePreview';
import Dialog from '../../components/dialog/Dialog';
import SpinnerIcon from '../../components/icons/SpinnerIcon';

interface GlobalUploadDialogInterface {
  dialogIsActioning: boolean;
  onConfirm: (e: BaseSyntheticEvent) => void;
  onCancel: (e: BaseSyntheticEvent | KeyboardEvent) => void;
  file?: any;
}

export default function GlobalUploadDialog({
  dialogIsActioning,
  onCancel,
  onConfirm,
  file
}: GlobalUploadDialogInterface) {

  const previewRef = useRef<HTMLImageElement>(null);
  const [loadingPreview] = useImagePreview(file, previewRef);

  return (
    <Dialog
      title="Preview your image"
      controls={true}
      onConfirm={onConfirm}
      onCancel={onCancel}
      isConfirming={dialogIsActioning}
    >
      {loadingPreview && <SpinnerIcon className="w-5 mx-auto"/>}
      <img className={loadingPreview ? 'hidden' : 'block'} ref={previewRef} alt="image preview"/>
    </Dialog>
  );
}
