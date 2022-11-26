import { useEffect, useState } from 'react';
import Nav from '../blocks/nav/Nav';
import ToastContainer from '../blocks/toasts/ToastContainer';
import GlobalUploadDialog from '../blocks/dialogs/GlobalUploadDialog';

import './UserLayout.scss';

function UserLayout({ children }: any) {

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [imageFile, setImageFile] = useState<any>(null);

  const [isCmdPressed, setIsCommandPressed] = useState(false);

  useEffect(() => {
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);

    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
    }
  }, [isCmdPressed]);

  const keyDownHandler = async (e: any) => {
    if (!isCmdPressed && (e.key === 'Meta' || e.key === 'Control')) {
      setIsCommandPressed(() => true);
    }
    if (isCmdPressed && e.key === 'v') {
      const items = await navigator.clipboard.read();
      for (let item of items) {
        const blob = await item.getType(item.types[0]);
        setImageFile(blob);
      }
    }
  }

  const keyUpHandler = (e: any) => {
    if (isCmdPressed && (e.key === 'Meta' || e.key === 'Control')) {
      setIsCommandPressed(() => false);
    }
  }

  const canDoGlobalUpload = (): boolean => {
    for(const child of children) {
      if (!child?.key && child?.type?.name?.includes('Dialog')) {
        return false;
      }
    }

    return true;
  }

  const handleOnDragOver = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (!canDoGlobalUpload()) return;
    setIsDraggingOver(() => true);
  };

  const handleOnDragLeave = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDraggingOver(() => false);
  };

  const handleOnDrop = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (!canDoGlobalUpload()) return;
    setIsDraggingOver(() => false);
    setImageFile(() => {
      return e.dataTransfer.files[0];
    });
  };

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
        onCancel={() => setImageFile(() => null)}
        file={imageFile}
      />}
    </div>
  );
}

export default UserLayout;
