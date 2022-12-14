import { BaseSyntheticEvent, forwardRef, useImperativeHandle, useRef } from 'react';
import './Input.scss';

interface InputPropsInterface {
  handleChange?: (data: string) => void;
  handleOnFocus?: () => void;
  id: string;
  label: string;
  className?: string;
  type?: string;
  placeholder?: string;
  hasError?: boolean;
  value?: string;
  disabled?: boolean;
}

function Input(props: InputPropsInterface, ref: any) {

  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = (e: BaseSyntheticEvent) => {
    if ( props.handleChange && props.hasError ) {
      props.handleChange(e.target.value);
    }
  };

  const onFocus = () => {
    if ( props.handleOnFocus ) {
      props.handleOnFocus!();
    }
  };

  const hasError = (props.hasError) ? 'border-red-500 shake-animation ' : 'border-slate-300 ';

  useImperativeHandle(ref, () => {
    return {
      setValue(v: string) {
        inputRef.current!.value = v;
      },
      reset() {
        inputRef.current!.value = '';
      },
      value() {
        return inputRef.current!.value;
      }
    };
  }, []);

  return (
    <>
      <div id={props.id} className="hidden">{props.label}</div>
      <input
        ref={inputRef} name={props.id}
        className={'input ' + hasError + (props.className ?? null)}
        type={props.type ?? 'text'}
        onChange={onChange}
        onFocus={onFocus}
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
