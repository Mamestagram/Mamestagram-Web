const apiDomain = process.env.API_DOMAIN;
const modules = require("./modules");
const mysql = require("./modules/mysql");

const home = () => {
    modules.app.get("/home", (req, res) => {
        const pageName = "Home", subDomain = "home";
        let online, total, ppRecords = {};

        modules.axios.get(`https://${apiDomain}/get_player_count`)
            .then((response) => {
                const data = response.data;
                online = data.counts.online;
                total = data.counts.total;

                const connectMysql = () => {
                    mysql.pool.getConnection((err, connection) => {
                        try {
                            if (err) {
                                console.error(err);
                                setTimeout(connectMysql, 100);
                            }
                            else {
                                const process = async () => {
                                    for (let i = 0; i <= 8; i++) {
                                        if (i !== 7) {
                                            const ppRecord = await mysql.query(
                                                connection, 
                                                `
                                                SELECT u.id AS id, name, pp
                                                FROM scores s FORCE INDEX(idx_scores_mode_status_pp)
                                                JOIN users u
                                                ON u.id = userid
                                                JOIN maps m
                                                ON md5 = map_md5
                                                WHERE u.priv & 1
                                                AND m.status in (2, 3)
                                                AND s.status = 2
                                                AND s.mode = ?
                                                ORDER BY pp DESC
                                                LIMIT 1;
                                                `,
                                                [i]
                                            );
                                            ppRecords[`mode${i}`] = ppRecord[0];
                                        }
                                    }
                                    res.render(`${res.locals.language}/home.ejs`, {
                                        online,
                                        total,
                                        ppRecords
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