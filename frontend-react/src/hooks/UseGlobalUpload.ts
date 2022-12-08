import { useContext, useEffect, useState } from 'react';
import { usePhotoUpload } from './UsePhotoUpload';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

export const useGlobalUpload = () => {
  const [userContext] = useContext(UserContext);

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [imageFile, setImageFile] = useState<any>(null);
  const [imageType, setImageType] = useState('');

  const [isCmdPressed, setIsCommandPressed] = useState(false);

  const navigate = useNavigate();

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
          setImageType(types[0].split('/')[1]);
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

  const onConfirmUpload = async () => {
    const formData = new FormData();

    formData.append('file', imageFile);
    formData.append('name', imageFile.name ?? userContext.username + Date.now() + '.' + imageType);
    const { data, error } = await usePhotoUpload({ formData: formData });

    if (error) throw new Error(error);
    if (data) {
      handleResetImage();
      navigate(`/photo/${data.photos[0].id}`);
    }
  }

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
    onConfirmUpload,
  };
};
