import { BaseSyntheticEvent } from "react";
import './Input.scss';

interface IProps {
  handleChange: (data: string) => void;
  type?: string;
}

function Input(props: IProps) {

  const onChange = (e: BaseSyntheticEvent) => {
    props.handleChange(e.target.value);
  }

  return (
    <input className="input"
      type={props.type ?? 'text'}
      onChange={onChange} />
  )
}

export default Input;