import { RefObject, useEffect, useState } from 'react';

export function useImagePreview(file: Blob, previewRef: RefObject<HTMLImageElement>) {
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    if ( file !== null ) {
      setLoadingPreview(() => true);
      const reader = new FileReader();
      reader.onloadend = () => {
        if ( reader.result ) {
          previewRef.current!.src = reader.result as string;
          setLoadingPreview(() => false);
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  return [loadingPreview];
}
