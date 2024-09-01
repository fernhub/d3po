import { newUserSchema, userSchema, type NewUser, type User } from "shared/schema/user";
import { NextFunction, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cUser } from "$/db/cUser";
import { HttpError } from "shared/exceptions/HttpError";
import { HttpStatus } from "shared/enums/http-status.enums";
import dayjs from "dayjs";
import { error } from "console";

// Generate JWT
function generateToken(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "30d" });
}

async function signupUser(req: Request, res: Response, next: NextFunction) {
  console.log("creating user");

  // parse body from request
  const parse = newUserSchema.safeParse(req.body);
  if (parse.error) {
    next(parse.error);
    return;
  }
  console.log("parsed ok");
  const data = parse.data;

  console.log(data);
  console.log("does user exist?");

  const userExists = await cUser.findUserByEmail(data.email);
  if (userExists) {
    next(new HttpError({ message: "email already exists", code: HttpStatus.CONFLICT }));
    return;
  }
  console.log("no");

  // create hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  console.log("pass hashed");

  try {
    //create user
    console.log("creating row");

    const newUser: User = await cUser.createUser({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    //respond with jwt
    const authToken = generateToken(newUser.id);
    res.cookie("authToken", authToken, {
      secure: process.env.NODE_ENV !== "development",
      httpOnly: true,
      expires: dayjs().add(30, "days").toDate(),
    });
    res.status(HttpStatus.CREATED).send({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (e) {
    next(
      new HttpError({
        message: "Unable to create user",
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      })
    );
  }
}

async function loginUser(req: Request, res: Response, next: NextFunction) {
  const parse = userSchema
    .omit({
      id: true,
      name: true,
    })
    .safeParse(req.body);

  if (parse.error) {
    next(parse.error);
    return;
  }

  const { email, password } = parse.data;
  console.log(`locating ${email}, ${password}`);
  //fetch user
  const user = await cUser.findUserByEmail(email);

  //if user doesn't exist with these credentials, respond with error
  if (!user) {
    next(new HttpError({ message: "invalid email or password", code: HttpStatus.CONFLICT }));
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
    res.status(HttpStatus.OK).send({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } else {
    next(new HttpError({ message: "invalid email or password", code: HttpStatus.FORBIDDEN }));
    return;
  }
}

/**
 * Logout the current user
 * @param req
 * @param res
 */
async function logoutUser(req: Request, res: Response, next: NextFunction) {
  //add any logout logic here
  try {
    console.log(req.cookies.authToken);
    res.cookie("authToken", "", {
      httpOnly: true,
      expires: dayjs().subtract(1, "days").toDate(),
    });
    console.log("cleared auth cookie");
    console.log(res.cookie);
    res.status(HttpStatus.OK).send({ msg: "user logged out successfully" });
  } catch (e) {
    next(e);
    return;
  }
}
/**
 * Get and return user info based on provided id
 * @param req
 * @param res
 */
async function getUserInfo(req: Request, res: Response, next: NextFunction) {
  console.log("getting user info");
  const userId = req.user;
  if (!userId) {
    next(new HttpError({ message: "User info not found", code: HttpStatus.NOT_FOUND }));
  }
  const user = await cUser.findUserById(userId);
  if (user) {
    res.status(HttpStatus.OK).send({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } else {
    next(new HttpError({ message: "User info not found", code: HttpStatus.NOT_FOUND }));
  }
}

export const userController = {
  signupUser,
  loginUser,
  logoutUser,
  getUserInfo,
};
