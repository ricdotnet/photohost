import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

import './Nav.scss';
import photoHostMini from '../../assets/photoHostMini.svg';

function Nav() {
  const [userContext] = useContext(UserContext);
  const navigateTo = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access-token');
    return navigateTo('/login');
  };

  return (
    <div className="nav">
      <div className="nav__content">
        <div className="nav__content-left">
          <img src={photoHostMini} width="40" alt="PhotoHost Logo"/>
          <span>
            Hello, {userContext.username}
          </span>
        </div>
        <div className="nav__content-right">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <a href="#" onClick={handleLogout}>Logout</a>
        </div>
      </div>
    </div>
  );
}

export default Nav;
