import { ReactNode, useEffect, useRef } from 'react';

import './Dropdown.scss';

interface DropdownPropsInterface {
  children: ReactNode;
  id: string;
  isOpen: boolean;
  handleRemoteClose: () => void;
}

export default function Dropdown(props: DropdownPropsInterface) {

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    document.addEventListener('keyup', (e: KeyboardEvent) => {
      if ( props.isOpen ) {
        console.log('closing with esc....');
        if ( e.key === 'Escape' ) {
          props.handleRemoteClose();
        }
      }
    });

    // document.addEventListener('click', (e: MouseEvent) => {
      // if ( props.isOpen ) {
      //   props.handleRemoteClose();
      // }
    // });

    return () => {
      document.removeEventListener('click', () => {
      });
    };
  }, [props.isOpen]);

  return (
    <>
      {!props.isOpen ? null :
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
