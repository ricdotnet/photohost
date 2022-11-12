import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { toastEventChannel } from '../../bus/ToastEventChannel';
import DashboardSection from './DashboardSection';
import Button from '../../components/button/Button';
import Input from '../../components/input/Input';

export default function DashboardAvatar() {
  return (
    <DashboardSection
      title="Avatar & username"
      sectionContent={ChangeAvatar()}
    />
  );
};

function ChangeAvatar() {
  const [userContext] = useContext(UserContext);

  const usernameInputRef = useRef<any>(null);

  const [username, setUsername] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  let timer: NodeJS.Timeout | null = null;

  useEffect(() => {
    usernameInputRef.current!.setValue(userContext.username);

    return () => {
      clearTimeout(timer!);
    };
  }, []);

  const onClickSave = () => {
    if ( usernameInputRef.current!.value() === userContext.username ) {
      setErrorMessage('There are no changes to save.');
      resetError();
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      toastEventChannel.dispatch('onAddToast', {
        type: 'info',
        content: 'Your username was updated.',
      });
    }, 5000);
  };

  const onUsernameInputFocus = () => {
    clearTimeout(timer!);
    setErrorMessage('');
  };

  const resetError = () => {
    if ( timer !== null ) clearTimeout(timer);
    timer = setTimeout(() => {
      setErrorMessage('');
    }, 10000);
  };

  return (
    <div className="flex flex-col gap-3">
      <Input
        ref={usernameInputRef}
        className="w-full md:w-2/3"
        label="Username"
        id="username"
        handleOnFocus={onUsernameInputFocus}
        // value={userContext.username}
      />
      <div className="flex space-x-2 items-center">
        <Button
          value="Save"
          variant="primary"
          type="button"
          handleClick={onClickSave}
          isActioning={isSaving}
        />
        <div className="text-red-600">{errorMessage}</div>
      </div>
    </div>
  );
}
