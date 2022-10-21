import { forwardRef, Ref, useEffect } from 'react';

import './Toast.scss';

export interface ToastInterface {
  id: number;
  content: string;
  type: 'info' | 'warning' | 'danger';
}

interface ToastPropsInterface extends ToastInterface {
  onRemove: (c: number) => void;
  ref: Ref<HTMLDivElement>;
}

function Toast(props: ToastPropsInterface, ref: any) {

  useEffect(() => {
    const timer = setTimeout(() => props.onRemove(props.id), 10000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={'toast ' + props.type}
      onClick={() => props.onRemove(props.id)}
    >
      {props.content}
    </div>
  );
}

export default forwardRef(Toast);
