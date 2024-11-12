const modules = require("./modules");
const mysql = require("./modules/mysql");

const leaderboard = () => {
    modules.app.get("/leaderboard", (req, res) => {
        res.redirect(`/leaderboard/${modules.utils.getModeNum(res.locals.favMode)}/perfoemance`);
    });
    modules.app.get("/leaderboard/:mode/:sort",
        (req, res, next) => {
            if (req.params.mode !== "std" && req.params.mode !== "taiko" && req.params.mode !== "ctb" && req.params.mode !== "mania" && req.params.mode !== "rxstd" && req.params.mode !== "rxtaiko" && req.params.mode !== "rxctb" && req.params.mode !== "apstd") {
                res.redirect(`/leaderboard/${modules.utils.getModeNum(res.locals.favMode)}/${req.query.sort}`);
            }
            else if (req.params.sort !== "accuracy" && req.params.sort !== "playcount" && req.params.sort !== "performance" && req.params.sort !== "score" && req.params.sort !== "dans") {
                res.redirect(`/leaderboard/${req.query.mode}/pp`);
            }
            else if (req.query.page !== undefined && req.query.page <= 0) {
                res.redirect(`/leaderboard/${req.query.mode}/${req.query.sort}`);
            }
            else {
                next();
            }
        },
        (req, res) => {
            const pageName = "Leaderboard", subDomain = "leaderboard";
            const modeNum = modules.utils.getModeNum(req.query.mode), sort = modules.utils.getSortName(req.query.sort), page = page ? Number(req.query.page) : 1;
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
                                            CONCAT("[", tag, "]") AS tag, 
                                            country, users.name, 
                                            acc, plays, pp, rscore, (xh_count + x_count) AS x_count, (sh_count + s_count) AS s_count, a_count
                                        FROM stats
                                        JOIN users
                                        ON stats.id = users.id
                                        LEFT JOIN clans
                                        ON clans.id = clan_id
                                        WHERE mode = ?
                                        ${req.query.country !== undefined ? "AND country = ?" : ""}
                                        AND NOT users.id = 1
                                        AND NOT acc = 0
                                        AND NOT priv % 2 = 0
                                        ORDER BY ${sort} DESC
                                        LIMIT 50
                                        OFFSET ?;
                                        `;
                                        args.push(modeNum);
                                        if (req.query.country !== undefined) {
                                            args.push(req.query.country);
                                        }
                                        args.push(page - 1);
                                    }
                                    // dans
                                    else {

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
                                res.render("leaderboard.ejs", {
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