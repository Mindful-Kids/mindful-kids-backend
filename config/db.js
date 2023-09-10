const sql = require("mssql/msnodesqlv8");

const connection = new sql.ConnectionPool({
  database: process.env.DATABASE_NAME,
  server: process.env.SERVER_NAME,
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true,
  },
});

connection.connect().then(() => {
  console.log("Connected to SQL Server");
});

module.exports = connection;
