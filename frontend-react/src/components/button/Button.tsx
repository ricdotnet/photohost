import './Button.scss';

type ButtonVariants = 'primary' | 'accent' | 'secondary' | 'disabled';
type ButtonTypes = 'button' | 'submit' | 'reset';

interface IProps {
  value: string;
  variant: ButtonVariants;
  handleClick?: () => void;
  type?: ButtonTypes;
  href?: string;
}

function Button(props: IProps) {

  // kill me please 😭
  const bgColor = (props.variant === 'primary') ? ' bg-[#5C5ABC]' : '';

  if ( props.href ) {
    return (
      <a href={props.href} className={'button button__' + props.variant}>
        {props.value}
      </a>
    );
  }

  return (
    <button className={'button button__' + props.variant + bgColor}
            type={props.type ?? 'button'}>
      {props.value}
    </button>
  );
}

export default Button;
