import React, { BaseSyntheticEvent, ReactNode, useEffect } from 'react';
import './Dialog.scss';
import Button from '../button/Button';

interface DialogPropsInterface {
  title: string;
  controls?: boolean;
  isConfirming?: boolean;
  isCanceling?: boolean;
  children?: ReactNode;
  onConfirm?: (e: BaseSyntheticEvent) => void;
  onCancel?: (e: BaseSyntheticEvent | KeyboardEvent) => void;
}

function Dialog({
                  children,
                  title,
                  controls,
                  isConfirming,
                  isCanceling,
                  onCancel,
                  onConfirm
                }: DialogPropsInterface) {

  useEffect(() => {
    document.addEventListener('keyup', (e: KeyboardEvent) => {
      if ( !onCancel ) return;
      if ( e.key === 'Escape' ) {
        onCancel(e);
      }
    });

    return () => {
      document.removeEventListener('keyup', () => {
      });
    };
  }, []);

  return (
    <div className="background">
      <div className="dialog-box">
        <span className="dialog-box__title">{title}</span>
        {children}
        {controls ? (
          <DialogControls isActioning={{ isConfirming, isCanceling }}
                          onCancel={onCancel}
                          onConfirm={onConfirm}/>
        ) : null}
      </div>
    </div>
  );
}

function DialogControls(props: any) {
  return (
    <div className="dialog-box__buttons">
      <Button value="Cancel"
              variant="secondary"
              type="button"
              isActioning={props.isActioning.isCanceling}
              disabled={props.isActioning.isActioning || props.isActioning.isConfirming}
              handleClick={props.onCancel}/>
      <Button value="Confirm"
              variant="primary"
              type="button"
              isActioning={props.isActioning.isConfirming}
              disabled={props.isActioning.isActioning || props.isActioning.isConfirming}
              handleClick={props.onConfirm}/>
    </div>
  );
}

export default Dialog;
