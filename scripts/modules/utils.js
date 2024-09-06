const writeError = (content, res) => {
    require("dotenv").config();
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
    console.log(content);
    const files = fs.readdirSync(ERR_PATH);
    fs.writeFileSync(`${ERR_PATH}/error_${files.length + 1}.txt`, content, "utf-8");
    console.log(`Error has been saved (${files.length + 1})`);
}
module.exports = {
    writeError
};