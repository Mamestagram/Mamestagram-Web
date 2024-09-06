const modules = require("./scripts/modules");
const home = require("./scripts/home");

function connectMysql() {
    modules.pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            setTimeout(connectMysql, 100);
        }
        else {
            console.log(`MySQL is connected as id ${connection.threadId}`);
            connection.release();
        }
    });
}
connectMysql();

modules.app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.locals.currentTime = new Date().toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    }).replaceAll("/", "").replaceAll(" ", "").replaceAll(":", "");
    next();
});

modules.app.get("/", (req, res) => {
    res.redirect("/home");
});

// ホームページ
home();

modules.app.listen(5000, () => {
    console.log("Ready to acccess the Mamestagram Web");
});