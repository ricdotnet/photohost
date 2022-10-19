import { BaseSyntheticEvent, ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import SpinnerIcon from '../icons/SpinnerIcon';
import './Button.scss';

type ButtonVariants = 'primary' | 'accent' | 'secondary' | 'danger' | 'disabled';
type ButtonTypes = 'button' | 'submit' | 'reset';

interface ButtonPropsInterface {
  value: string;
  variant: ButtonVariants;
  type?: ButtonTypes;
  handleClick?: (e: BaseSyntheticEvent) => void;
  isActioning?: boolean;
  disabled?: boolean;
  href?: string;
}

function Button(props: ButtonPropsInterface) {

  // kill me please 😭
  const bgColor = props.variant === 'primary' ? ' bg-[#5C5ABC]'
    : props.variant === 'secondary' ? ' bg-[#F5F5F5]'
      : props.variant === 'danger' ? ' bg-red-600' : '';

  if ( props.href ) {
    return (
      <Link to={props.href} className={'button button__' + props.variant}>
        {props.value}
      </Link>
    );
  }

  const events: ButtonHTMLAttributes<any> = {};
  if ( props.type === 'button' ) {
    events.onClick = props.handleClick;
  }

  return (
    <button className={'flex space-x-2 button button__' + props.variant + bgColor}
            type={props.type}
            disabled={props.disabled}
            {...events}>
      <span>{props.value}</span>
      {props.isActioning ? (<SpinnerIcon className="w-5 h-5 animate-spin text-white"/>) : null}
    </button>
  );
}

export default Button;
