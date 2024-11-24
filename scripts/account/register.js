const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY, geoApiKey = process.env.GEO_API_KEY;
const modules = require("../modules");
const mysql = require("../modules/mysql");

const register = () => {
    const pageName = "Register", subDomain = "register";
    let name, email, password, errLi, isClicked = false, time;

    modules.app.post(("/register"),
        (req, res, next) => {
            name = req.body.username;
            email = req.body.email;
            password = req.body.password;
            next();
        },
        (req, res, next) => {
            errLi = { username: [], email: [], hf: false, bot: false }
            time = 0;
            if (!isClicked) {
                clicked = true;
                const timer = setInterval(() => {
                    if (time >= 10) {
                        clicked = false;
                        clearInterval(timer);
                    }
                }, 1000);
                next();
            }
            else {
                time = 0;
                errLi.hf = true;
                res.render("account.ejs", {
                        type: "register",
                        errLi,
                        name,
                        email,
                        password
                    },
                    (error, ejs) => {
                        if (error) {
                            modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error, `Name: ${name}\nEmail: ${email}`));
                        }
                        else {
                            modules.utils.writeLog(req, res, "POST (Failed)", subDomain);
                            res.send(ejs);
                        }
                    }
                );
            }
        },
        (req, res, next) => {
            connnectMysql = () => {
                mysql.pool.getConnection((err, connection) => {
                    if (err) {
                        console.error(err)
                        setTimeout(connnectMysql, 100);
                    }
                    else {
                        const process = async () => {
                            try {
                                const getBanWords = await mysql.query(
                                    connection, 
                                    `
                                        SELECT word
                                        FROM banword;
                                    `
                                );
                                const banWords = getBanWords.map((row) => row.word);
                                for (let word of banWords) {
                                    if (name.includes(word)) {
                                        errLi.username.push("Contains banned words");
                                        break;
                                    }
                                }
                            }
                            catch (error) {
                                modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error, `Name: ${name}\nEmail: ${email}`), subDomain);
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
            connnectMysql();
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
                                const getNames = await mysql.query(
                                    connection,
                                    `
                                        SELECT id
                                        FROM users
                                        WHERE name = ?;
                                    `,
                                    [name]
                                );
                                const getEmails = await mysql.query(
                                    connection,
                                    `
                                        SELECT id
                                        FROM users
                                        WHERE email = ?;
                                    `,
                                    [email]
                                );
                                if (getNames.length > 0) {
                                    errLi.username.push("Already exists");
                                }
                                if (getEmails.length > 0) {
                                    errLi.email.push("Already in use");
                                }
                            }
                            catch (error) {
                                modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error, `Name: ${name}\nEmail: ${email}`), subDomain);
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
        (req, res, next) => {
            if (errLi.username.length > 0 || errLi.email.length > 0) {
                res.render("account.ejs", {
                        type: "register",
                        errLi,
                        name,
                        email,
                        password
                    },
                    (error, ejs) => {
                        if (error) {
                            modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error, `Name: ${name}\nEmail: ${email}`));
                        }
                        else {
                            modules.utils.writeLog(req, res, "POST (Failed)", subDomain);
                            res.send(ejs);
                        }
                    }
                );
            }
            else {
                next();
            }
        },
        (req, res, next) => {
            modules.axios.get(`https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${req.body.recaptcha}`)
                .then((response) => {
                    const data = response.data;
                    const success = data.success, score = data.score;
                    if (success && score >= 0.9) {
                        next();
                    }
                    else {
                        errLi.bot = true;
                        res.render("account.ejs", {
                                type: "register",
                                errLi,
                                name,
                                email,
                                password
                            },
                            (error, ejs) => {
                                if (error) {
                                    modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error, `Name: ${name}\nEmail: ${email}`));
                                }
                                else {
                                    modules.utils.writeLog(req, res, "POST (Failed)", subDomain, `[username: ${name}, e-mail: ${email}, success: ${success}, score: ${score}]`);
                                    res.send(ejs);
                                }
                            }
                        );
                    }
                })
                .catch((error) => {
                    modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error, `Name: ${name}\nEmail: ${email}`), subDomain);
                });
        },
        (req, res) => {
            modules.axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${geoApiKey}&ip=${modules.utils.getIP(req)}`)
                .then((response) => {
                    const data = response.data;
                    const pass_hash = modules.bcrypt.hashSync(modules.crypto.createHash("md5").update(password).digest("hex"), 12), safeName = modules.utils.getSafeName(name), country = data.country_code2.toLowerCase();
                    const connectMysql = () => {
                        mysql.pool.getConnection((err, connection) => {
                            if (err) {
                                console.error(err);
                                setTimeout(connectMysql, 100);
                            }
                            else {
                                const process = async () => {
                                    try {
                                        const getId = await mysql.query(
                                            connection,
                                            `
                                                SELECT id
                                                FROM users
                                                ORDER BY id DESC
                                                LIMIT 1;
                                            `
                                        );
                                        const userid = getId[0].id + 1;
                                        // usersに追加
                                        await mysql.query(
                                            connection,
                                            `
                                                INSERT INTO users (id, name, safe_name, email, priv, pw_bcrypt, country, creation_time)
                                                VALUES (?, ?, ?, ?, 3, ?, ?, UNIX_TIMESTAMP(NOW()));
                                            `,
                                            [userid, name, safeName, email, pass_hash, country]
                                        );
                                        // statsに追加
                                        for (let i = 0; i <= 8; i++) {
                                            if (i !== 7) {
                                                await mysql.query(
                                                    connection,
                                                    `
                                                        INSERT INTO stats (id, mode)
                                                        VALUES (?, ?);
                                                    `,
                                                    [userid, i]
                                                );
                                            }
                                        }
                                        // dan_statsに追加
                                        for (let i = 0; i <= 3; i++) {
                                            switch (i) {
                                                case 0:
                                                case 1:
                                                    for (let j = 0; j <= 1; j++) {
                                                        await mysql.query(
                                                            connection,
                                                            `
                                                                INSERT INTO dan_stats (id, type, mode, cs)
                                                                VALUES (?, ?, ?, 0);
                                                            `,
                                                            [userid, j, i]
                                                        );
                                                    }
                                                    break;
                                                case 3:
                                                    let cs;
                                                    for (let j = 0; j < 14; j++) {
                                                        if (j >= 0 && j <= 4) { cs = 4; }
                                                        else if (j <= 8) { cs = 6; }
                                                        else if (j <= 12) { cs = 7; }
                                                        else { cs = 10; }
                                                        await mysql.query(
                                                            connection,
                                                            `
                                                                INSERT INTO dan_stats (id, type, mode, cs)
                                                                VALUES (?, ?, ?, ?);
                                                            `,
                                                            [userid, j, i, cs]
                                                        );
                                                    }
                                                    break;
                                                default:
                                                    await mysql.query(
                                                        connection,
                                                        `
                                                            INSERT INTO dan_stats (id, type, mode, cs)
                                                            VALUES (?, 0, ?, 0);
                                                        `,
                                                        [userid, i]
                                                    );
                                            }
                                        }
                                        // gacha_statsに追加
                                        await mysql.query(
                                            connection,
                                            `
                                                INSERT INTO gacha_stats (id, had_badge)
                                                VALUES (?, 0);
                                            `,
                                            [userid]
                                        );
                                        modules.utils.writeLog(req, res, "POST (Succeeded)", subDomain, `[username: ${name}, e-mail: ${email}]`);
                                        res.send(
                                            `
                                            <script>
                                                alert("Successfully registered your account!");
                                                location.href = "/account?class=signin";
                                            </script>
                                            `
                                        );
                                    }
                                    catch (error) {
                                        modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error, `Name: ${name}\nEmail: ${email}`), subDomain);
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
                })
                .catch((error) => {
                    modules.utils.writeError(req, res, modules.utils.getErrorContent(pageName, error, `Name: ${name}\nEmail: ${email}`), subDomain);
                });
        }
    );
}
module.exports = register;