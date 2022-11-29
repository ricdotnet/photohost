import Dialog from '../../components/dialog/Dialog';
import { BaseSyntheticEvent, useEffect, useRef, useState } from 'react';
import SpinnerIcon from '../../components/icons/SpinnerIcon';

interface GlobalUploadDialogInterface {
  dialogIsActioning: boolean;
  onConfirm: (e: BaseSyntheticEvent) => void;
  onCancel: (e: BaseSyntheticEvent | KeyboardEvent) => void;
  file?: any;
}

export default function GlobalUploadDialog(props: GlobalUploadDialogInterface) {

  const [loadingPreview, setLoadingPreview] = useState(false);
  const previewRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if ( props.file !== null ) {
      console.log(props.file);
      setLoadingPreview(() => true);
      const reader = new FileReader();
      reader.onloadend = () => {
        if ( reader.result ) {
          previewRef.current!.src = reader.result as string;
          setLoadingPreview(() => false);
        }
      };
      reader.readAsDataURL(props.file);
    }
  }, []);

  return (
    <Dialog
      title="Preview your image"
      controls={true}
      onConfirm={props.onConfirm}
      onCancel={props.onCancel}
      isConfirming={props.dialogIsActioning}
    >
      {loadingPreview && <SpinnerIcon className="w-5 mx-auto"/>}
      <img className={loadingPreview ? 'hidden' : 'block'} ref={previewRef} alt="image preview"/>
    </Dialog>
  );
}
