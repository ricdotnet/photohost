import { config as dotEnvConfig } from 'dotenv';

dotEnvConfig();

export const config = {
  port: process.env.PORT || 4000,
  dbString: process.env.DB_STRING,
  /**
   *
   * @param {number} d the number of days to cache with 7 days (1 week) being the default
   * @returns {number} the number of seconds for a resource to be cached
   */
  cachingTime: (d: number = 7): number => d * 86400,
};
