const fs = require("fs");

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
const writeLog = (req, res, type, subDomain, more) => {
    const BASE_DOMAIN = process.env.BASE_DOMAIN, LOG_PATH = process.env.LOG_PATH;
    const log = `[${getTime()}] [${type}] web.${BASE_DOMAIN}/${subDomain} (${getIP(req)}${res.locals.isLoggedIn ? `, userid: ${req.session.userid})` : ")"}${more ? `\n${more}` : ""}`;
    const date = new Date(), path = `${LOG_PATH}/${date.getFullYear()}-${date.getMonth() + 1}`, fileName = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    console.log(log);
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
    fs.appendFileSync(`${path}/${fileName}.log`, `${log}\n`, "utf-8");
}

// エラー内容取得
const getErrorContent = (pageName, error, more) => {
    return `${pageName}\nError: ${error}${more ? `\n${more}` : ""}`;
}
// エラーログ書き込み
const writeError = (req, res, content, subDomain) => {
    const ERR_PATH = process.env.ERR_PATH;
    res.send(
        `
        An error of unknown cause has occurred. Will be redirected to the home page soon. This error log will be sent to the administrator.
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

/* modeNum取得
"std" → 0
"taiko" → 1
"ctb" → 2
"mania" → 3
"rxstd" → 4
"rxtaiko" → 5
"rxctb" → 6
"apstd" → 8
*/
const getModeNum = (modeName) => {
    switch (modeName) {
        case "std": return 0;
        case "taiko": return 1;
        case "ctb": return 2;
        case "mania": return 3;
        case "rxstd": return 4;
        case "rxtaiko": return 5;
        case "rxctb": return 6;
        case "apstd": return 8;
        default: return null;
    }
}

/* sqlでORDER BYに使用する名前取得
"accuracy" → "acc"
"playcount" → "plays"
"performance" → "pp"
"score" → "rscore"
"dans" → "dans"
*/
const getSortName = (sort) => {
    switch (sort) {
        case "accuracy": return "acc";
        case "playcount": return "plays";
        case "performance": return "pp";
        case "score": return "rscore";
        case "dans": return "dans";
        default: return null;
    }
}

module.exports = {
    getIP,
    writeLog,
    getErrorContent,
    writeError,
    getSafeName,
    getModeNum,
    getSortName
};