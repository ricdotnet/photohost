import { ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../loading/Spinner';
import './Button.scss';

type ButtonVariants = 'primary' | 'accent' | 'secondary' | 'danger' | 'disabled';
type ButtonTypes = 'button' | 'submit' | 'reset';

interface ButtonPropsInterface {
  value: string;
  variant: ButtonVariants;
  type?: ButtonTypes;
  handleClick?: () => void;
  isActioning?: boolean;
  href?: string;
}

function Button(props: ButtonPropsInterface) {

  // kill me please 😭
  const bgColor = props.variant === 'primary' ? ' bg-[#5C5ABC]'
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
            type={props.type} {...events}>
      <span>{props.value}</span>
      {props.isActioning ? (<Spinner className="w-5 h-5 animate-spin text-white"/>) : null}
    </button>
  );
}

export default Button;
