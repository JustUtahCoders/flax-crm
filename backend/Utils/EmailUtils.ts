import google from "googleapis";
import path from "path";
import { encode } from "js-base64";
import dotenv from "dotenv";

async function makeEmail({ to, from, subject }) {
  const message = `
  <div style="width: 60vw; margin: 4rem auto auto auto; color: #403F3D;
  ">
  <h1 style="color:#2a467b">Hello!</h1>
  <p style="margin-bottom:5rem">You are receiving this email because we received a password reset request for your account.</p>
  <div style="display:flex; width:100vw; align-items:center; justify-content:center;">
  <a href="https://www.google.com" style="color:white; background-color: #2a467b; text-decoration: none; padding:1rem; border-radius:5px; width:20vw; text-align:center; ">Reset Password</a>
  </div>
  </br>
  <p style="margin-top:5rem">If you are having trouble clicking the <span style="font-style:italic">"Reset Password"</span> button, copy and paste the following URL into your web browser</.p>
  </br>
  https://www.google.com
  </div>
  <footer style="margin-top:4rem">
  <hr></hr>
  <p style="margin:1rem; text-align:center; color: #403F3D;">Just Utah Coders</p>
  </footer>
  `;
  // put html here, use anchor tag, the JWT goes in as a query string

  // the white space is important, template literals are space sensitive
  const str = `
Content-Type: text/html; charset="UTF-8"
to: ${to}
from: ${from}
subject: =?utf-8?B? ${encode(subject, true)}?=

${message} 
`.trim();

  return encode(str, true);
}

export async function sendEmail({ to, subject }) {
  const authClient = new google.Auth.JWT({
    keyFile: path.resolve(
      process.cwd(),
      process.env.GMAIL_CREDENTIALS as string
    ),
    scopes: ["https://mail.google.com"],
    subject: "info@single-spa-workshop.com", // process.env.donotreply@email.com - this will change
  });

  await authClient.authorize();

  const gmail = new google.gmail_v1.Gmail({ auth: authClient });

  const email = await makeEmail({
    to,
    from: "Flax CRM <info@single-spa-workshop.com>",
    subject,
  });

  const result = await gmail.users.messages.send({
    auth: authClient,
    requestBody: {
      raw: email,
    },
    userId: "me",
  });

  if (result.status !== 200) {
    console.error(result);
    throw Error(`Call to Gmail API failed with status ${result.status}`);
  }
}
