const modules = require("./modules");
const functions = require("./modules/functions");
const mysql = require("./modules/mysql");

const leaderboard = () => {
    modules.app.get("/leaderboard", (req, res) => {
        res.redirect(`/leaderboard/${functions.modeName(res.locals.favMode)}/performance`);
    });
    modules.app.get("/leaderboard/:mode/:sort",
        (req, res, next) => {
            if (req.params.mode !== "std" && req.params.mode !== "taiko" && req.params.mode !== "ctb" && req.params.mode !== "mania" && req.params.mode !== "rxstd" && req.params.mode !== "rxtaiko" && req.params.mode !== "rxctb" && req.params.mode !== "apstd") {
                res.redirect(`/leaderboard/${functions.modeName(res.locals.favMode)}/${req.params.sort}`);
            }
            else if (req.params.sort !== "accuracy" && req.params.sort !== "playcount" && req.params.sort !== "performance" && req.params.sort !== "score" && req.params.sort !== "dans") {
                res.redirect(`/leaderboard/${req.params.mode}/pp`);
            }
            else if (req.query.page !== undefined && req.query.page <= 0) {
                res.redirect(`/leaderboard/${req.params.mode}/${req.params.sort}`);
            }
            else {
                next();
            }
        },
        (req, res) => {
            const pageName = "Leaderboard", subDomain = "leaderboard";
            const modeNum = modules.utils.getModeNum(req.params.mode), sort = modules.utils.getSortName(req.params.sort), page = req.query.page ? Number(req.query.page) : 1;
            let query, args = [];

            const connectMysql = () => {
                mysql.pool.getConnection((err, connection) => {
                    if (err) {
                        console.error(err);
                        setTimeout(connectMysql, 100);
                    }
                    else {
                        const process = async () => {
                            try {
                                // default
                                if (req.query.clan === undefined) {
                                    // default
                                    if (req.query.sort !== "dans") {
                                        query = `
                                        SELECT RANK() OVER(ORDER BY ${sort} DESC) AS ranking, 
                                            tag, public,
                                            clan_id, country, u.name, u.id, 
                                            acc, plays, pp, rscore, (xh_count + x_count) AS x_count, (sh_count + s_count) AS s_count, a_count
                                        FROM stats s
                                        JOIN users u
                                        ON s.id = u.id
                                        LEFT JOIN clans c
                                        ON clan_id = c.id
                                        WHERE mode = ?
                                        ${req.query.country !== undefined ? `AND country = ${req.query.country}` : ""}
                                        AND NOT u.id = 1
                                        AND NOT acc = 0
                                        AND NOT priv % 2 = 0
                                        ORDER BY ${sort} DESC
                                        LIMIT 50
                                        OFFSET ?;
                                        `;
                                        args.push(modeNum);
                                        args.push(50 * (page - 1));
                                    }
                                    // dans
                                    else {
                                        // 最速: 0.860 sec, 平均: 約 1.000 sec
                                        query = `
                                        SELECT RANK() OVER(ORDER BY pp DESC) AS ranking, 
                                            ANY_VALUE(tag) AS tag, ANY_VALUE(public) AS public, 
                                            ANY_VALUE(clan_id) AS clan_id, ANY_VALUE(country) AS country, ANY_VALUE(u.name) AS name, u.id,
                                            ANY_VALUE(pp) AS pp, ANY_VALUE(IFNULL(acc, 0)) AS acc, ANY_VALUE(IFNULL(plays, 0)) AS plays
                                        FROM dan_stats d_s FORCE INDEX(idx_dans_id_mode, idx_dans_pp)
                                        JOIN (
                                            SELECT id, mode, SUM(reward_pp) AS pp
                                            FROM dan_stats
                                            GROUP BY id, mode
                                        ) sub_d_s
                                        ON d_s.id = sub_d_s.id
                                        AND d_s.mode = sub_d_s.mode
                                        LEFT JOIN (
                                            SELECT userid, s.mode, AVG(s.acc) AS acc
                                            FROM scores s
                                            JOIN danmaps dm
                                            ON map_md5 = md5
                                            WHERE NOT grade = "F"
                                            AND s.acc >= dm.acc
                                            AND s.score >= dm.score
                                            GROUP BY userid, s.mode
                                        ) d_a
                                        ON d_s.id = d_a.userid
                                        AND d_s.mode = d_a.mode
                                        LEFT JOIN (
                                            SELECT userid, s.mode, COUNT(*) AS plays
                                            FROM scores s
                                            JOIN danmaps dm
                                            ON map_md5 = md5
                                            GROUP BY userid, s.mode
                                        ) d_p
                                        ON d_s.id = d_p.userid
                                        AND d_s.mode = d_p.mode
                                        JOIN users u
                                        ON d_s.id = u.id
                                        LEFT JOIN clans c
                                        ON clan_id = c.id
                                        WHERE d_s.mode = ?
                                        ${req.query.country !== undefined ? `AND country = ${req.query.country}` : ""}
                                        AND NOT u.id = 1
                                        AND NOT acc = 0
                                        AND NOT priv % 2 = 0
                                        GROUP BY d_s.id, d_s.mode
                                        ORDER BY pp DESC, acc DESC
                                        LIMIT 50
                                        OFFSET ?
                                        `;
                                        args.push(modeNum);
                                        args.push(50 * (page - 1));
                                    }
                                }
                                // clan
                                else {
                                    // default
                                    if (req.query.sort !== "dans") {

                                    }
                                    // dans
                                    else {

                                    }
                                }
                                const ranking = await mysql.query(
                                    connection,
                                    query,
                                    args
                                );
                                res.render(`${res.locals.language}/leaderboard.ejs`, {
                                        ranking,
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
                            catch (error) {
                                modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error), subDomain);
                            }
                            finally {
                                connection.release();
                            }
                        }
                        process();
                    }
                });
            }
            connectMysql();
        }
    );
}
module.exports = leaderboard;