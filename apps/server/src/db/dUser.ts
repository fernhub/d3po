import { Query, QueryResult } from "pg";
import { db } from "./db";
import { type NewUser, type User } from "shared/schema/user";

/**
 * Functions related to DB queries for Users table
 */
export const dUser = {
  /**
   * Select existing user from database, if none exist return undefined
   * @param email
   * @returns User or undefined
   */
  findOne: async function (email: string): Promise<User | undefined> {
    console.log("finding user: ", email);
    // console.log(`SELECT * from users where email='${email}'`);
    const queryResult: QueryResult = await db.query(`SELECT * from users where email='${email}'`);
    // console.log(queryResult);
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
  /**
   * Create a new user based on the passed in parameters
   * @param user - name, email, password hash
   * @returns created user with corresponding id
   */
  createUser: async function (user: NewUser): Promise<User> {
    console.log("creating user: ", user.email);
    const queryResult: QueryResult = await db.query(
      `INSERT INTO users (name, email, passhash) VALUES ('${user.name}', '${user.email}', '${user.password}') RETURNING id`
    );
    return {
      id: queryResult.rows[0].id,
      ...user,
    };
  },
};
