import React, { BaseSyntheticEvent, ReactNode, useEffect, useRef } from 'react';
import Button from '../button/Button';

import './Dialog.scss';

interface DialogPropsInterface {
  title: string;
  controls?: boolean;
  isConfirming?: boolean;
  isCanceling?: boolean;
  children?: ReactNode;
  onConfirm?: (e: BaseSyntheticEvent) => void;
  onCancel?: (e: BaseSyntheticEvent | KeyboardEvent) => void;
}

export default function Dialog({
  children,
  title,
  controls,
  isConfirming,
  isCanceling,
  onCancel,
  onConfirm
}: DialogPropsInterface) {

  const backgroundRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.addEventListener('keyup', keyupHandler);
    document.body.classList.add('overflow-hidden');

    return () => {
      document.body.classList.remove('overflow-hidden');
      document.removeEventListener('keyup', keyupHandler);
    };
  }, []);

  const keyupHandler = (e: KeyboardEvent) => {
    if ( !onCancel ) return;
    if ( e.key === 'Escape' ) {
      onCancel(e);
    }
  };

  const clickHandler = (e: BaseSyntheticEvent) => {
    if ( !onCancel ) return;
    if ( e.target === backgroundRef.current) {
      onCancel(e);
    }
  };

  return (
    <div
      ref={backgroundRef}
      className="background"
      onClick={clickHandler}
    >
      <div className="dialog-box" aria-label="dialog-box">
        <span className="dialog-box__title">{title}</span>
        {children}
        {controls &&
          <DialogControls
            isActioning={{ isConfirming, isCanceling }}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        }
      </div>
    </div>
  );
}

interface IsActioning {
  isConfirming?: boolean;
  isCanceling?: boolean;
}
interface DialogControlsPropsInterface extends Pick<DialogPropsInterface, 'onCancel' | 'onConfirm'> {
  isActioning: IsActioning;
}

function DialogControls({isActioning, onConfirm, onCancel}: DialogControlsPropsInterface) {
  return (
    <div className="dialog-box__buttons">
      <Button
        value="Cancel"
        variant="secondary"
        type="button"
        isActioning={isActioning.isCanceling}
        disabled={isActioning && isActioning.isConfirming}
        handleClick={onCancel}
      />
      <Button
        value="Confirm"
        variant="primary"
        type="button"
        isActioning={isActioning.isConfirming}
        disabled={isActioning && isActioning.isConfirming}
        handleClick={onConfirm}
      />
    </div>
  );
}
