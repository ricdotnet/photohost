import { useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { useDashboard } from '../../hooks/UseDashboard';
import { toastEventChannel } from '../../bus/ToastEventChannel';
import DashboardSection from './DashboardSection';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';

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

  const { updateDigest } = useDashboard();

  const [isResetting, setIsResetting] = useState(false);

  const onClickCopy = async () => {
    await navigator.clipboard.writeText(userContext.digest);

    const toast = {
      content: 'Digest copied to clipboard',
      type: 'info'
    };

    toastEventChannel.dispatch('onAddToast', toast);
  };

  const onClickReset = async () => {
    setIsResetting(true);

    const { data, error } = await updateDigest('digest');

    if ( error ) {
      // show the error
    }

    if ( data ) {
      setIsResetting(false);
      toastEventChannel.dispatch('onAddToast', {
        type: 'info',
        content: 'Your digest has been reset.'
      });
    }

    // setTimeout(() => {
    //   setIsResetting(false);
    //   toastEventChannel.dispatch('onAddToast', {
    //     type: 'info',
    //     content: 'Your digest has been reset.'
    //   });
    // }, 5000);
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
      <div className="my-4">
        Any shared photo-url with the old digest will be invalidated after resetting your
        digest.<br/>
        You will have to re-share the links for photos to be accessible in private mode.
      </div>
      <div className="flex space-x-2">
        {/* I do not see a use for a copy button atm... will keep it commented though */}
        {/*<Button*/}
        {/*  variant="primary"*/}
        {/*  value="Copy"*/}
        {/*  type="button"*/}
        {/*  handleClick={onClickCopy}*/}
        {/*/>*/}
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
