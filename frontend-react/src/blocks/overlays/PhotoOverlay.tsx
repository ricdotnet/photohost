import { BaseSyntheticEvent, useContext, useEffect } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { PhotoInterface } from '../../interfaces/PhotoInterface';

import './PhotoOverlay.scss';
import CrossIcon from '../../components/icons/CrossIcon';
import DownloadIcon from '../../components/icons/DownloadIcon';

interface PhotoOverlayPropsInterface {
  photo: PhotoInterface;
  onClose: (e: KeyboardEvent | BaseSyntheticEvent) => void;
}

function PhotoOverlay(props: PhotoOverlayPropsInterface) {
  const userContext = useContext(UserContext);

  useEffect(() => {
    document.addEventListener('keyup', (e: KeyboardEvent) => {
      if ( !props.onClose ) return;
      if ( e.key === 'Escape' ) {
        props.onClose(e);
      }
    });

    return () => {
      document.removeEventListener('keyup', () => {
      });
    };
  }, []);

  const handleOnClickClose = (e: BaseSyntheticEvent) => {
    props.onClose(e);
  };

  return (
    <div className="background">
      <div className="overlay-actions">
        <DownloadIcon className="w-6 text-white cursor-pointer"/>
        <div onClick={handleOnClickClose}>
          <CrossIcon className="w-6 text-white cursor-pointer"/>
        </div>
      </div>
      <div className="foreground">
        <img className="mx-auto w-full h-full object-contain"
             src={import.meta.env.VITE_API + 'photo/' + props.photo.name + '?digest=' + userContext.digest}
             alt={props.photo.name}/>
      </div>
    </div>
  );
}

export default PhotoOverlay;
