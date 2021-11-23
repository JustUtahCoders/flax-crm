import jwt from "jsonwebtoken";
import { JWTModel } from "../DB/models/JWT";

const { sign, verify } = jwt;

export function makeJWT(payload: object): string {
  const secret = process.env.JWT_PASSWORD_RESET_SECRET || "secret";

  const token = sign(payload, secret, { expiresIn: "1h" });

  const userId = payload["userId"];

  return token;
}
