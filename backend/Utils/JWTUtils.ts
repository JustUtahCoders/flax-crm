import jwt from "jsonwebtoken";

const { sign, verify } = jwt;

export function makeJWT(payload: object): string {
  const secret = process.env.JWT_SECRET || "secret";

  const token = sign(payload, secret, { expiresIn: "1h" });

  return token;
}
