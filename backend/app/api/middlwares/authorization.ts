import { sign, verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { getUserData } from '../../services/user';

export const authorization = async (req: Request, res: Response, next: NextFunction) => {
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
    const { id } = verifyToken(token) as { id: number };
    req.userContext = await getUserData(id);
  } catch (err) {
    return res.status(401).send({ code: 401, message: 'something went wrong' });
  }

  return next();
};

// decode token
function verifyToken(token: string) {
  const secret: string = process.env.JWT_SECRET;

  return verify(token, secret);
}

export function createToken(user: any) {
  return sign(user, process.env.JWT_SECRET, { expiresIn: '365days' });
}
