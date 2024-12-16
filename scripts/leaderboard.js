const modules = require("./modules");
const mysql = require("./modules/mysql");
const functions = require("./modules/functions");
const contents = require("./lang/leaderboard");

const leaderboard = () => {
    const pageName = "Leaderboard", subDomain = "leaderboard";
    let modeNum, sort, page, ranking, query, args = [];

    modules.app.get(`/${subDomain}`, (req, res) => {
        res.redirect(`/${subDomain}/${functions.modeName(res.locals.favMode)}/performance`);
    });
    modules.app.get(`/${subDomain}/:mode/:sort`,
        (req, res, next) => {
            modeNum = modules.utils.getModeNum(req.params.mode);
            sort = modules.utils.getSortName(req.params.sort);
            page = req.query.page !== undefined ? Number(req.query.page) : 1;
            if (modeNum === null) {
                res.redirect(`/${subDomain}/${functions.modeName(res.locals.favMode)}/${req.params.sort}`);
            }
            else if (sort === null) {
                res.redirect(`/${subDomain}/${req.params.mode}/pp`);
            }
            else if (page <= 0) {
                res.redirect(`/${subDomain}/${req.params.mode}/${req.params.sort}`);
            }
            else {
                next();
            }
        },
        (req, res, next) => {
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
                                    if (req.params.sort !== "dans") {
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
                                            LIMIT 10000;
                                        `;
                                    }
                                    // dans
                                    else {
                                        query = `
                                            SELECT RANK() OVER(ORDER BY SUM(reward_pp) DESC) ranking,
                                                ANY_VALUE(tag) AS tag, ANY_VALUE(public) AS public, 
                                                ANY_VALUE(clan_id) AS clan_id, ANY_VALUE(country) AS country, ANY_VALUE(u.name) AS name, ANY_VALUE(u.id) AS id, 
                                                SUM(reward_pp) AS pp, ANY_VALUE(d_a.acc) AS acc, ANY_VALUE(d_p.plays) AS plays
                                            FROM dan_stats d_s
                                            LEFT JOIN (
                                                SELECT userid, s.mode, AVG(s.acc) AS acc
                                                FROM scores s
                                                JOIN danmaps dm
                                                ON map_md5 = md5
                                                WHERE NOT grade = 'F'
                                                AND s.acc >= dm.acc
                                                AND s.score >= dm.score
                                                AND status = 2
                                                GROUP BY userid, s.mode
                                            ) d_a
                                            ON d_a.userid = d_s.id
                                            AND d_s.mode = d_a.mode
                                            LEFT JOIN (
                                                SELECT userid, s.mode, COUNT(*) AS plays
                                                FROM scores s
                                                JOIN danmaps dm
                                                ON map_md5 = md5
                                                GROUP BY userid, s.mode
                                            ) d_p
                                            ON d_p.userid = d_s.id
                                            AND d_s.mode = d_p.mode
                                            JOIN users u
                                            ON d_s.id = u.id
                                            LEFT JOIN clans c
                                            ON clan_id = c.id
                                            WHERE d_s.mode = ?
                                            ${req.query.country !== undefined ? `AND country = ${req.query.country}` : ""}
                                            AND NOT u.id = 1
                                            AND NOT d_a.acc = 0
                                            AND NOT priv % 2 = 0
                                            GROUP BY d_s.id, d_s.mode
                                            ORDER BY pp DESC, acc DESC
                                            LIMIT 10000;
                                        `
                                    }
                                }
                                // clan
                                else {
                                    // default
                                    if (req.params.sort !== "dans") {
                                        query = `
                                            SELECT RANK() OVER(ORDER BY AVG(pp) DESC) AS ranking,
                                                   c.id, ANY_VALUE(tag) AS tag,
                                                   AVG(acc) AS acc, SUM(plays) AS plays, AVG(pp) AS pp, AVG(rscore) AS score, (SUM(xh_count) + SUM(x_count)) AS x_count, (SUM(sh_count) + SUM(s_count)) AS s_count, SUM(a_count) AS a_count
                                            FROM stats s
                                            JOIN users u
                                            ON s.id = u.id
                                            JOIN clans c
                                            ON c.id = clan_id
                                            WHERE mode = ?
                                            AND NOT u.id = 1
                                            AND NOT acc = 0
                                            AND NOT priv % 2 = 0
                                            AND NOT public = 0
                                            GROUP BY clan_id, mode
                                            ORDER BY pp DESC
                                            LIMIT 10000;
                                        `;
                                    }
                                    // dans
                                    else {
                                        query = `
                                            SELECT RANK() OVER(ORDER BY AVG(pp) DESC) AS ranking,
                                                c.id, ANY_VALUE(tag) AS tag,
                                                AVG(pp) AS pp, AVG(d_a.acc) AS acc, SUM(d_p.plays) AS plays
                                            FROM (
                                                SELECT id, mode, SUM(reward_pp) AS pp
                                                FROM dan_stats
                                                GROUP BY id, mode
                                            ) d_s
                                            LEFT JOIN (
                                                SELECT userid, s.mode, AVG(s.acc) AS acc
                                                FROM scores s
                                                JOIN danmaps dm
                                                ON map_md5 = md5
                                                WHERE NOT grade = 'F'
                                                AND s.acc >= dm.acc
                                                AND s.score >= dm.score
                                                AND status = 2
                                                GROUP BY userid, s.mode
                                            ) d_a
                                            ON d_a.userid = d_s.id
                                            AND d_s.mode = d_a.mode
                                            LEFT JOIN (
                                                SELECT userid, s.mode, COUNT(*) AS plays
                                                FROM scores s
                                                JOIN danmaps dm
                                                ON map_md5 = md5
                                                GROUP BY userid, s.mode
                                            ) d_p
                                            ON d_p.userid = d_s.id
                                            AND d_s.mode = d_p.mode
                                            JOIN users u
                                            ON d_s.id = u.id
                                            JOIN clans c
                                            ON c.id = clan_id
                                            WHERE d_s.mode = ?
                                            AND NOT u.id = 1
                                            AND NOT d_a.acc = 0
                                            AND NOT priv % 2 = 0
                                            AND NOT public = 0
                                            GROUP BY clan_id, d_s.mode
                                            ORDER BY pp DESC, acc DESC
                                            LIMIT 10000;
                                        `;
                                    }
                                }
                                args.push(modeNum);
                                ranking = await mysql.query(
                                    connection,
                                    query,
                                    args
                                );
                            }
                            catch (error) {
                                modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error), subDomain);
                            }
                            finally {
                                connection.release();
                                next();
                            }
                        }
                        process();
                    }
                });
            }
            connectMysql();
        },
        (req, res) => {
            res.render("leaderboard.ejs", {
                    contents: contents[req.session.language],
                    ranking,
                    modeNum,
                    sort: req.params.sort,
                    selectedCountry: req.query.country !== undefined ? req.query.country : "all",
                    clan: req.query.clan !== undefined,
                    page
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
    );
}
module.exports = leaderboard;