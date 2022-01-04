import google from "googleapis";
import path from "path";
import { encode } from "js-base64";

export const baseUrl = process.env.SERVER_ORIGIN || "http://localhost:7600";

async function makeEmail({ to, from, subject, body }) {
  // the white space is important, template literals are space sensitive
  const str = `
Content-Type: text/html; charset="UTF-8"
to: ${to}
from: ${from}
subject: =?utf-8?B? ${encode(subject, true)}?=

${body} 
`.trim();

  return encode(str, true);
}

export async function sendEmail({ to, subject, body }) {
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
    body,
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
