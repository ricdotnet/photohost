import { UserContext, UserStore } from '../contexts/UserContext';
import GuestLayout from '../layouts/GuestLayout';

function RequestAccess() {
  return (
    <UserContext.Provider value={UserStore}>
      <GuestLayout>
        <div>This is the RequestAccess page...</div>
        <div>{UserStore.username}</div>
      </GuestLayout>
    </UserContext.Provider>
  );
}

export default RequestAccess;
