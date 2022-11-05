import { Request } from 'express';
import { client } from '../../config/database';
import { IUserContext } from '../../interfaces';
import { hash, verify } from 'argon2';
import { clone } from 'lodash';
import validator from 'validator';

export async function doRegister(req: Request) {
  const { email, username, password } = req.body;

  // we check if the username is already registered
  let userRows = await findUserByUsername(username);
  if ( userRows.length > 0 ) {
    return { usernameExists: true };
  }

  // then we check if the email is already registered
  userRows = await findUserByEmail(email);
  if ( userRows.length > 0 ) {
    return { emailExists: true };
  }

  // if none of the above is true, then hash the password and register
  const hashedP = await hash(password, { secret: Buffer.from(process.env.ARGON_SECRET) });

  await client.query('INSERT INTO users (email, username, password) VALUES ($1, $2, $3)',
    [email, username, hashedP]);
}

// at a later stage we can then have both username and email auth
export async function doLogin(req: Request) {
  const { username, password } = req.body;

  const [user] = await findUserByUsername(username);

  if ( !user ) {
    return { invalidUser: true };
  }

  const isValidP = await verify(user.password, password, { secret: Buffer.from(process.env.ARGON_SECRET) });

  if ( !isValidP ) {
    return { wrongData: true };
  }

  const userClone = clone(user);
  delete userClone.password;
  userClone.last_login = new Date();

  updateLastLogin(username);

  return userClone;
}

export async function getUserInfo(req: Request) {
  const { username } = req.userContext!;

  // destructure this array because it will have 1 row
  const [user] = await findUserByUsername(username);

  const userClone = clone(user);
  delete userClone.password;

  return userClone;
}

export async function updateUserData(req: Request) {
  const { username } = req.userContext;

  const queryParams = [];
  let query;

  if ( req.query.type === 'email' ) {
    const { newEmail, newEmailConfirm } = req.body;

    if ( !newEmail || !newEmailConfirm ) {
      return Promise.reject('you must post an email');
    }

    if ( !validator.isEmail(newEmail) ) {
      return Promise.reject('invalid email posted');
    }

    if ( newEmail !== newEmailConfirm ) {
      return Promise.reject('the emails posted do not match');
    }


  }
}

async function findUserByUsername(username: string) {
  const userResult =
    await client.query('SELECT * FROM users WHERE username = $1', [username]);

  return userResult.rows;
}

async function findUserByEmail(email: string) {
  const userResult =
    await client.query('SELECT * FROM users WHERE email = $1', [email]);

  return userResult.rows;
}

async function findUserById(id: number) {
  const userResult =
    await client.query('SELECT * FROM users WHERE id = $1', [id]);

  return userResult.rows;
}

function updateLastLogin(username: string) {
  client.query('UPDATE users SET last_login = now() WHERE username = $1', [username]);
}

// if the token is valid then we will get the user data from the username...
// just data related to photos... id, username and digest
export async function getUserData(userId: number): Promise<IUserContext> {

  const [user] = await findUserById(userId);

  return {
    id: user.id,
    username: user.username,
    digest: user.digest,
  };
}
