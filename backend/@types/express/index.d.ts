import { IUserContext } from '../../app/interfaces';

declare global {
  namespace Express {
    interface Request {
      userContext?: IUserContext;
      files?: any[];
    }
  }
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: 'development' | 'production';
      SECRET: string;
      DB_STRING: string;
      PVT_KET: string;
    }
  }
}
