const modules = require("./scripts/modules");

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

modules.app.get("/", (req, res) => {
    res.redirect("/home");
});

modules.app.listen(5000, () => {
    console.log("ready");
});