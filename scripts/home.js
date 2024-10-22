const apiDomain = process.env.API_DOMAIN;
const modules = require("./modules");
const mysql = require("./modules/mysql");
const functions = require("./modules/functions");

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
                                                SELECT u.id AS id, country, name, pp, 
                                                    set_id, m.id AS mapid, artist, title, version, grade, score, acc, s.max_combo AS max_combo, 
                                                    ngeki, n300, nkatu, n100, n50,nmiss, pp, play_time, mods, 
                                                    TIMESTAMPDIFF(YEAR, play_time, NOW()) AS year, TIMESTAMPDIFF(MONTH, play_time, NOW()) AS month, TIMESTAMPDIFF(WEEK, play_time, NOW()) AS week, TIMESTAMPDIFF(DAY, play_time, NOW()) AS day, TIMESTAMPDIFF(HOUR, play_time, NOW()) AS elapased_hour, TIMESTAMPDIFF(MINUTE, play_time, NOW()) AS minute, TIMESTAMPDIFF(SECOND, play_time, NOW()) AS second
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
                                            functions,
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
                                        }
                                    );
                                }
                                process();
                            }
                        }
                        catch (error) {
                            modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error), subDomain)
                        }
                        finally {
                            connection.release();
                        }
                    });
                }
                connectMysql();
            })
            .catch((error) => {
                modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error), subDomain);
            });
    });
    modules.app.get('/getstatus', (req, res) => {
        modules.axios.get(`https://${apiDomain}/get_player_count`)
        .then((response) => {
            const data = response.data;
            online = data.counts.online;
            total = data.counts.total;

            const newStatus = { online, total };
            res.json(newStatus);
        })
        .catch((error) => {
            modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error), subDomain);
        });
    });
}
module.exports = home;