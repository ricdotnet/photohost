import { BaseSyntheticEvent, useRef, useState } from 'react';
import { toastEventChannel } from '../../bus/ToastEventChannel';
import { ToastInterface } from '../../components/toast/Toast';
import Dialog from '../../components/dialog/Dialog';
import CrossIcon from '../../components/icons/CrossIcon';

import './UploadPhotoDialog.scss';

interface UploadPhotoDialogPropsInterface {
  dialogIsActioning: boolean;
  onConfirm: (e: BaseSyntheticEvent, formData: FormData) => void;
  onCancel: (e: BaseSyntheticEvent | KeyboardEvent) => void;
}

export default function UploadPhotoDialog(props: UploadPhotoDialogPropsInterface) {

  const fileInput = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleOnConfirm = (e: BaseSyntheticEvent) => {
    if ( !files.length ) return;

    let formData = new FormData();
    for ( const file of files ) {
      formData.append(file.name, file);
    }
    props.onConfirm(e, formData);
  };

  const handleOnCancel = (e: BaseSyntheticEvent | KeyboardEvent) => {
    props.onCancel(e);
  };

  const handleDragOver = (e: BaseSyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDraggingOver(e.type === 'dragover');
  };

  const handleDrop = (e: DragEvent | BaseSyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDraggingOver(false);

    if ( e.type === 'change' ) {
      handleFileSelect(e.target.files);
      fileInput.current!.value = '';
      return;
    }

    if ( !('dataTransfer' in e) ) return;
    if ( !e.dataTransfer ) return;

    handleFileSelect(e.dataTransfer.files);
    fileInput.current!.value = '';
  };

  const handleFileSelect = (fileList: FileList) => {
    let tmp: File[] = [];
    for ( let i = 0; i < fileList.length; i++ ) {
      if ( i === 5 ) break;

      if ( !fileList[i].type.includes('image/') ) {
        const toast: ToastInterface = {
          id: Date.now(),
          content: 'Please select only images.',
          type: 'warning',
        };
        toastEventChannel.dispatch('onAddToast', toast);
        break;
      }

      if ( !files.find(f => f.name === fileList[i].name) ) {
        tmp.push(fileList[i]);
      }
    }
    tmp = [...files, ...tmp];
    setFiles(tmp);
  };

  const handleRemoveFile = (e: BaseSyntheticEvent, name: string) => {
    const tmp = files.filter(file => file.name !== name);
    setFiles(tmp);
  };

  return (
    <Dialog
      title="Upload a photo"
      controls={files.length > 0}
      onConfirm={handleOnConfirm}
      onCancel={handleOnCancel}
      isConfirming={props.dialogIsActioning}
    >
      {files.length === 5 ? null :
        (
          <div
            className={'draggable-zone ' + (isDraggingOver ? 'border-gray-800' : 'border-gray-300')}
            onDragOver={handleDragOver}
            onDragLeave={handleDragOver}
            onDrop={handleDrop}
          >
            {isDraggingOver ?
              (
                <label htmlFor="file-input">
                  Drop files here to upload.
                </label>
              )
              :
              (
                <label htmlFor="file-input">
                  Drag files here to upload or click to select files.
                  You can select up to 5 files.
                </label>
              )
            }
            <input
              onChange={handleDrop}
              id="file-input"
              className="w-full h-full hidden"
              type="file"
              ref={fileInput}
              multiple
            />
          </div>
        )
      }
      {files.map((file: any, index: number) => (
        <div key={index} className="flex justify-between items-center">
          <div className="w-full overflow-hidden text-ellipsis">{file.name}</div>
          <button
            className="remove-button"
            onClick={(e) => handleRemoveFile(e, file.name)}
            type="button"
          >
            <CrossIcon className="w-5 h-5 flex-shrink-0"/>
          </button>
        </div>
      ))}
    </Dialog>
  );
}
