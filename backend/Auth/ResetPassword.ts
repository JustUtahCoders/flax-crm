import { router } from "../Router.js";
import { body, validationResult } from "express-validator";
import { sendEmail } from "../Utils/EmailUtils.js";
import { findUserByEmail } from "../Users/Users";

// send email to user with link to reset password
router.post(
  "/send-reset-password-email",
  body("email").isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let userEmail = req.body.email;
    const user = await findUserByEmail(userEmail);

    if (user) {
      await sendEmail({
        to: userEmail,
        subject: "Reset Password",
      });
    }
    return res.status(204).end();
  }
);
