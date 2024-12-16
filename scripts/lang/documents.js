// 難易度による色取得
const getColor = (diff) => {
    const color = [
        "#4291fd", "#4396fd", "#449bfd", "#46a0fd", // 0.0 ~ 0.5
        "#47a4fd", "#48a9fd", "#4aaffd", "#4bb3fd", // 0.5 ~ 1.0
        "#4cb8fd", "#4dbcfd", "#4ec3f9", "#4ecdf2", // 1.0 ~ 1.5
        "#4ed8eb", "#4ee3e4", "#4eeedc", "#4ef8d6", // 1.5 ~ 2.0
        "#53fdc0", "#5efda2", "#69fd82", "#74fd5f", // 2.0 ~ 2.5
        "#82fc4f", "#97f951", "#abf753", "#bef455", // 2.5 ~ 3.0
        "#d0f257", "#e2f059", "#f4ec5b", "#f5dd5d", // 3.0 ~ 3.5
        "#f6cf5e", "#f8be60", "#f9af62", "#faa063", // 3.5 ~ 4.0
        "#fc8f65", "#fd8167", "#fd7868", "#fd6f69", // 4.0 ~ 4.5
        "#fd676a", "#fd5d6c", "#fd536d", "#fa4d70", // 4.5 ~ 5.0
        "#f24b7b", "#eb4a85", "#e2498f", "#da4799", // 5.0 ~ 5.5
        "#d346a3", "#cc45ac", "#c444b6", "#b548bd", // 5.5 ~ 6.0
        "#a84cc0", "#9b50c6", "#8f54cb", "#8059d0", // 6.0 ~ 6.5
        "#735dd6", "#6561db", "#5a58d2", "#524fc9", // 6.5 ~ 7.0
        "#4745be", "#3f3db6", "#3532ab", "#2a28a0", // 7.0 ~ 7.5
        "#221f97", "#19168e", "#16137f", "#131172", // 7.5 ~ 8.0
        "#110f64", "#0f0d55", "#0c0b46", "#0a0839", // 8.0 ~ 8.5
        "#07062b", "#05051f", "#030211", "#010104", // 8.5 ~ 9.0
        "#000000" // 9.0 ~
    ];
    let index = Math.min(72, Math.floor(diff / 0.125));
    return color[index];
}

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
                    <li>e.g. <code>C:\\Users\\*Your name*\\AppData\\Local\\osu!\\osu!.exe <input type="text" value="-devserver mamesosu.net" readonly><button onclick="clickCopy()"><i class="fa-solid fa-copy"></i><p class="mouse-over">Click to copy</p></button></code></li>
                    <li>Click "OK" to save the settings.</li>
                    <li>&lpar;If you didn't connect the server, please create a ticket on <a href="/discord"><i class="fa-brands fa-discord"></i></a>&rpar;</li>
                </ul>
            `,
        dans: "Dan Courses",
        danDisc: "Dans are titles that are given to users who have achieved a certain score.",
        danDownload: "All of dans are downloadable from the following links.",
        danList: 
            `
                <ul class="nav">
                    <li><a href="#std-en"><i class="mode-icon mode-std"></i>std</a></li>
                    <li><a href="#taiko-en"><i class="mode-icon mode-taiko"></i>taiko</a></li>
                    <li><a href="#catch-en"><i class="mode-icon mode-ctb"></i>catch</a></li>
                    <li><a href="#mania-en"><i class="mode-icon mode-mania"></i>mania</a></li>
                </ul>
                <ul class="mode">
                    <li id="std-en">
                        <h2>
                            osu! standard
                            <a href="https://mega.nz/file/QKsHlLhS#xZfttKbJQqt-2mvT0uD9sIKGJH4VQKf41zXIU_JW81U" target="_blank" rel="noopener noreferrer">
                                Download std dans
                                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                            </a>
                        </h2>
                        <table>
                            <tr>
                                <th>Map name</th>
                                <th>Level</th>
                                <th>Accuracy</th>
                                <th>Score</th>
                                <th>Mod</th>
                                <th>Miss count</th>
                                <th>Combo</th>
                            </tr>
                            <tr>
                                <td rowspan="10">osu!droid Daninintei Course (Dan Course Team)</td>
                                <td style="color: ${getColor(1)};">1</td>
                                <td rowspan="13">95.00%<span class="plus">+</span></td>
                                <td rowspan="20">0<span class="plus">+</span></td>
                                <td rowspan="20">NM</td>
                                <td rowspan="13">40<span class="minus">-</span></td>
                                <td rowspan="15">0<span class="plus">+</span></td>
                            </tr>
                            <tr><td style="color: ${getColor(2)};">2</td></tr>
                            <tr><td style="color: ${getColor(3)};">3</td></tr>
                            <tr><td style="color: ${getColor(4)};">4</td></tr>
                            <tr><td style="color: ${getColor(5)};">5</td></tr>
                            <tr><td style="color: ${getColor(6)};">6</td></tr>
                            <tr><td style="color: ${getColor(7)};">7</td></tr>
                            <tr><td style="color: ${getColor(8)};">8</td></tr>
                            <tr><td style="color: ${getColor(9)};">9</td></tr>
                            <tr><td style="color: ${getColor(10)};">10</td></tr>
                            <tr>
                                <td rowspan="10">osu! Standard Dan Certification - Overall</td>
                                <td style="color: ${getColor(1)};">1</td>
                            </tr>
                            <tr><td style="color: ${getColor(2)};">2</td></tr>
                            <tr><td style="color: ${getColor(3)};">3</td></tr>
                            <tr>
                                <td style="color: ${getColor(4)};">4</td>
                                <td rowspan="2">97.00%<span class="plus">+</span></td>
                                <td rowspan="2">30<span class="minus">-</span></td>
                            </tr>
                            <tr><td style="color: ${getColor(5)};">5</td></tr>
                            <tr>
                                <td style="color: ${getColor(6)};">6</td>
                                <td rowspan="2">97.50%<span class="plus">+</span></td>
                                <td rowspan="2">25<span class="minus">-</span></td>
                                <td rowspan="2">800<span class="plus">+</span></td>
                            </tr>
                            <tr><td style="color: ${getColor(7)};">7</td></tr>
                            <tr>
                                <td style="color: ${getColor(8)};">8</td>
                                <td rowspan="2">98.00%<span class="plus">+</span></td>
                                <td rowspan="2">15<span class="minus">-</span></td>
                                <td rowspan="2">1,000<span class="plus">+</span></td>
                            </tr>
                            <tr><td style="color: ${getColor(9)};">9</td></tr>
                            <tr>
                                <td style="color: ${getColor(10)};">10</td>
                                <td>98.50%<span class="plus">+</span></td>
                                <td>10<span class="minus">-</span></td>
                                <td>1,200<span class="plus">+</span></td>
                            </tr>
                        </table>
                    </li>
                    <li id="taiko-en">
                        <h2>
                            osu! taiko
                            <a href="https://mega.nz/file/1X1FDDqS#QLP5ZjbH8k1FN4IqYJbH_Agq_onXLd66r8UiYxKUDGw" target="_blank" rel="noopener noreferrer">
                                Download taiko dans
                                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                            </a>
                        </h2>
                        <table>
                            <tr>
                                <th>Map name</th>
                                <th>Level</th>
                                <th>Accuracy</th>
                                <th>Score</th>
                                <th>Mod</th>
                                <th>Miss count</th>
                                <th>Combo</th>
                            </tr>
                            <tr>
                                <td rowspan="18">osu!Taiko Dan-I Dojo</td>
                                <td style="color: ${getColor(1)};">1</td>
                                <td rowspan="30">0.00%<span class="plus">+</span></td>
                                <td rowspan="6">650,000<span class="plus">+</span></td>
                                <td rowspan="30">Score V2</td>
                                <td rowspan="30">0<span class="minus">-</span></td>
                                <td rowspan="30">0<span class="plus">+</span></td>
                            </tr>
                            <tr><td style="color: ${getColor(2)};">2</td></tr>
                            <tr><td style="color: ${getColor(3)};">3</td></tr>
                            <tr><td style="color: ${getColor(4)};">4</td></tr>
                            <tr><td style="color: ${getColor(5)};">5</td></tr>
                            <tr><td style="color: ${getColor(6)};">6</td></tr>
                            <tr>
                                <td style="color: ${getColor(7)};">7</td>
                                <td rowspan="3">700,000<span class="plus">+</span></tr>
                            </tr>
                            <tr><td style="color: ${getColor(8)};">8</td></tr>
                            <tr><td style="color: ${getColor(9)};">9</td></tr>
                            <tr>
                                <td style="color: ${getColor(10)};">10</td>
                                <td rowspan="3">750,000<span class="plus">+</span></tr>
                            </tr>
                            <tr><td style="color: ${getColor(11)}; font-weight: bold;">11</td></tr>
                            <tr><td style="color: ${getColor(12)}; font-weight: bold;">12</td></tr>
                            <tr>
                                <td style="color: ${getColor(13)}; font-weight: bold;">13</td>
                                <td rowspan="6">800,000<span class="plus">+</span></tr>
                            </tr>
                            <tr><td style="color: ${getColor(14)}; font-weight: bold;">14</td></tr>
                            <tr><td style="color: ${getColor(15)}; font-weight: bold;">15</td></tr>
                            <tr><td style="color: ${getColor(16)}; font-weight: bold;">16</td></tr>
                            <tr><td style="color: ${getColor(17)}; font-weight: bold;">17</td></tr>
                            <tr><td style="color: ${getColor(18)}; font-weight: bold;">18</td></tr>
                            <tr>
                                <td rowspan="12">Rise's Taiko Dans</td>
                                <td style="color: ${getColor(1)};">1</td>
                                <td rowspan="5">700,000<span class="plus">+</span></td>
                            </tr>
                            <tr><td style="color: ${getColor(2)};">2</td></tr>
                            <tr><td style="color: ${getColor(3)};">3</td></tr>
                            <tr><td style="color: ${getColor(4)};">4</td></tr>
                            <tr><td style="color: ${getColor(5)};">5</td></tr>
                            <tr>
                                <td style="color: ${getColor(6)};">6</td>
                                <td rowspan="3">750,000<span class="plus">+</span></td>
                            </tr>
                            <tr><td style="color: ${getColor(7)};">7</td></tr>
                            <tr><td style="color: ${getColor(8)};">8</td></tr>
                            <tr>
                                <td style="color: ${getColor(9)};">9</td>
                                <td rowspan="4">800,000<span class="plus">+</span></td>
                            </tr>
                            <tr><td style="color: ${getColor(10)};">10</td></tr>
                            <tr><td class="rainbow">???</td></tr>
                            <tr><td class="rainbow">???</td></tr>
                        </table>
                    </li>
                    <li id="catch-en">
                        <h2>
                            osu! catch
                            <a href="https://mega.nz/file/BS9CQbzK#pjq5WrFbbpap7G0NA2LYNvNFATyZ1dQDRUseSkTdS-g" target="_blank" rel="noopener noreferrer">
                                Download ctb dans
                                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                            </a>
                        </h2>
                        <table>
                            <tr>
                                <th>Map name</th>
                                <th>Level</th>
                                <th>Accuracy</th>
                                <th>Score</th>
                                <th>Mod</th>
                                <th>Miss count</th>
                                <th>Combo</th>
                            </tr>
                            <tr>
                                <td rowspan="19">Dan ~CTB~</td>
                                <td style="color: ${getColor(1)};">1</td>
                                <td rowspan="10">98.00%<span class="plus">+</span></td>
                                <td rowspan="19">0<span class="plus">+</span></td>
                                <td rowspan="19">NM</td>
                                <td rowspan="19">0<span class="minus">-</span></td>
                                <td rowspan="19">0<span class="plus">+</span></td>
                            </tr>
                            <tr style="color: ${getColor(2)};"><td>2</td></tr>
                            <tr style="color: ${getColor(3)};"><td>3</td></tr>
                            <tr style="color: ${getColor(4)};"><td>4</td></tr>
                            <tr style="color: ${getColor(5)};"><td>5</td></tr>
                            <tr style="color: ${getColor(6)};"><td>6</td></tr>
                            <tr style="color: ${getColor(7)};"><td>7</td></tr>
                            <tr style="color: ${getColor(8)};"><td>8</td></tr>
                            <tr style="color: ${getColor(9)};"><td>9</td></tr>
                            <tr style="color: ${getColor(10)};"><td>10</td></tr>
                            <tr>
                                <td style="color: ${getColor(11)}; font-weight: bold;">11</td>
                                <td rowspan="9">99.00%<span class="plus">+</span></td>
                            </tr>
                            <tr><td style="color: ${getColor(12)}; font-weight: bold;">12</td></tr>
                            <tr><td style="color: ${getColor(13)}; font-weight: bold;">13</td></tr>
                            <tr><td style="color: ${getColor(14)}; font-weight: bold;">14</td></tr>
                            <tr><td style="color: ${getColor(15)}; font-weight: bold;">15</td></tr>
                            <tr><td style="color: ${getColor(16)}; font-weight: bold;">16</td></tr>
                            <tr><td style="color: ${getColor(17)}; font-weight: bold;">17</td></tr>
                            <tr><td style="color: ${getColor(18)}; font-weight: bold;">18</td></tr>
                            <tr><td style="color: ${getColor(19)}; font-weight: bold;">19</td></tr>
                        </table>
                    </li>
                    <li id="mania-en">
                        <h2>
                            osu! mania
                            <a href="https://mega.nz/file/BCMihKRK#oifqLN7kbyf1gw_0_QVN7um_-SJKLw-Vb_-r_pRvJ1I" target="_blank" rel="noopener noreferrer">
                                Download mania dans
                                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                            </a>
                        </h2>
                        <table>
                            <tr>
                                <th>Map name</th>
                                <th>Keys</th>
                                <th>Accuracy</th>
                                <th>Score</th>
                                <th>Mod</th>
                                <th>Miss count</th>
                                <th>Combo</th>
                            </tr>
                            <tr>
                                <td>Dan ~REFORM~ v2</td>
                                <td rowspan="5">4</td>
                                <td>96.00%<span class="plus">+</span></td>
                                <td rowspan="15">0<span class="plus">+</span></td>
                                <td>NM</td>
                                <td rowspan="15">0<span class="minus">-</span></td>
                                <td rowspan="15">0<span class="plus">+</span></td>
                            </tr>
                            <tr>
                                <td>4K LN Dan Courses v2</td>
                                <td>97.00%<span class="plus">+</span></td>
                                <td>Score V2</td>
                            </tr>
                            <tr>
                                <td>4K shoegazer dan</td>
                                <td rowspan="5">96.00%<span class="plus">+</span></td>
                                <td rowspan="13">NM</td>
                            </tr>
                            <tr><td>TR1PLE DAN</td></tr>
                            <tr><td>Chordjack Joker Dan</td></tr>
                            <tr>
                                <td>6K Regular Dan Course</td>
                                <td rowspan="3">6</td>
                            </tr>
                            <tr><td>6K Regular Advanced Dan Course</td></tr>
                            <tr>
                                <td>6K LN Dan Course</td>
                                <td>95.00%<span class="plus">+</span></td>
                            </tr>
                            <tr>
                                <td>Regular Dan Phase</td>
                                <td rowspan="4">7</td>
                                <td>96.00%<span class="plus">+</span></td>
                            </tr>
                            <tr>
                                <td>LN Dan Phase</td>
                                <td>95.00%<span class="plus">+</span></td>
                            </tr>
                            <tr>
                                <td>Extra Level (Regular)</td>
                                <td>96.00%<span class="plus">+</span></td>
                            </tr>
                            <tr>
                                <td>Extra Level (LN)</td>
                                <td rowspan="3">95.00%<span class="plus">+</span></td>
                            </tr>
                            <tr>
                                <td>10K BMS Dans Phase</td>
                                <td>10</td>
                            </tr>
                            <tr>
                                <td>Malody 4K Dan Regular</td>
                                <td rowspan="2">4</td>
                            </tr>
                            <tr>
                                <td>Malody 4K Dan Extra</td>
                                <td>96.00%<span class=""plus"">+</span></td>
                            </tr>
                        </table>
                    </li>
                </ul>
            `,
        faqDescription: `If you don't understand, or some problem happened, please read the following, try to solve it`,
        faq: 
        `
            
        `
    },
    jp: {

    }
}
module.exports = contents;