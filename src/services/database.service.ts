import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_PORT } = process.env;

export class DatabaseService {
  private instance = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    port: Number(POSTGRES_PORT),
  });

  public async executeQuery(sql: string, values?: (string | number)[]) {
    const connection = await this.instance.connect();
    const result = await connection.query(sql, values);
    connection.release();
    return result;
  }

  private async closeConnection() {
    await this.instance.end();
  }
}

export const databaseClient = new DatabaseService();
