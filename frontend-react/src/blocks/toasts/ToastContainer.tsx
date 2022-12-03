import { ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { toastEventChannel } from '../../bus/ToastEventChannel';
import Toast, { ToastInterface } from '../../components/toast/Toast';

import './ToastContainer.scss';

interface ToastContainerPropsInterface {
  children?: ReactNode;
}

export default function ToastContainer() {

  const nodeRef = useRef<typeof Toast>(null);
  const { toasts, handleRemoveToast } = useToastsQueue(nodeRef);

  return (
    <TransitionGroup className="toast-container">
      {toasts.length &&
        toasts.map((toast: ToastInterface) => {
          return (
            <CSSTransition
              key={toast.id}
              classNames="toast"
              timeout={200}
              ref={toast.nodeRef}
            >
              <Toast
                ref={toast.nodeRef}
                content={toast.content}
                onRemove={handleRemoveToast}
                id={toast.id}
                type={toast.type}
              />
            </CSSTransition>
          );
        })
      }
    </TransitionGroup>
  );
}

function useToastsQueue(nodeRef: RefObject<typeof Toast>) {
  const [toasts, setToasts] = useState<ToastInterface[]>([]);

  useEffect(() => {
    toastEventChannel.subscribe('onAddToast', (toast: ToastInterface) => {
      const tt = {
        id: Date.now(),
        content: toast.content,
        type: toast.type,
        nodeRef: nodeRef,
      };
      setToasts((tts) => {
        if ( tts.length === 5 ) {
          tts.shift();
        }
        return [...tts, tt];
      });
    });
  }, []);

  const handleRemoveToast = (c: number) => {
    setToasts((tts) =>
      tts.filter((tts) => tts.id !== c)
    );
  };

  return { toasts, handleRemoveToast };
}
