import DashboardSection from './DashboardSection';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';

export default function DashboardApiKey() {
  return (
    <DashboardSection
      title="API Key"
      sectionContent={ChangeApiKey()}
    />
  );
};

function ChangeApiKey() {
  const userContext = useContext(UserContext);

  const [isResetting, setIsResetting] = useState(false);

  const onClickReset = () => {
    setIsResetting(true);

    setTimeout(() => {
      setIsResetting(false);
    }, 5000);
  }

  return (
    <div className="flex flex-col gap-3">
      <Input
        className="w-full md:w-2/3"
        id="api-key"
        label="API Key"
        value="some-random-api-key"
        disabled={true}
      />
      <div className="my-4">
        Your API key can be used to upload photos using third party services.
      </div>
      <div>
        <Button
          value="Reset API Key"
          variant="secondary"
          type="button"
          handleClick={onClickReset}
          isActioning={isResetting}
        />
      </div>
    </div>
  );
}
