import { router } from "../Router.js";
import { body, validationResult } from "express-validator";
import { findUserByEmail } from "../Users/Users";
import { invalidRequest } from "../Utils/EndpointResponses";
import { sendEmail, baseUrl } from "../Utils/EmailUtils.js";
import { makeJWT } from "../Utils/JWTUtils.js";
import "../DB/models/JWT";

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

    const payload = { userId: user?.id, email: userEmail }; // check this user?id
    const token = makeJWT(payload);

    if (user) {
      await sendEmail({
        to: userEmail,
        subject: "Reset Password",
        body: getResetPasswordBody(baseUrl, token),
      });
    }
    return res.status(204).end();
  }
);
