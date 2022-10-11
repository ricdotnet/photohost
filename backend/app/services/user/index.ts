import { Request } from "express";
import { client } from "../../config/database";
import { IUserContext } from "../../interfaces";

export async function doRegister(req: Request) {
  const { email, username, password } = req.body;
  
  await client.query('INSERT INTO users (email, username, password) VALUES ($1, $2, $3)',
    [email, username, password]);
}

export async function doLogin(req: Request) {

}

// if the token is valid then we will get the user data from the username...
// just data related to photos...
// TODO: add a db call to get user data
export function getUserData(username: string): IUserContext {
  return {
    username: username,
    digest: process.env.DIGEST
  }
}