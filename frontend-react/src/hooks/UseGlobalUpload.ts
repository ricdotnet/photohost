import { useEffect, useState } from 'react';

export const useGlobalUpload = () => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [imageFile, setImageFile] = useState<any>(null);

  const [isCmdPressed, setIsCommandPressed] = useState(false);

  useEffect(() => {
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);

    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
    };
  }, [isCmdPressed]);

  const keyDownHandler = async (e: any) => {
    if ( !isCmdPressed && (e.key === 'Meta' || e.key === 'Control') ) {
      setIsCommandPressed(() => true);
    }
    if ( isCmdPressed && e.key === 'v' ) {
      if ( !canDoGlobalUpload() ) return;
      try {
        const items = await navigator.clipboard.read();
        for ( let item of items ) {
          const types = item.types.filter(t => t.includes('image/'));
          const blob = await item.getType(types[0]);
          setImageFile(blob);
        }
      } catch (err) {
        // silently catch any error
      }
    }
  };

  const keyUpHandler = (e: any) => {
    if ( isCmdPressed && (e.key === 'Meta' || e.key === 'Control') ) {
      setIsCommandPressed(() => false);
    }
  };

  const canDoGlobalUpload = (): boolean => {
    const currentDialog = document.querySelector('[aria-label="dialog-box"]');
    return currentDialog === null;
  };

  const handleOnDragOver = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    if ( !canDoGlobalUpload() ) return;
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
    if ( !canDoGlobalUpload() ) return;
    setIsDraggingOver(() => false);
    setImageFile(() => {
      return e.dataTransfer.files[0];
    });
  };

  const handleResetImage = () => {
    setImageFile(null);
  };

  return {
    handleOnDragOver,
    handleOnDragLeave,
    handleOnDrop,
    handleResetImage,
    isDraggingOver,
    imageFile,
  };
}
