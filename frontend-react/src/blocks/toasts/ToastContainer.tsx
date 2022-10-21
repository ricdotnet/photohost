import { ReactNode, useEffect, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { toastEventChannel } from '../../bus/ToastEventChannel';
import Toast, { ToastInterface } from '../../components/toast/Toast';

import './ToastContainer.scss';

interface ToastContainerPropsInterface {
  children?: ReactNode;
}

function ToastContainer(props: ToastContainerPropsInterface) {

  const [toasts, setToasts] = useState<any[]>([]);
  const nodeRef = useRef(null);

  useEffect(() => {
    toastEventChannel.subscribe('onAddToast', (toast: ToastInterface) => {
      const tt = {
        id: Date.now(),
        content: toast.content,
        type: toast.type,
        nodeRef: nodeRef,
      };
      setToasts((tts) => [...tts, tt]);
    });
  }, []);

  const handleRemoveToast = (c: number) => {
    setToasts((tts) =>
      tts.filter((tts) => tts.id !== c)
    );
  };

  return (
    <TransitionGroup className="toast-container">
      {!toasts.length ? null :
        toasts.map((toast) => {
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

export default ToastContainer;
