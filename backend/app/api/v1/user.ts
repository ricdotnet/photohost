import { Router } from 'express';
import { doLogin, doRegister } from '../../services/user';

export const user: Router = Router();

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

  res.status(200).send({ code: 200, message: 'login success', user });
});

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
