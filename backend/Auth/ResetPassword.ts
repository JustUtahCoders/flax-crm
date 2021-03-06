import { router } from "../Router.js";
import { body, validationResult, param } from "express-validator";
import { findUserByEmail, findUserById } from "../Users/Users";
import {
  created,
  invalidRequest,
  serverApiError,
  successNoContent,
} from "../Utils/EndpointResponses";
import { sendEmail, baseUrl } from "../Utils/EmailUtils.js";
import { makeJWT } from "../Utils/JWTUtils.js";
import { JWTModel } from "../DB/models/JWT";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserModel } from "../DB/models/User.js";

const { verify } = jwt;
const jwtSecret = process.env.JWT_SECRET;

function getResetPasswordBody(baseUrl: string, token: string): string {
  return `<div style="width: 60vw; margin: 4rem auto auto auto; color: #403F3D;">
  <h1 style="color:#2a467b">Hello!</h1>
  <p style="margin-bottom:5rem">You are receiving this email because we received a password reset request for your account.</p>
  <div style="display:flex; width:100vw; align-items:center; justify-content:center;">
  <a href="${baseUrl}/finish-reset-password?jwt=${token}" style="color:white; background-color: #2a467b; text-decoration: none; padding:1rem; border-radius:5px; width:20vw; text-align:center; ">Reset Password</a>
  </div>
  </br>
  <p style="margin-top:5rem">If you are having trouble clicking the <span style="font-style:italic">"Reset Password"</span> button, copy and paste the following URL into your web browser</p>
  </br>
  ${baseUrl}/finish-reset-password?jwt=${token}
  </div>
  <footer style="margin-top:4rem">
  <hr></hr>
  <p style="margin:1rem; text-align:center; color: #403F3D;">Just Utah Coders</p>
  </footer>`;
}

router.post(
  "/send-reset-password-email",
  body("email").isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return invalidRequest(res, errors);
    }

    let userEmail = req.body.email;
    const user = await findUserByEmail(userEmail);

    if (user) {
      const payload = { userId: user.id, email: userEmail };
      const token = makeJWT(payload);

      const newJWT = await JWTModel.create({
        token: token,
        userId: user.id,
        jwtType: "passwordReset",
      });

      if (newJWT) {
        await sendEmail({
          to: userEmail,
          subject: "Reset Password",
          body: getResetPasswordBody(baseUrl, token),
        });
        return created(res, newJWT);
      } else {
        return serverApiError(res, "Could not create JWT");
      }
    }
    return res.status(204).end();
  }
);

router.get<Params, ResponseBody, QueryParams>(
  "/api/validate-token/:token",
  param("token").exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return invalidRequest(res, errors);
    }
    const token = req.params.token;
    const tokenType = req.query.tokenType;

    const rows = await JWTModel.findAll({
      where: {
        token: token,
        jwtType: tokenType,
      },
    });

    if (rows.length >= 1) {
      let token = rows[0].token;

      const userId = rows[0].userId;

      findUserById(userId).then((user) => {
        const userEmail = user?.email;

        if (tokenIsValid(token, jwtSecret)) {
          return res.status(200).json({
            tokenIsValid: true,
            tokenIsExpired: false,
            email: userEmail,
          });
        } else {
          return res
            .status(200)
            .json({ tokenIsValid: true, tokenIsExpired: true });
        }
      });
    } else {
      return res
        .status(200)
        .json({ tokenIsValid: false, tokenIsExpired: false });
    }
  }
);

router.put(
  "/api/passwords",
  body("password").isStrongPassword(),
  body("token").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return invalidRequest(res, errors);
    }
    const { password, token } = req.body;

    if (!tokenIsValid(token, jwtSecret)) {
      return invalidRequest(res, "Invalid token");
    }

    const rows = await JWTModel.findAll({
      where: {
        token,
      },
    });

    if (rows.length >= 1) {
      const userId = rows[0].userId;
      const hash = await bcrypt.hash(password, 5);

      const toUpdate = {
        password: hash,
      };

      const [numUpdated] = await UserModel.update(toUpdate, {
        where: {
          id: userId,
        },
      });

      if (numUpdated === 0) {
        return serverApiError(res, `Unable to update password`);
      } else {
        return successNoContent(res);
      }
    } else {
      return invalidRequest(res, "Invalid token");
    }
  }
);

function tokenIsValid(token: string, jwtSecret: string | undefined): boolean {
  if (!jwtSecret) {
    return false;
  }

  try {
    const decoded = verify(token, jwtSecret);
    return true;
  } catch (err) {
    return false;
  }
}

interface Params {
  token: string;
  tokenType: string;
}

interface QueryParams {
  tokenType?: string;
}

interface ResponseBody {
  tokenIsValid: boolean;
  tokenIsExpired: boolean;
  email?: string;
}
