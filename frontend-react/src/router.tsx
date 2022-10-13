import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import RequestAccess from './pages/RequestAccess';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home/>
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

// if there is a token then the user is assumed "authenticated"
// then we redirect to homepage
function nonAuthedGuard(): boolean {
  const token = localStorage.getItem('access-token');

  return token !== null;
  // return new Promise((resolve, reject) => {
  //   fetch('http://localhost:4000/api/v1/user/info', {
  //     headers: {
  //       'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJyaWNkb3RuZXQiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTcxNzIzOTAyMn0.oRq6K2uvz0B2e7BEuqIYfJ3whumVhDmm5j4Z3mEsZAM'
  //     }
  //   })
  //     .then((response) => response.json())
  //     .then((data) => resolve(data))
  //     .catch((err) => console.error(err));
  // });
}
