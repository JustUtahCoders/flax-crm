import jwt from "jsonwebtoken";
import { JWTModel } from "../DB/models/JWT";

const { sign, verify } = jwt;

export function makeJWT(payload: object): string {
  const secret = process.env.JWT_PASSWORD_RESET_SECRET || "secret";

  const token = sign(payload, secret, { expiresIn: "1h" });

  const userId = payload["userId"];
  console.log("userId: ", userId);
  saveJWT(token, userId);

  return token;
}

async function saveJWT(token: string, userId: number) {
  const newJWT = await JWTModel.create({
    token: token,
    userId: userId,
    jwtType: "passwordReset",
  });
  if (newJWT) {
    console.log("JWT created");
  } else {
    console.log("Failed to create JWT");
  }
}
