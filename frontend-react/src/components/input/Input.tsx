import { BaseSyntheticEvent, forwardRef, useImperativeHandle, useRef } from 'react';
import './Input.scss';

interface IProps {
  handleChange: (data: string) => void;
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  hasError?: boolean;
}

function Input(props: IProps, ref: any) {

  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = (e: BaseSyntheticEvent) => {
    props.handleChange(e.target.value);
  };

  const hasError = (props.hasError) ? 'border-red-500' : 'border-slate-300';

  useImperativeHandle(ref, () => {
    return {
      reset() {
        inputRef.current!.value = '';
      }
    }
  }, []);

  return (
    <>
      <div id={props.id} className="hidden">{props.label}</div>
      <input ref={inputRef} name={props.id} className={'input ' + hasError}
             type={props.type ?? 'text'}
             onChange={onChange}
             placeholder={props.placeholder}
             aria-labelledby={props.id}
             autoComplete="off"/>
    </>
  );
}

export default forwardRef(Input);
