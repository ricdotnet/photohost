export interface IUserContext {
  username: string;
  digest: string;
}

export interface IPhoto {
  id: number;
  username: string;
  path: string;
  filename: string;
  fullPath: string;
}
