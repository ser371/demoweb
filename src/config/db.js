import sql from "mssql";
import dotenv from 'dotenv';
dotenv.config();

const config = {
  server: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
    options: {
        encrypt: false,
        tustServerCertificate: true
    }
}

console.log("DB config:", {
  DB_SERVER: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});


let pool;

export async function getConnect() {
    if (pool) return pool;
    try {
        pool = await sql.connect(config);
        console.log(`connected successfully, ${pool}`)
        return pool;
    } catch (err) {
         console.log("not connected tos db", err);
         throw err;
    }
    
}

