import { QueryResult } from "pg";
import { db } from "./db";
import { type NewUser, type User } from "shared/schema/user";

/**
 * Functions related to DB queries for Users table
 */
export const cUser = {
  /**
   * Select existing user from database, if none exist return undefined
   * @param email
   * @returns User or undefined
   */
  findUserByEmail: async function (email: string): Promise<User | undefined> {
    console.log("finding user: ", email);

    const queryResult: QueryResult = await db.query("SELECT * from users where email=$1", [email]);
    if (queryResult.rowCount === 0) {
      return undefined;
    } else {
      const user = queryResult.rows[0];
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.passhash,
      };
    }
  },
  findUserById: async function (id: string): Promise<User | undefined> {
    console.log("finding user: ", id);
    // console.log(`SELECT * from users where email='${email}'`);
    const queryResult: QueryResult = await db.query("SELECT * from users where id=$1", [id]);
    if (queryResult.rowCount === 0) {
      console.log(`did not find user ${id}`);
      return undefined;
    } else {
      const user = queryResult.rows[0];
      console.log(`found user ${id}`);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.passhash,
      };
    }
  },
  /**
   * Create a new user based on the passed in parameters
   * @param user - name, email, password hash
   * @returns created user with corresponding id
   */
  createUser: async function (user: NewUser): Promise<User> {
    console.log("creating user: ", user.email);
    const queryResult: QueryResult = await db.query(
      "INSERT INTO users (name, email, passhash) VALUES ($1, $2, $3) RETURNING id",
      [user.name, user.email, user.password]
    );
    return {
      id: queryResult.rows[0].id,
      ...user,
    };
  },
};
