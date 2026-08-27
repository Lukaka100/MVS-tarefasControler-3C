const mysql = require("mysql2");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 4,
    queueLimit: 0
});

pool.getConnection((err, conn) => {
    if (err) {
        console.error("Falha ao conectar ao banco:", err.message);
    } else {
        console.log("Conexão com o banco estabelecida.");
        conn.release();
    }
});

module.exports = pool.promise();
