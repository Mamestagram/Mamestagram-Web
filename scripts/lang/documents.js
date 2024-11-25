const contents = {
    en: {
        welcome: "Welcome to Mamestagram!",
        about: 
        `
            <p>Mamestagram is a osu! private server where you can share your favorite beatmaps and scores with other users.</p>
            <p>This private eserver shows scores by mode, witch are not ranked in the official servers such as Relax and AutoPilot</p>
            <p>And also, this server has a unique feature that "Dan" system, which is a system that allows you to get a title by achieving a certain score.</p>
            <a href="/discord"><i class="fa-brands fa-discord"></i>Discord</a>
        `,
        rules: "Rules",
        ruleDisc: "There are two rules Discord and Private server each other.",
        discordRulesList: 
            `
                <h3>Prohibited Acts on the Discord</h3>
                <ul>
                    <li>Acts that cause inconvenience to members (such as spam or posting phishing URLs).</li>
                    <li>Sending messages that put a load on members' devices</li>
                    <li>Use of discriminatory language or any acts that amount to hatred or discrimination based on race, gender, religion, creed, social status, or sexual orientation.</li>
                    <li>Making excessively abusive remarks.</li>
                    <li>Malicious impersonation of other users.</li> 
                    <li>Distributing cheats, viruses, or self-made software.</li>
                    <li>Posting or attaching NSFW content.</li>
                    <li>Any act deemed inappropriate by the administration or a large number of users.</li>
                </ul>
            `,
        serverRulesList: 
            `
                <h3>Prohibited Acts on the Server</h3>
                    <ul>
                        <li>Creating alternate accounts (creating them will result in automatic restrictions).</li>
                        <li>Using any cheat to play.</li>
                        <li>Using tablet filter functions (may trigger cheat detection systems).</li>
                        <li>Using inappropriate avatars, banners, self-introductions, or usernames.</li>
                        <li>Use of discriminatory language or any acts that amount to hatred or discrimination based on race, gender, religion, creed, social status, or sexual orientation.</li>
                        <li>Malicious impersonation of other users.</li>
                        <li>Performing unnecessary computations on the server.</li>
                        <li>Any act deemed inappropriate by the administration or a large number of users.</li>
                    </ul>
            `,
        connect: "How to connect",
        connectDisc: "This is different from the way you connect to an official server, but it is the same way you connect to any other private server.",
        connectList: 
            `
                <ul>
                    <li>Create a osu! shortcut.</li>
                    <li>Right-click on the shortcut and select "Properties".</li>
                    <li>Enter the following in the "Target" field:</li>
                    <li><code>C:\Users\*Your account name*\AppData\Local\osu!\osu!.exe <input type="text" value="-devserver mamesosu.net" readonly><button onclick="clickCopy()"><i class="fa-solid fa-copy"></i><p class="mouse-over">Click to copy</p></button></code></li>
                    <li>Click "OK" to save the settings.</li>
                    <li>&lpar;If you didn't connect the server, please create a ticket on <a href="/discord"><i class="fa-brands fa-discord"></i></a>&rpar;</li>
                </ul>
            `,
    },
    jp: {

    }
}
module.exports = contents;