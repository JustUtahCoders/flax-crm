import { sequelize } from "../DB.js";

export async function findOrCreateLocalUser(email) {
  // Find the user by email
  const users = await sequelize.models.User.findAll({
    where: {
      email: email,
    },
  });
  // Not sure why Model.<any, any>[] does not have first() method (?)
  //  const user = users.first();
  let localUser = users.length > 0 ? users[0] : null;
  // If no user, create one
  if (!localUser) {
    localUser = await sequelize.models.User.create({
      firstName: "localDevFirstName",
      lastName: "localDevLastName",
      email: email,
      password: "localDevPassword",
      googleAuthToken: "localDevGoogleAuthToken",
    });
  }
  return localUser;
}

//module.exports = { findOrCreateLocalUser };
