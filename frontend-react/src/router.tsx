import { createBrowserRouter, defer, redirect } from 'react-router-dom';
import { useTokenAuth } from './hooks/UseTokenAuth';
import Home from './pages/Home';
import Login from './pages/Login';
import RequestAccess from './pages/RequestAccess';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home/>,
    loader: authedGuard,
  },
  {
    path: '/login',
    element: <Login/>,
    loader: nonAuthedGuard,
  },
  {
    path: '/request-access',
    element: <RequestAccess/>,
    loader: nonAuthedGuard,
  }
]);

// TODO: these could be improved
// if there is a token then the user is assumed "authenticated"
// then we redirect to homepage
function nonAuthedGuard() {
  const token = localStorage.getItem('access-token');

  if ( token ) {
    return redirect('/');
  }
}

async function authedGuard() {
  const tokenAuthRes = useTokenAuth();

  return defer({ userData: tokenAuthRes });
}
