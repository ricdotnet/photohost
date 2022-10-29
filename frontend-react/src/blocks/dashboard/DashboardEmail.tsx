import DashboardSection from './DashboardSection';
import Input from '../../components/input/Input';
import { useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';

export default function DashboardEmail() {

  const userContext = useContext(UserContext);

  const [newEmail, setNewEmail] = useState('');

  const handleNewEmailInput = (email: string) => {
    setNewEmail(email);
  };

  return (
    <DashboardSection title="Email address">
      <Input
        id="old-email"
        label="Old email address"
        value={userContext.email}
        disabled={true}
      />
      <Input
        id="new-email"
        label="New email address"
        handleChange={handleNewEmailInput}
      />
      {newEmail}
    </DashboardSection>
  );
}
