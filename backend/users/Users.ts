import { sequelize } from "../DB.js";

export async function findOrCreateLocalUser(email) {
  const users = await sequelize.models.User.findAll({
    where: {
      email: email,
    },
  });

  let localUser = users.length > 0 ? users[0] : null;

  if (!localUser) {
    localUser = await sequelize.models.User.create({
      firstName: "localDevFirstName",
      lastName: "localDevLastName",
      email: email,
      password: "localDevPassword",
      googleAuthToken: null,
    });
  }
  return localUser;
}

export async function findUser(email, password) {
  const users = await sequelize.models.User.findAll({
    where: {
      email: email,
      password: password,
    },
  });
  return users.length > 0 ? users[0] : null;
}
