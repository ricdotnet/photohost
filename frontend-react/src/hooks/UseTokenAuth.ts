import { UserStore } from '../contexts/UserContext';

export const useTokenAuth = async () => {
  const token = localStorage.getItem('access-token');

  if ( !token ) {
    location.href = '/login';
    return Promise.reject();
  }

  const response = await fetch(`${import.meta.env.VITE_API}user/info`, {
    headers: {
      'authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();

  if ( !response.ok ) {

    return Promise.reject(data);
  }

  if ( response.ok && data.user ) {
    const userStore: Record<string, any> = UserStore;

    for ( const [key, value] of Object.entries(data.user) ) {
      userStore[key] = value;
    }

    return Promise.resolve(data.user);
  }
};
