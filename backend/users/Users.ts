import { sequelize } from "../DB.js";
import bcrypt from "bcryptjs";

export async function findOrCreateLocalUser(email) {
  const users = await sequelize.models.User.findAll({
    where: {
      email: email,
    },
  });

  let localUser = users.length > 0 ? users[0] : null;

  const hashLocalDevPass = await bcrypt.hash("localDevPassword", 5);

  if (!localUser) {
    localUser = await sequelize.models.User.create({
      firstName: "localDevFirstName",
      lastName: "localDevLastName",
      email: email,
      password: hashLocalDevPass,
      googleAuthToken: null,
    });
  }

  return localUser;
}

export async function findUser(email, password) {
  const hashpass = await bcrypt.hash(password, 5);

  // Issue 1: users should be typed as an array of User objects, but was typed as an array of Models...
  // Because of that, was not able to use user.password on Line 47
  const users = await sequelize.models.User.findAll({
    where: {
      email: email,
    },
  });

  // Issue 2: I couldn't use users.first so went with the below line
  const user = users.length > 0 ? users[0] : null;

  if (user) {
    // Model from Sequelize has a field accessor called get()  ... so I got the password field
    const hash = user.get("password");
    const isValid = bcrypt.compareSync(password, `${hash}`);

    console.log("----------------in findUser: isValid:", isValid);
    return isValid ? user : null;
  } else {
    return null;
  }
}
