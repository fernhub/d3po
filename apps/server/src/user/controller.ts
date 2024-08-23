import { newUserSchema, userSchema, type NewUser, type User } from "shared/schema/user";
import { type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dUser } from "$/db/dUser";
import { HttpError } from "$/common/exceptions/HttpError";
import { HttpStatus } from "$/common/enums/http-status.enums";

// Generate JWT
function generateToken(id: number) {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "30d" });
}

async function registerUser(req: Request, res: Response) {
  console.log("registering user");
  // parse body from request
  const data: NewUser = newUserSchema.parse(req.body);

  console.log(data);

  const userExists = await dUser.findOne(data.email);
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
    res.status(201).send({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      token: generateToken(newUser.id),
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

  //fetch user
  const user = await dUser.findOne(email);

  //if user doesn't exist with these credentials, respond with error
  if (!user) {
    res.status(409).send({ msg: "email already exists" });
    return;
  }

  //if user exists && password hashed matches the hashed password in the db, generate jwt and respond
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).send({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(409).send({ msg: "email already exists" });
  }
}

export const userController = {
  registerUser,
  loginUser,
};
