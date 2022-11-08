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

type UserContextType = [typeof UserStore, any];

export const UserContext = createContext<UserContextType>([UserStore, null]);
