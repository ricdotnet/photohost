import { UserStore } from '../contexts/UserContext';

export const useAuth = async (username: string, password: string) => {
  const response = await fetch(`${import.meta.env.VITE_API}user/login`, {
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

    localStorage.setItem('access-token', data.token);

    return Promise.resolve();
  }
};
