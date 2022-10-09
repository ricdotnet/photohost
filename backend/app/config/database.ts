import { Client } from 'pg';
import { config } from './index';

export const client = new Client(config.dbString);

client.connect(err => {
  if ( err ) {
    throw new Error('Could not connect to postgres.');
  } else {
    console.log('Postgres is connected.');
  }
});
