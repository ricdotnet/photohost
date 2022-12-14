import { Link } from 'react-router-dom';
import GuestLayout from '../layouts/GuestLayout';

function RequestAccess() {
  return (
    <GuestLayout>
      <div className="flex flex-col space-y-4 text-center">
        <span>Not accepting any requests right now. Sorry :(</span>
        <span><Link to="/login">Go back</Link></span>
      </div>
    </GuestLayout>
  );
}

export default RequestAccess;
