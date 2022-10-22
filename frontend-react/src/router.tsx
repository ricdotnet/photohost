import { createBrowserRouter, redirect } from 'react-router-dom';
import GuardedRoute from './guards/GuardedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import RequestAccess from './pages/RequestAccess';
import Album from './pages/Album';
import Photo from './pages/Photo';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <GuardedRoute component={<Home/>} redirectTo="/login"/>,
  },
  {
    path: '/album/:album',
    element: <GuardedRoute component={<Album/>} redirectTo="/login"/>,
  },
  {
    path: '/:album/:photoId',
    element: <GuardedRoute component={<Album/>} redirectTo="/login"/>
  },
  {
    path: '/photo/:photoId',
    element: <GuardedRoute component={<Photo/>} redirectTo="/login"/>,
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
