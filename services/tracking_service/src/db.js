import { Pool } from "pg";

console.log("Here we are arent we")

export const pool = new Pool ({
  connectionString: process.env.DATABASE_URL,
});
