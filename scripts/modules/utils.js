// IPアドレス取得
const getIP = (req) => {
    try {
        if (req.headers["x-forwarded-for"]) {
            return req.headers["x-forwarded-for"];
        }
        else if (req.connection && req.connection.remoteAddress) {
            return req.connection.remoteAddress;
        }
        else if (req.connection.socket && req.connection.socket.remoteAddress) {
            return req.connection.socket.remoteAddress;
        }
        else if (req.socket && req.socket.remoteAddress) {
            return req.socket.remoteAddress;
        }
        else {
            return "0.0.0.0";
        }
    }
    catch (error) {
        console.error(error);
        return "0.0.0.0";
    }
}

// 日付取得
const getTime = () => {
    const now = new Date();
    return now.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Tokyo",
        timeZoneName: "short",
        language: "en"
    });
}

// ログ出力
const writeLog = (req, res, type, subDomain) => {
    const DOMAIN = process.env.DOMAIN;
    const log = `[${getTime()}] [${type}] ${DOMAIN}/${subDomain} (${getIP(req)}${res.locals.isLoggedIn ? `, userid: ${req.session.userid})` : ")"}`;
    console.log(log);
}

// エラー内容取得
const getErrorContent = (pageName, error, more) => {
    return `${pageName}\nError: ${error}${more ? `\n${more}` : ""}`;
}
// エラーログ書き込み
const writeError = (req, res, content, subDomain) => {
    const ERR_PATH = process.env.ERR_PATH;
    const fs = require("fs");
    res.send(
        `
        An error of unknown cause has occurred. Will be redirected to the home page soon. This error log will be sent to the server.
        <script>
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        </script>
        `
    );
    writeLog(req, res, "ERROR", subDomain);
    console.log(content);
    const files = fs.readdirSync(ERR_PATH);
    fs.writeFileSync(`${ERR_PATH}/error_${files.length + 1}.txt`, content, "utf-8");
    console.log(`Error has been saved (${files.length + 1})`);
}

// safe_name取得
const getSafeName = (username) => {
    return username.toLowerCase().replaceAll(" ", "_");
}

module.exports = {
    writeLog,
    getErrorContent,
    writeError,
    getSafeName
};