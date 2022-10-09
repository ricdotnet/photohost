import { verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { IUserContext } from '../../interfaces';

export const authorization = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('authorization');

  if ( !authHeader ) {
    return res.status(401).send({ code: 401, message: 'No authorization header present.' });
  }

  const token: string = authHeader.split(' ')[1];

  if ( !token ) {
    return res.status(401).send({
      code: 401,
      message: 'No token present in the authorization header.'
    });
  }

  try {
    req.userContext = verifyToken(token) as IUserContext;
  } catch (err) {
    return res.status(401).send(err);
  }

  return next();
}

// decode token
function verifyToken(token: string) {
  const secret: string = process.env.SECRET;

  return verify(token, secret);
}
