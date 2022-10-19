import { BaseSyntheticEvent, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { PhotoInterface } from '../../interfaces/PhotoInterface';
import CrossIcon from '../../components/icons/CrossIcon';
import DownloadIcon from '../../components/icons/DownloadIcon';
import PreviousIcon from '../../components/icons/PreviousIcon';
import NextIcon from '../../components/icons/NextIcon';

import './PhotoOverlay.scss';
import SpinnerIcon from '../../components/icons/SpinnerIcon';

interface PhotoOverlayPropsInterface {
  photo: PhotoInterface;
  album: string;
  onClose: (e: KeyboardEvent | BaseSyntheticEvent) => void;
}

function PhotoOverlay(props: PhotoOverlayPropsInterface) {
  const userContext = useContext(UserContext);

  const navigateTo = useNavigate();
  const { name } = useParams();

  const [cursors, setCursors] = useState<any>();

  const [isLoadingNext, setIsLoadingNext] = useState(false);

  useEffect(() => {
    document.addEventListener('keyup', (e: KeyboardEvent) => {
      if ( !props.onClose ) return;
      if ( e.key === 'Escape' ) {
        props.onClose(e);
      }
    });

    getCursors(props.photo.name);

    return () => {
      document.removeEventListener('keyup', () => {
      });
    };
  }, []);

  const handleOnClickClose = (e: BaseSyntheticEvent) => {
    props.onClose(e);
  };

  const getCursors = (currentPhoto: string) => {
    const url = new URL(`${import.meta.env.VITE_API}photo/cursors`);
    url.searchParams.append('name', currentPhoto);

    fetch(url, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('access-token')}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setCursors(data.cursors);
        setIsLoadingNext(false);
      });
  };

  const handleNextClick = () => {
    if ( cursors.next === null ) return;
    setIsLoadingNext(true);
    navigateTo(`/album/${props.album}/${cursors.next}`);
    getCursors(cursors.next);
  };

  const handlePrevClick = () => {
    if ( cursors.prev === null ) return;
    setIsLoadingNext(true);
    navigateTo(`/album/${props.album}/${cursors.prev}`);
    getCursors(cursors.prev);
  };

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
        <button className="button-action">
          <DownloadIcon className="w-6"/>
        </button>
        <button className="button-action" onClick={handleOnClickClose}>
          <CrossIcon className="w-6"/>
        </button>
      </div>
      {isLoadingNext ?
        (
          <>
            <SpinnerIcon className="absolute top-1/2 left-1/2 w-10 h-10 text-white animate-spin"/>
          </>
        )
        :
        (
          <div className="foreground">
            <img
              className="mx-auto w-full h-full object-scale-down"
              src={import.meta.env.VITE_API + 'photo/' + name + '?digest=' + userContext.digest}
              alt={name}
            />
          </div>
        )
      }
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
