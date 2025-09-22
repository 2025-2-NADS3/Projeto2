import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()
let db;

try {
    db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });
    console.log("Conectado ao MySQL!");
} catch (error) {
    console.error("ERRO FATAL: Não foi possível conectar ao banco de dados.", error.message);
    process.exit(1);
}

export default db;
