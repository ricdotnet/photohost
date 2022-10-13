import { createContext } from 'react';

export const UserStore = {
  id: '',
  username: '',
  email: '',
  created_at: '',
  last_login: '',
  last_updated: '',
  digest: '',
};

export const UserContext = createContext(UserStore);
