import { memo, useEffect, useState, Ref, forwardRef } from 'react';

import './Toast.scss';

interface ToastPropsInterface {
  id: number;
  content: string;
  onRemove: (c: number) => void;
  ref: Ref<any>;
}

function Toast(props: ToastPropsInterface, ref: any) {

  useEffect(() => {
    const timer = setTimeout(() => props.onRemove(props.id), 10000);
    
    return () => {
      clearTimeout(timer);
    }
  }, []);

  return (
    <div
      ref={ref}
      className={'toast'}
      onClick={() => props.onRemove(props.id)}
    >
      {props.content}
    </div>
  )
}

export default forwardRef(Toast);
