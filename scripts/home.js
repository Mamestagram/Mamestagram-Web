const apiDomain = process.env.API_DOMAIN;
const modules = require("./modules");
const mysql = require("./modules/mysql");
const sql = require("sql-template-strings");

const home = () => {
    modules.app.get("/home", (req, res) => {
        const pageName = "Home", subDomain = "home";
        let ppRecords = {};

        modules.axios.get(`https://${apiDomain}/get_player_count`)
            .then((response) => {
                const data = response.data;
                const online = data.counts.online, total = data.counts.total;

                const connectMysql = () => {
                    mysql.pool.getConnection((err, connection) => {
                        try {
                            if (err) {
                                console.error(err);
                                setTimeout(connectMysql, 100);
                            }
                            else {
                                const process = async () => {
                                    const users = await mysql.query(
                                        connection, sql`
                                        SELECT *
                                        FROM users
                                        ORDER BY id DESC
                                        LIMIT 5;
                                        `
                                    );
                                    console.log(users);
                                    res.render("home.ejs", {
                                        online,
                                        total
                                    },
                                    (error, ejs) => {
                                        if (error) {
                                            modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error), subDomain);
                                        }
                                        else {
                                            modules.utils.writeLog(req, res, "GET", subDomain);
                                            res.send(ejs);
                                        }
                                    });
                                }
                                process();
                                connection.release();
                            }
                        }
                        catch (error) {
                            modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error), subDomain)
                        }
                    });
                }
                connectMysql();
            })
            .catch((error) => {
                modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error), subDomain);
            });
    });
}
module.exports = home;