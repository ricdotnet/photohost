import { useContext, useRef, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { useDashboard } from '../../hooks/UseDashboard';
import { toastEventChannel } from '../../bus/ToastEventChannel';
import validator from 'validator';
import DashboardSection from './DashboardSection';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';

export default function DashboardEmail() {

  return (
    <DashboardSection
      title="Email address"
      sectionContent={UpdateEmail()}
    />
  );
}

function UpdateEmail() {
  const [userContext, updateUser] = useContext(UserContext);

  const newEmailRef = useRef<any>(null);
  const newEmailConfirmRef = useRef<any>(null);

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  const { updateEmail } = useDashboard();

  const onClickSave = async () => {
    const newEmail = newEmailRef.current!.value();
    const newEmailConfirm = newEmailConfirmRef.current!.value();

    if ( !newEmail || !newEmailConfirm ) {
      setHasError(true);
      setErrorMessage('You must enter the new email address twice.');
      return;
    }

    if ( !validator.isEmail(newEmail) || !validator.isEmail(newEmailConfirm) ) {
      setHasError(true);
      setErrorMessage('You must enter valid email addresses.');
      return;
    }

    if ( newEmail !== newEmailConfirm ) {
      setHasError(true);
      setErrorMessage('The email addresses you entered do not match.');
      return;
    }

    if ( newEmail === userContext.email ) {
      setHasError(true);
      setErrorMessage('The new email address should not be the old one.');
      return;
    }

    setIsSaving(true);

    const { data, error } = await updateEmail({
      email: newEmail,
      emailConfirm: newEmailConfirm,
    }, 'email');

    if ( error ) {
      setIsSaving(false);
      toastEventChannel.dispatch('onAddToast', {
        type: 'danger',
        content: 'It was not possible to update your email address. Please try again later.'
      });
    }

    if ( data ) {
      newEmailRef.current!.reset();
      newEmailConfirmRef.current!.reset();
      setIsSaving(false);
      toastEventChannel.dispatch('onAddToast', {
        type: 'info',
        content: 'Email address updated.'
      });

      updateUser((user: any) => ({
        ...user,
        email: newEmail
      }));
    }
  };

  const handleOnChange = () => {
    setHasError(false);
    setErrorMessage('');
  };

  return (
    <div className="flex flex-col gap-3">
      <Input
        className="w-full md:w-2/3"
        id="old-email"
        label="Old email address"
        value={userContext.email}
        disabled={true}
      />
      <Input
        ref={newEmailRef}
        className="w-full md:w-2/3"
        id="new-email"
        label="New email address"
        placeholder="New email address"
        hasError={hasError}
        handleChange={handleOnChange}
        type="email"
      />
      <Input
        ref={newEmailConfirmRef}
        className="w-full md:w-2/3"
        id="new-email-confirm"
        label="New email address confirm"
        placeholder="Confirm new email address"
        hasError={hasError}
        handleChange={handleOnChange}
        type="email"
      />
      <div className="flex items-center space-x-2">
        <Button
          variant="primary"
          value="Save"
          type="button"
          handleClick={onClickSave}
          isActioning={isSaving}
          disabled={isSaving}
        />
        <div className="text-red-600">{errorMessage}</div>
      </div>
    </div>
  );
}
