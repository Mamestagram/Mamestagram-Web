const crypto = require('crypto');
code = crypto.randomBytes(8).toString("base64"); // 認証コード
key = crypto.createHash("sha512").update(code).digest("base64"); // 認証キー
console.log(code, "\n" + key);