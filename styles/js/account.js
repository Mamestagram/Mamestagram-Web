function onSubmit(token) {
    document.getElementById("post").value = token;
    document.getElementById("register").submit();
}

const emptyString = (str) => {
    return str.length <= 0 || str === null;
}

const validString = (str) => {
    const regex = {
        sbChar: /[a-zA-Z0-9]/g, //a - z, A - Z, 0 - 9
        dbChar: /[\uFF41-\uFF5A\uFF21-\uFF3A\uFF10-\uFF19]/g, //ａ - ｚ, Ａ - Ｚ, ０ - ９
        roundNum: /[\u2460-\u2473\u3251-\u32BF\u32D0-\u32FE]/g, //① - ⑳, ㉑ - ㉟, ㊱ - ㊿
        greekChar: /[\u03B1-\u03C9\u0391-\u03A9]/g, // α - ω, Α - Ω
        jpnChar: /[\u3040-\u30FF\uFF61-\uFF9F\u4E00-\u9FFF々]/g, // 日本語
        korChar: /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/g, // 韓国語
        chnChar: /[\u4E00-\u9FFF\u3400-\u4DBF]/g, // 中国語
        rusChar: /[\u0410-\u044F]/g, // ロシア語
        blank: /[\u0020\u3000]/g, // 半角スペース, 全角スペース
        symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?§~／＼？！、。：；「」＠”＃＄％＆’（）＝＾～￥｜※]/g, // 記号
    };
    let invalidText = str;
    Object.values(regex).map((item) => item).forEach((reg) => {
        invalidText = invalidText.replace(reg, "");
    });
    return str.length <= 0 || (/^\S.*\S$|^\S$/.test(str) && invalidText.length <= 0);
}

const validEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.length <= 0 || regex.test(email);
}

const validPassword = (password) => {
    const regex = /(?=.*[a-zA-Z])(?=.*[0-9])/;
    return password.length <= 0 || regex.test(password);
}

function checkRegister(firstCheck) {
    const username = $("main #register .username input").val(), email = $("main #register .email input").val(), password = $("main #register .password input").val(), confirm = $("main #register .confirm input").val();
    let errLi = { username: null, email: null, password: null, confirm: null }, isError = false;
    // 空チェック
    isError = emptyString(username) || emptyString(email) || emptyString(password) || emptyString(confirm);
    // ユーザー名チェック
    if (username.length > 16) { // 文字数 : 16文字以下
        errLi.username = "Too long characters";
        isError = true;
    }
    else if (!validString(username)) { // 使用文字 : 特殊な文字以外
        errLi.username = "Invalid string";
        isError = true;
    }
    // メールアドレスチェック
    if (!validString(email)) { // 使用文字 : 特殊な文字以外
        errLi.email = "Invalid string";
        isError = true;
    }
    else if (!validEmail(email)) { // フォーマット
        errLi.email = "Invalid e-mail format";
        isError = true;
    }
    // パスワードチェック
    if (!password <= 0 && password.length < 8) { // 文字数 : 8文字以上
        errLi.password = "Too short characters";
        isError = true;
    }
    else if (!validString(password)) { // 使用文字 : 特殊な文字以外
        errLi.password = "Invalid string";
        isError = true;
    }
    else if (!validPassword(password)) { // 必須文字 : アルファベット&数字
        errLi.password = "Use alphabet and number";
        isError = true;
    }
    // 確認パスワードチェック
    if (password !== confirm) { // 一致
        errLi.confirm = "Doesn't match";
        isError = true;
    }
    
    if (isError) {
        $("main #register button").attr("class", "unavailable").prop("disabled", true);
        if (firstCheck) {
            if (errLi.username !== null) {
                $("main #register .username .error").html(errLi.username);
            }
            if (errLi.email !== null) {
                $("main #register .email .error").html(errLi.email);
            }
            if (errLi.password !== null) {
                $("main #register .password .error").html(errLi.password);
            }
        }
        else {
            $("main #register .username .error").html(errLi.username);
            $("main #register .email .error").html(errLi.email);
            $("main #register .password .error").html(errLi.password);
            $("main #register .confirm .error").html(errLi.confirm);
        }
    }
    else {
        $("main #register button").removeAttr("class").prop("disabled", false);
        $("main #register div .error").html(null);
    }
}

function checkSignIn(firstCheck) {
    const username = $("main #signin .username input").val(), password = $("main #signin .password input").val();
    let errLi = { username: null, password: null }, isError = false;
    // 空チェック
    isError = emptyString(username) || emptyString(password);
    // 使用文字チェック
    // ユーザー名
    if (!validString(username)) { // 特殊な文字以外
        errLi.username = "Invalid string";
        isError = true;
    }
    // パスワード
    if (!validString(password)) { // 特殊な文字以外
        errLi.password = "Invalid string";
        isError = true;
    }

    if (isError) {
        $("main #signin button").attr("class", "unavailable").prop("disabled", true);
        if (firstCheck) {
            if (errLi.username !== null) {
                $("main #signin .username .error").html(errLi.username);
            }
            else if (errLi.password !== null) {
                $("main #signin .password .error").html(errLi.password);
            }
        }
        else {
            $("main #signin .username .error").html(errLi.username);
            $("main #signin .password .error").html(errLi.password);
        }
    }
    else {
        $("main #signin button").removeAttr("class").prop("disabled", false);
        $("main #signin div .error").html(null);
    }
}

$(function() {
    $(".grecaptcha-badge").hide();
    $("main .box form.face").addClass("move");
    checkRegister(true);
    checkSignIn(true);

    $("main").on("click", "form .password span i", function() {
        if ($("form .password input").attr("type") === "password") {
            $(this).addClass("show-pass");
            $("form .password input").attr("type", "text");
        }
        else {
            $(this).removeClass("show-pass");
            $("form .password input").attr("type", "password");
        }
    });
    $("main").on("click", "#register .confirm span i", function() {
        if ($("#register .confirm input").attr("type") === "password") {
            $(this).addClass("show-pass");
            $("#register .confirm input").attr("type", "text");
        }
        else {
            $(this).removeClass("show-pass");
            $("#register .confirm input").attr("type", "password");
        }
    });

    $("header, main").on("click", ".link-menu .register, .link-menu .signin, .box form .reference a", function() {
        $("main .box form.face").removeClass("error").removeClass("move");
    });
});