import { newUserSchema, type NewUser } from "shared/schema/user"

async function registerUser(req: Request, res: Response) {
  const data = newUserSchema.parse(req.body);
}

export const userController = {
  registerUser,
};
