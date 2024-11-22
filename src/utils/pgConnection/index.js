require("dotenv").config();
const { Pool, Client } = require("pg");
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = require("../../config/env");

class PostgreConnection {
  constructor() {
    this.config = {
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      max: 15,
      idleTimeoutMillis: 40000, // Waktu idle sebelum koneksi ditutup 
      connectionTimeoutMillis: 8000 // Timeout untuk menunggu koneksi
    };

    this.pool = new Pool(this.config);
  }

  async connect() { // if using Postgre Pool no need to use this function
    try {
      if (!this.config) {
        throw new Error("Database configuration is required!");
      }

      this.client = new Client(this.config);
      await this.client.connect();
      console.log("[INFO->DB<-]: Postgres connection opened");

    } catch (error) {
      console.error("[INFO->DB<-]: error connecting to Postgres", error);
      throw error;
    }
  }

  async close() {
    if (this.client) {
      try {
        await this.pool.end();
        console.log("[INFO->DB<-]: Postgres connection closed");
      } catch (error) {
        console.error(
          "[INFO->DB<-]: error closing Postgres connection: ",
          error
        );
        throw error;
      }
    }
  }

  async query(sql, params) {
    try {
      const client = await this.pool.connect(); // mendapatkan koneksi dari pool
      try {
        const result = await client.query(sql, params);
        console.log(
          `execute query : ${sql} and params : ${params === undefined ? "no params" : params}`
        );

        return result.rows;
      } finally {
        client.release(); // melepas koneksi kembali ke pool setelah digunakan
        console.log("[INFO->DB<-]: release Postgre connection to pool");

      }
    } catch (error) {
      console.log("[INFO->DB<-]: error executing query: ", error);
      throw error;
    }
  }
}

process.on('SIGINT', async () => {
  console.log(`\nReceived SIGINT, closing database pool..`);
  const postgre = new PostgreConnection();
  await postgre.close();
  process.exit(0);
})

module.exports = PostgreConnection;
