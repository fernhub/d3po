import { newUserSchema, userSchema, type NewUser, type User } from "shared/schema/user";
import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dUser } from "$/db/dUser";
import { HttpError } from "shared/exceptions/HttpError";
import { HttpStatus } from "shared/enums/http-status.enums";
import dayjs from "dayjs";

// Generate JWT
function generateToken(userId: number) {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "30d" });
}

async function registerUser(req: Request, res: Response) {
  console.log("registering user");
  // parse body from request
  const data: NewUser = newUserSchema.parse(req.body);

  console.log(data);

  const userExists = await dUser.findUserByEmail(data.email);
  if (userExists) {
    res.status(409).send({ msg: "email already exists" });
  }

  // create hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  try {
    //create user
    const newUser: User = await dUser.createUser({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    //respond with jwt
    const authToken = generateToken(newUser.id);
    res.cookie("authToken", JSON.stringify(authToken), {
      secure: process.env.NODE_ENV !== "development",
      httpOnly: true,
      expires: dayjs().add(30, "days").toDate(),
    });
    res.status(201).send({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (e) {
    throw new HttpError({
      message: "Unable to create user",
      code: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

async function loginUser(req: Request, res: Response) {
  const { email, password } = userSchema
    .omit({
      id: true,
      name: true,
    })
    .parse(req.body);

  console.log(`locating ${email}, ${password}`);
  //fetch user
  const user = await dUser.findUserByEmail(email);

  //if user doesn't exist with these credentials, respond with error
  if (!user) {
    res.status(HttpStatus.FORBIDDEN).send({ msg: "invalid email or password" });
    return;
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    const authToken = generateToken(user.id);
    console.log(`setting auth token ${authToken}`);
    res.cookie("authToken", authToken, {
      secure: process.env.NODE_ENV !== "development",
      httpOnly: true,
      expires: dayjs().add(30, "days").toDate(),
    });
    res.status(200).send({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(HttpStatus.FORBIDDEN).send({ msg: "invalid email or password" });
  }
}

/**
 * Logout the current user
 * @param req
 * @param res
 */
async function logoutUser(req: Request, res: Response) {
  //add any logout logic here
  try {
    console.log(req.cookies.authToken);
    res.cookie("authToken", "", {
      httpOnly: true,
      expires: dayjs().subtract(1, "days").toDate(),
    });
    console.log("cleared auth cookie");
    console.log(res.cookie);
    res.status(200).send({ msg: "user logged out successfully" });
  } catch (e) {
    res.send(HttpStatus.INTERNAL_SERVER_ERROR).send({ msg: "unknown error occurred" });
  }
}
/**
 * Get and return user info based on provided id
 * @param req
 * @param res
 */
async function getUserInfo(req: Request, res: Response) {
  console.log("getting user info");
  const userId = req.user;
  if (!userId) {
    res.status(HttpStatus.NOT_FOUND).send({ msg: "User info not found" });
  }
  const user = await dUser.findUserById(userId);
  if (user) {
    res.status(200).send({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(HttpStatus.NOT_FOUND).send({ msg: "User info not found" });
  }
}

export const userController = {
  registerUser,
  loginUser,
  logoutUser,
  getUserInfo,
};
