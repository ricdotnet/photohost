import { BaseSyntheticEvent } from 'react';

import './DropdownChild.scss';

interface DropdownChildPropsInterface {
  value: string;
  handleOnClick: (e: BaseSyntheticEvent) => void;
  disabled?: boolean;
}

export default function DropdownChild(props: DropdownChildPropsInterface) {

  return (
    <button
      className="dropdown-child"
      type="button"
      onClick={props.handleOnClick}
      disabled={props.disabled}
    >
      {props.value}
    </button>
  );
}
