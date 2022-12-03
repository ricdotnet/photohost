import { ReactElement } from 'react';
import { useGlobalUpload } from '../hooks/UseGlobalUpload';
import Nav from '../blocks/nav/Nav';
import ToastContainer from '../blocks/toasts/ToastContainer';
import GlobalUploadDialog from '../blocks/dialogs/GlobalUploadDialog';

import './UserLayout.scss';

interface UserLayoutPropsInterface {
  children: ReactElement[];
}

export default function UserLayout({ children }: UserLayoutPropsInterface) {

  const {
    handleOnDragOver,
    handleOnDragLeave,
    handleOnDrop,
    handleResetImage,
    isDraggingOver,
    imageFile
  } = useGlobalUpload();

  return (
    <div
      onDragOver={handleOnDragOver}
      onDragLeave={handleOnDragLeave}
      onDrop={handleOnDrop}
    >
      <Nav/>
      <div
        className="main-content"
        aria-label="main-content"
      >
        {children}
      </div>
      <ToastContainer/>
      {isDraggingOver && <div className="upload-overlay">Drop images here</div>}
      {imageFile && <GlobalUploadDialog
        dialogIsActioning={false}
        onConfirm={() => console.log('confirmed')}
        onCancel={handleResetImage}
        file={imageFile}
      />}
    </div>
  );
}
