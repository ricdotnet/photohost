import { useState } from 'react';

import './Toggle.scss';

interface TogglePropsInterface {

}

export default function Toggle(props: TogglePropsInterface) {

  const [checked, setChecked] = useState(false);

  const onToggleClick = () => {
    setChecked(!checked);
  };

  return (
    <div className="toggle" onClick={onToggleClick}>
      <input type="checkbox" checked={checked}/>
      <span className="slider"></span>
    </div>
  );
}
