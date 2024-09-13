import { newUserSchema, userSchema, type NewUser, type User } from "shared/schema/user";
import { NextFunction, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cUser } from "$/db/cUser";
import { HttpError } from "shared/exceptions/HttpError";
import { HttpStatus } from "shared/enums/http-status.enums";
import dayjs from "dayjs";
import { error } from "console";
import { env } from "$/config";

// Generate JWT
function generateToken(userId: string) {
  console.log(userId);
  return jwt.sign({ userId }, env.JWT_SECRET!, { expiresIn: "30d" });
}

async function signupUser(req: Request, res: Response, next: NextFunction) {
  try {
    // parse body from request
    const parse = newUserSchema.safeParse(req.body);
    if (parse.error) {
      next(parse.error);
      return;
    }
    const data = parse.data;

    console.log(data);

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
      secure: env.NODE_ENV == "production",
      sameSite: "none",
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
  try {
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

    //fetch user
    const user = await cUser.findUserByEmail(email);

    //if user doesn't exist with these credentials, respond with error
    if (!user) {
      next(new HttpError({ message: "invalid email or password", code: HttpStatus.CONFLICT }));
      return;
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log(user);
      console.log(`generating login token: ${user.id}`);
      const authToken = generateToken(user.id);
      res.cookie("authToken", authToken, {
        secure: env.NODE_ENV == "production",
        sameSite: "none",
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
  } catch (e) {
    console.log(e);
    next(
      new HttpError({ message: "Error logging in user", code: HttpStatus.INTERNAL_SERVER_ERROR })
    );
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
    res.cookie("authToken", "", {
      secure: env.NODE_ENV == "production",
      sameSite: "none",
      httpOnly: true,
      expires: dayjs().subtract(1, "days").toDate(),
    });
    console.log("cleared auth cookie");
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
  try {
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
  } catch (e) {
    next(new HttpError({ message: "Error locating user", code: HttpStatus.INTERNAL_SERVER_ERROR }));
  }
}

export const userController = {
  signupUser,
  loginUser,
  logoutUser,
  getUserInfo,
};
