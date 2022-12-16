import { config as dotEnvConfig } from 'dotenv';

dotEnvConfig();

export const config = {
  port: process.env.PORT || 4000,
  dbString: process.env.DB_STRING,
  cachingTime: 150 * 86400, // 150 days
};
