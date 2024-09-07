const host = process.env.DB_HOST, user = process.env.DB_USER, password = process.env.DB_PASS, database = process.env.DB_NAME, port = process.env.DB_PORT;
const mysql = require("mysql");
const pool = mysql.createPool({ 
    host,
    user,
    password,
    database,
    port,
    stringifyObjects: true
});
const query = (connection, sql, args) => {
    return new Promise((resolve, reject) => {
        connection.query(
            sql,
            args ? args : [],
            (error, results) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results);
                }
            }
        );
    });
}
module.exports = {
    pool,
    query
};