import './Button.scss';

type ButtonVariants = 'primary' | 'accent' | 'secondary' | 'disabled';

interface IProps {
  value: string;
  variant: ButtonVariants;
  handleClick?: () => void;
}

function Button(props: IProps) {
  return (
    <button className={'button button__' + props.variant}>
      {props.value}
    </button>
  )
}

export default Button;