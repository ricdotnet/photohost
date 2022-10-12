import { UserStore } from '../contexts/UserContext';

export const useAuth = async (username: string, password: string) => {
  const response = await fetch('http://localhost:4000/api/v1/user/login', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ username: username, password: password })
  });
  const data = await response.json();

  if ( !response.ok ) {
    return Promise.reject(data);
  }

  if ( response.ok && data.user ) {
    UserStore.id = data.user.id;
    UserStore.username = data.user.username;
    UserStore.email = data.user.email;

    return Promise.resolve();
  }
};
