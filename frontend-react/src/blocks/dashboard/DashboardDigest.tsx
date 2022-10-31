import { useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import DashboardSection from './DashboardSection';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { toastEventChannel } from '../../bus/ToastEventChannel';

export default function DashboardDigest() {
  return (
    <DashboardSection
      title="User digest token"
      sectionContent={ChangeDigest()}
    />
  );
}

function ChangeDigest() {
  const userContext = useContext(UserContext);

  const [isResetting, setIsResetting] = useState(false);

  const onClickCopy = async () => {
    await navigator.clipboard.writeText(userContext.digest);

    const toast = {
      content: 'Digest copied to clipboard',
      type: 'info'
    };

    toastEventChannel.dispatch('onAddToast', toast);
  };

  const onClickReset = () => {
    setIsResetting(true);

    setTimeout(() => setIsResetting(false), 5000);
  };

  return (
    <div className="flex flex-col gap-3">
      <Input
        className="w-full md:w-2/3"
        id="user-digest"
        label="User digest token"
        value={userContext.digest}
        disabled={true}
      />
      <div className="flex space-x-2">
        <Button
          variant="primary"
          value="Copy"
          type="button"
          handleClick={onClickCopy}
        />
        <Button
          variant="secondary"
          value="Reset digest"
          type="button"
          handleClick={onClickReset}
          isActioning={isResetting}
        />
      </div>
    </div>
  );
}
