import { UserContext, UserStore } from '../contexts/UserContext';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <UserContext.Provider value={UserStore}>
      <div>{UserStore.email}</div>
      <Link to="/request-access">Request Access</Link>
    </UserContext.Provider>
  );
}

export default Home;
