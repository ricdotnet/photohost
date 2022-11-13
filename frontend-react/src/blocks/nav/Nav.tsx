import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

import './Nav.scss';

export default function Nav() {
  const [userContext] = useContext(UserContext);
  const navigateTo = useNavigate();
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const [mobileIsOpen, setMobileIsOpen] = useState(false);

  useEffect(() => {
    window.addEventListener('resize', onResizeEvent);

    return () => {
      window.removeEventListener('resize', onResizeEvent);
    };
  });

  const onResizeEvent = (e: any) => {
    if ( e.target.innerWidth >= 768 ) {
      setMobileIsOpen(false);
      document.body.classList.remove('overflow-hidden');
    }
  };

  const onMobileMenuAction = () => {
    if (mobileIsOpen) {
      setMobileIsOpen(false);
      document.body.classList.remove('overflow-hidden');
    } else {
      setMobileIsOpen(true);
      document.body.classList.add('overflow-hidden');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access-token');
    return navigateTo('/login');
  };

  return (
    <header className="nav-bar">
      <div className="nav-bar__container">
        Hello {userContext.username}
        <nav>
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <a href="#" onClick={handleLogout}>Logout</a>
        </nav>
        <button
          className="nav-bar__mobile-hamburger"
          aria-expanded={mobileIsOpen}
          onClick={onMobileMenuAction}
        >
          {/*<BurgerMenuIcon/>*/}
          <span className="top"></span>
          <span className="mid"></span>
          <span className="bot"></span>
        </button>
      </div>
      {mobileIsOpen &&
        <div ref={mobileNavRef} className="mobile-nav">
          <div className="container">
            <Link onClick={onMobileMenuAction} to="/">Home</Link>
            <Link onClick={onMobileMenuAction} to="/dashboard">Dashboard</Link>
            <a href="#" onClick={handleLogout}>Logout</a>
          </div>
        </div>
      }
    </header>
  );
}
