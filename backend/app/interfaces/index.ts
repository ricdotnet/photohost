export interface IUserContext {
  id: number;
  username: string;
  digest: string;
}

export interface IPhoto {
  id: number;
  username: string;
  path: string;
  filename: string;
  fullPath: string;
  private: boolean;
}
