import Sequelize from "sequelize";
import bcrypt from "bcryptjs";
import { UserModel } from "../DB/models/User.js";

const { Op } = Sequelize;

export async function findOrCreateLocalUser(email): Promise<UserModel> {
  const users = await UserModel.findAll({
    where: {
      email: email,
    },
  });

  let localUser = users.length > 0 ? users[0] : null;

  const hashLocalDevPass = await bcrypt.hash("localDevPassword", 5);

  if (!localUser) {
    localUser = await UserModel.create({
      firstName: "localDevFirstName",
      lastName: "localDevLastName",
      email: email,
      password: hashLocalDevPass,
      googleAuthToken: null,
    });
  }

  return localUser;
}

export async function findOrCreateGoogleUser(profile): Promise<UserModel> {
  const users = await UserModel.findAll({
    where: {
      googleAuthToken: profile.id,
    },
  });

  let googleUser = users.length > 0 ? users[0] : null;

  let userGoogleEmail: string =
    profile.emails.length > 0 ? profile.emails[0].value : null;

  if (!userGoogleEmail) {
    throw Error(`Could not find email address in Google profile`);
  }

  if (!googleUser) {
    googleUser = await UserModel.create({
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: userGoogleEmail,
      password: null,
      googleAuthToken: profile.id, // googleAuthToken is not a token, it's a Google id
    });
  }

  return googleUser;
}

export async function findUser(email, password): Promise<UserModel | null> {
  const hashpass = await bcrypt.hash(password, 5);
  const user = await findUserByEmail(email);

  if (user) {
    const hash = user.get("password");
    const isValid = bcrypt.compareSync(password, `${hash}`);

    return isValid ? user : null;
  } else {
    return null;
  }
}

export async function findUserByEmail(
  email: string
): Promise<UserModel | null> {
  const users = await UserModel.findAll({
    where: {
      email: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("email")),
        Op.eq,
        email.toLowerCase()
      ),
    },
  });
  return users.length > 0 ? users[0] : null;
}

export async function findUserById(userId: number): Promise<UserModel | null> {
  const users = await UserModel.findAll({
    where: {
      id: userId,
    },
  });
  return users.length > 0 ? users[0] : null;
}
