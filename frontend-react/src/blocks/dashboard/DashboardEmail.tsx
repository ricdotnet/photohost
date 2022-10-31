import { useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
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
  const userContext = useContext(UserContext);

  const [newEmail, setNewEmail] = useState('');
  const [newEmailConfirm, setNewEmailConfirm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleNewEmailInput = (email: string) => {
    setNewEmail(email);
  };

  const handleNewEmailConfirmInput = (email: string) => {
    setNewEmailConfirm(email);
  };

  const onClickSave = () => {
    setIsSaving(true);

    setTimeout(() => setIsSaving(false), 5000);
  }

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
        className="w-full md:w-2/3"
        id="new-email"
        label="New email address"
        handleChange={handleNewEmailInput}
        placeholder="New email address"
      />
      <Input
        className="w-full md:w-2/3"
        id="new-email-confirm"
        label="New email address confirm"
        handleChange={handleNewEmailConfirmInput}
        placeholder="Confirm new email address"
      />
      <div>
        <Button
          variant="primary"
          value="Save"
          type="button"
          handleClick={onClickSave}
          isActioning={isSaving}
        />
      </div>
    </div>
  );
}
