import { ParamsDictionary } from "express-serve-static-core";

export interface UserParams extends ParamsDictionary {
  userId: string,
  email: string,
  role: string,
}