import { BaseSyntheticEvent, forwardRef, useImperativeHandle, useRef } from 'react';
import './Input.scss';

interface InputPropsInterface {
  handleChange?: (data: string) => void;
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  hasError?: boolean;
  value?: string;
  disabled?: boolean;
}

function Input(props: InputPropsInterface, ref: any) {

  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = (e: BaseSyntheticEvent) => {
    if ( props.handleChange ) {
      props.handleChange(e.target.value);
    }
  };

  const hasError = (props.hasError) ? 'border-red-500 shake-animation' : 'border-slate-300';

  useImperativeHandle(ref, () => {
    return {
      reset() {
        inputRef.current!.value = '';
      }
    };
  }, []);

  return (
    <>
      <div id={props.id} className="hidden">{props.label}</div>
      <input
        ref={inputRef} name={props.id} className={'input ' + hasError}
        type={props.type ?? 'text'}
        onChange={onChange}
        placeholder={props.placeholder}
        aria-labelledby={props.id}
        autoComplete="off"
        value={props.value}
        disabled={props.disabled}
      />
    </>
  );
}

export default forwardRef(Input);
