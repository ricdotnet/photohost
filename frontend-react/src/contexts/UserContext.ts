import { createContext } from 'react';

const UserStore = {
  id: '',
  username: '',
  email: '',
  created_at: '',
  last_login: '',
  last_updated: '',
  digest: '',
  photos_layout: 'columns',
};

export const UserContext = createContext(UserStore);
