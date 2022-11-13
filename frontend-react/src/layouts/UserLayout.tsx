import { StrictMode } from 'react';
import ToastContainer from '../blocks/toasts/ToastContainer';
import Nav from '../blocks/nav/Nav';

import './UserLayout.scss';

function UserLayout({ children }: any) {

  return (
    <StrictMode>
      <Nav/>
      <div className="px-4">
        <div
          className="main-content"
          aria-label="main-content"
        >
          {children}
        </div>
      </div>
      <ToastContainer/>
    </StrictMode>
  );
}

export default UserLayout;
