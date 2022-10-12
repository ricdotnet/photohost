import { createContext } from 'react';

export const UserStore = {
  id: '',
  username: '',
  email: '',
};

export const UserContext = createContext(UserStore);
