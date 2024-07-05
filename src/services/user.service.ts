import { PayloadCreateUser, PayloadUpdateUser, User } from '../models/user.model';
import { databaseClient } from './database.service';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = process.env.SALT_ROUNDS;

async function getUser(userName: string): Promise<User | undefined> {
  try {
    const sql = {
      text: 'Select * from users where users.username = $1',
      values: [userName],
    };
    const result = await databaseClient.executeQuery(sql.text, sql.values)
    return result?.rows?.[0]
  } catch (e) {
    throw new Error('Has error occur!!');
  }
}

async function getUserById(id: number):Promise<User | undefined>  {
  try {
    const sql = {
      text: 'Select * from users where users.id = $1',
      values: [id],
    };
    const result = await databaseClient.executeQuery(sql.text, sql.values)
    return result?.rows?.[0]
  } catch (e) {
    throw new Error('Has error occur!!');
  }
}

async function createUser(newUserPayload: PayloadCreateUser):Promise<User | undefined>  {
  try {
    const hashPassword = bcrypt.hashSync(newUserPayload.password, Number(SALT_ROUNDS));
    const newUser: PayloadCreateUser = {
      username: newUserPayload.username.trim(),
      password: hashPassword,
      fullName: newUserPayload.fullName.trim(),
      phoneNumber: newUserPayload.phoneNumber.trim(),
      email: newUserPayload.email.trim(),
    };
    const result = await getUser(newUser.username);
    
    if (result) {
      throw new Error('Username is already exist!!!');
    }
    const sql =
      'INSERT INTO users (username, password, fullName, phoneNumber, email) VALUES($1, $2, $3, $4, $5) RETURNING *';
    const resultCreateUser = await databaseClient.executeQuery(sql, [
      newUser.username,
      newUser.password,
      newUser.fullName,
      newUser.phoneNumber,
      newUser.email,
    ]);

    const createdUser = resultCreateUser?.rows?.[0];
    if (!createdUser) {
      throw new Error(`Cannot create new user with username: ${newUser.username}`);
    }

    return createdUser;
  } catch (e) {    
    throw new Error('Can not create user');
  }
}

async function getAllUsers(): Promise<User[]> {
  try {
    const sql = 'Select * from users';
    const result = await databaseClient.executeQuery(sql);
    return result?.rows ?? []
  } catch (err) {
    throw new Error(`Get users error. ${err}`);
  }
}

async function updateUser(id: number, newUpdatedUserData: PayloadUpdateUser): Promise<User | undefined> {
  try {
    const sql = `UPDATE users SET fullName = $1, phoneNumber = $2, email = $3 WHERE id = $4 RETURNING *`;
    const result = await databaseClient.executeQuery(sql, [
      newUpdatedUserData.fullName,
      newUpdatedUserData.phoneNumber,
      newUpdatedUserData.email,
      id,
    ]);
    return result?.rows?.[0];
  } catch (err) {
    throw new Error('Can not update user');
  }
}
async function deleteUserById(id: number): Promise<boolean> {
  try {
    const sql = 'DELETE FROM users WHERE id=$1';
    const result = await databaseClient.executeQuery(sql, [id]);
    return !!result.rowCount
  } catch (err) {
    throw new Error('Can not delete user');
  }
}

export const userService = {
  getUser,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUserById
}
