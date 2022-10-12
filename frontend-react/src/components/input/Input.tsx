import { BaseSyntheticEvent } from 'react';
import './Input.scss';

interface IProps {
  handleChange: (data: string) => void;
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  hasError?: boolean;
}

function Input(props: IProps) {

  const onChange = (e: BaseSyntheticEvent) => {
    props.handleChange(e.target.value);
  };

  const hasError = (props.hasError) ? 'border-red-500' : 'border-slate-300';

  return (
    <>
      <div id={props.id} className="hidden">{props.label}</div>
      <input name={props.id} className={'input ' + hasError}
             type={props.type ?? 'text'}
             onChange={onChange}
             placeholder={props.placeholder}
             aria-labelledby={props.id}
             autoComplete="off"/>
    </>
  );
}

export default Input;
