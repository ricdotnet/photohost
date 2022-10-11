import { Router } from "express";

export const user: Router = Router();

user.post('/login', (req, res) => {

  res.status(200).send({ code: 200, message: 'login success' });
});

user.post('/register', (req, res) => {

  res.status(200).send({ code: 200, message: 'register success' });
});