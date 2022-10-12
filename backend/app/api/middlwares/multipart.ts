import { NextFunction, Request, Response } from 'express';
import { Upfile } from '@ricdotnet/upfile';

const upfile = new Upfile('uploads');

export const multipart = (req: Request, res: Response, next: NextFunction) => {
  try {
    upfile.parseIncomingBody(req, res, next);
  } catch (err) {
    return res.status(400).send({ code: 400, error: err });
  }
};
