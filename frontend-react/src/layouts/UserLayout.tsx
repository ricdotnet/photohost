import { StrictMode } from 'react';
import ToastContainer from '../blocks/toasts/ToastContainer';
import Nav from '../components/nav/Nav';
import Toast from '../components/toast/Toast';

function UserLayout({ children }: any) {

  return (
    <>
      <StrictMode>
        <Nav />
        <div className="px-4">
          <div className="max-w-[960px] mx-auto">{children}</div>
        </div>
      </StrictMode>
      <ToastContainer/>
    </>
  );
}

export default UserLayout;
