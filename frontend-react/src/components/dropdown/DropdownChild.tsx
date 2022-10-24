import { BaseSyntheticEvent } from 'react';

interface DropdownChildPropsInterface {
  value: string;
  handleOnClick: (e: BaseSyntheticEvent) => void;
}

export default function DropdownChild(props: DropdownChildPropsInterface) {

  return (
    <button
      className="py-2 min-w-[150px] max-w-[200px] w-full px-4 hover:bg-gray-100 cursor-pointer text-left whitespace-nowrap"
      type="button"
      onClick={props.handleOnClick}
    >
      {props.value}
    </button>
  )
}
