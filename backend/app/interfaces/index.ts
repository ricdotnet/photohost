export interface IUserContext {
  id: number;
  username: string;
  digest: string;
}

export interface IPhoto {
  id: number;
  user: number;
  path: string;
  filename: string;
  fullPath: string;
  private: boolean;
}
