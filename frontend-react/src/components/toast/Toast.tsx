import { ForwardedRef, forwardRef, Ref, RefObject, useEffect } from 'react';
import { ToastTypes } from '../../interfaces/Types';

import './Toast.scss';

export interface ToastInterface {
  content: string;
  id: number;
  type: ToastTypes;
  nodeRef?: RefObject<any>;
}

interface ToastPropsInterface extends ToastInterface {
  onRemove: (c: number) => void;
  ref: Ref<HTMLDivElement>;
}

function Toast({
  content,
  id,
  nodeRef,
  onRemove,
  type,
}: ToastPropsInterface, ref: ForwardedRef<HTMLDivElement>) {

  useEffect(() => {
    const timer = setTimeout(() => onRemove(id), 10000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={'toast ' + type}
      onClick={() => onRemove(id)}
    >
      {content}
    </div>
  );
}

export default forwardRef(Toast);
