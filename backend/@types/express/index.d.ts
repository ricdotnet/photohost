import { IUserContext } from '../../app/interfaces';

declare global {
  namespace Express {
    interface Request {
      userContext?: IUserContext;
      files?: any[];
      formData?: any;
    }
  }
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: 'development' | 'production';
      ARGON_SECRET: string;
      JWT_SECRET: string;
      DB_STRING: string;
      DIGEST: string;
    }
  }
}
