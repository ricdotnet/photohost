import { createBrowserRouter, redirect } from 'react-router-dom';
import GuardedRoute from './guards/GuardedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import RequestAccess from './pages/RequestAccess';
import Photo from './pages/Photo';
import Album from './pages/Album';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <GuardedRoute component={<Home/>} redirectTo="/login"/>,
  },
  {
    path: '/album/:slug',
    element: <GuardedRoute component={<Album/>} redirectTo="/login"/>,
  },
  {
    path: '/photo/:name',
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
