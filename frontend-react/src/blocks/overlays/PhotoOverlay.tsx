import { BaseSyntheticEvent, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { PhotoInterface } from '../../interfaces/PhotoInterface';
import { useApiRequest } from '../../hooks/UseApiRequest';
import CrossIcon from '../../components/icons/CrossIcon';
import DownloadIcon from '../../components/icons/DownloadIcon';
import PreviousIcon from '../../components/icons/PreviousIcon';
import NextIcon from '../../components/icons/NextIcon';
import SpinnerIcon from '../../components/icons/SpinnerIcon';

import './PhotoOverlay.scss';

interface PhotoOverlayPropsInterface {
  photo: PhotoInterface;
  album: string;
  onClose: (e: KeyboardEvent | BaseSyntheticEvent) => void;
}

function PhotoOverlay(props: PhotoOverlayPropsInterface) {
  const userContext = useContext(UserContext);

  const navigateTo = useNavigate();
  const { photoId } = useParams();

  const [cursors, setCursors] = useState<{ next: string; prev: string; }>();
  // initiate the loading state when the user clicks a photo
  const [isLoadingNext, setIsLoadingNext] = useState(true);

  const { request } = useApiRequest();

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUpEvent);

    getCursors(props.photo.id);

    return () => {
      document.removeEventListener('keyup', handleKeyUpEvent);
    };
  }, []);

  const handleKeyUpEvent = (e: KeyboardEvent) => {
    if ( !props.onClose ) return;
    if ( e.key === 'Escape' ) {
      props.onClose(e);
    }
  };

  const handleOnClickClose = (e: BaseSyntheticEvent) => {
    props.onClose(e);
  };

  const getCursors = async (currentPhoto: string) => {
    const { data, error } = await request({
      route: '/photo/cursors',
      withAuth: true,
      params: {
        album: props.album,
        photoId: currentPhoto,
      }
    });

    if ( data ) {
      setCursors(data.cursors);
    }

    if ( error ) {
      throw new Error(error);
    }
  };

  const handleNextClick = () => {
    if ( cursors!.next === null ) return;
    setIsLoadingNext(true);
    navigateTo(`/${props.album}/${cursors!.next}`);
    getCursors(cursors!.next);
  };

  const handlePrevClick = () => {
    if ( cursors!.prev === null ) return;
    setIsLoadingNext(true);
    navigateTo(`/${props.album}/${cursors!.prev}`);
    getCursors(cursors!.prev);
  };

  const handleOnLoaded = () => {
    setIsLoadingNext(false);
  };

  const imgUrl = import.meta.env.VITE_API + '/photo/single?photoId=' + photoId + '&digest=' + userContext.digest;

  return (
    <div className="background">
      {!cursors ? null :
        (
          <RenderCursors
            onNext={handleNextClick}
            onPrev={handlePrevClick}
            cursor={cursors}
          />
        )
      }
      <div className="overlay-actions">
        <a
          href={imgUrl}
          className="button-action"
          target="_blank"
        >
          <DownloadIcon className="w-6"/>
        </a>
        <button className="button-action" onClick={handleOnClickClose}>
          <CrossIcon className="w-6"/>
        </button>
      </div>
      <div className={'loader ' + (!isLoadingNext ? 'hidden' : '')}>
        <SpinnerIcon className="w-10 h-10 text-white"/>
      </div>
      <div className="foreground">
        <img
          className={isLoadingNext ? 'hidden' : ''}
          src={imgUrl}
          alt={photoId}
          onLoad={handleOnLoaded}
        />
      </div>
    </div>
  );
}

interface RenderCursorsPropsInterface {
  onNext: (e: BaseSyntheticEvent) => void;
  onPrev: (e: BaseSyntheticEvent) => void;
  cursor: {
    next: string;
    prev: string;
  };
}

function RenderCursors(props: RenderCursorsPropsInterface) {
  return (
    <>
      <button
        className="button-cursor previous"
        onClick={props.onPrev}
        disabled={props.cursor.prev === null}
      >
        <PreviousIcon className="w-5"/>
      </button>
      <button
        className="button-cursor next"
        onClick={props.onNext}
        disabled={props.cursor.next === null}
      >
        <NextIcon className="w-5"/>
      </button>
    </>
  )
    ;
}

export default PhotoOverlay;
