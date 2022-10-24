import { ReactNode, useEffect, useRef } from 'react';

import './Dropdown.scss';

interface DropdownPropsInterface {
  children: ReactNode;
  id: string;
  isOpen: boolean;
  handleRemoteClose: () => void;
}

type RemoteCloseEvent = KeyboardEvent | MouseEvent;

export default function Dropdown(props: DropdownPropsInterface) {

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('keyup', handleRemoteClose);
    document.addEventListener('mouseup', handleRemoteClose);

    return () => {
      document.removeEventListener('keyup', handleRemoteClose);
      document.removeEventListener('mouseup', handleRemoteClose);
    };
  }, [props.isOpen]);

  const handleRemoteClose = (e: RemoteCloseEvent) => {
    if ( props.isOpen ) {
      if ( ('key' in e && e.key === 'Escape') ) {
        props.handleRemoteClose();
      }
      if ( e.type === 'mouseup'
        && dropdownRef.current
        && !dropdownRef.current.contains(e.target as Node) ) {
        props.handleRemoteClose();
      }
    }
  };

  return (
    <>
      {props.isOpen &&
        (
          <div
            ref={dropdownRef}
            id={props.id}
            className="dropdown"
          >
            {props.children}
          </div>
        )
      }
    </>
  );
}
