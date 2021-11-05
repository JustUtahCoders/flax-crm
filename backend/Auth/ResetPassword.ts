import { router } from "../Router.js";
import { body } from "express-validator";
import { sendResetPasswordEmail } from "../Utils/EmailUtils.js";
import { findUserByEmail } from "../Users/Users";

// send email to user with link to reset password
router.post(
  "/send-reset-password-email",
  body("email").isEmail(),
  async (req, res) => {
    let userEmail = req.body.email;

    const user = await findUserByEmail(userEmail);

    if (user) {
      await sendResetPasswordEmail({
        to: userEmail,
        subject: "Reset Password",
      });
    }
    return res.status(204);
  }
);
