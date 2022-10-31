import DashboardSection from './DashboardSection';

export default function DashboardAvatar() {
  return (
    <DashboardSection
      title="Avatar & username"
      sectionContent={ChangeAvatar()}
    />
  );
};

function ChangeAvatar() {

  return (
    <div>
      Change your avatar here
    </div>
  );
}
