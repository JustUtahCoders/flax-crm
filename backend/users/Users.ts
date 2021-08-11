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

  const users = await sequelize.models.User.findAll({
    where: {
      email: email,
    },
  });

  const user = users.length > 0 ? users[0] : null;

  if (user) {
    // Model from Sequelize has a field accessor called get()  ... so I got the password field
    const hash = user.get("password");
    const isValid = bcrypt.compareSync(password, `${hash}`);

    return isValid ? user : null;
  } else {
    return null;
  }
}
