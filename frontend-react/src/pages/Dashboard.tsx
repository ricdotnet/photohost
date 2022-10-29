import UserLayout from '../layouts/UserLayout';
import DashboardAvatar from '../blocks/dashboard/DashboardAvatar';
import DashboardEmail from '../blocks/dashboard/DashboardEmail';

interface DashboardPropsInterface {

}

export default function Dashboard(props: DashboardPropsInterface) {
  return (
    <UserLayout>
      <DashboardAvatar/>
      <DashboardEmail/>
    </UserLayout>
  );
}
