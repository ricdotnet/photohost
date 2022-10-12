import { Router } from 'express';
import { doLogin, doRegister } from '../../services/user';
import { createToken } from '../middlwares/authorization';

export const user: Router = Router();

/**
 * @Post the login details
 */
user.post('/login', async (req, res) => {
  if ( !req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('password') ) {
    return res.status(401).send({ code: 401, message: 'data is missing' });
  }

  const user = await doLogin(req);

  if ( user?.invalidUser ) {
    return res.status(401).send({ code: 401, message: 'user does not exist' });
  }

  if ( user?.wrongData ) {
    return res.status(401).send({ code: 401, message: 'wrong login data' });
  }

  const token = createToken({ id: user.id, username: user.username });

  res.status(200).send({ code: 200, message: 'login success', user, token });
});

/**
 * @Post the new user data to be registered
 */
user.post('/register', async (req, res) => {
  if ( !req.body.hasOwnProperty('email')
    || !req.body.hasOwnProperty('username')
    || !req.body.hasOwnProperty('password') ) {
    return res.status(401).send({ code: 401, message: 'data is missing' });
  }

  const result = await doRegister(req);

  if ( result?.usernameExists ) {
    return res.status(401).send({ code: 401, message: 'username already exists' });
  }

  if ( result?.emailExists ) {
    return res.status(401).send({ code: 401, message: 'email already exists' });
  }

  res.status(200).send({ code: 200, message: 'register success' });
});
