$(function() {
    $("main").on("click", ".pp-record-user .flex-box.vanilla .user", function() {
        $("main .pp-record-user .flex-box.vanilla .user").each(function() {
            $(this).removeClass("focused").removeClass("edge");
        });
        if ($(this).index() > 2) {
            $("main .pp-record-user .flex-box.vanilla .user:first-child").remove();
            $("main .pp-record-user .flex-box.vanilla").append($("main .pp-record-user .flex-box.vanilla .user:first-child").clone());
        }
        else if ($(this).index() < 2) {
            $("main .pp-record-user .flex-box.vanilla .user:last-child").remove();
            $("main .pp-record-user .flex-box.vanilla").prepend($("main .pp-record-user .flex-box.vanilla .user:last-child").clone());
        }
        $("main .pp-record-user .flex-box.vanilla .user:nth-child(3)").addClass("focused");
        $("main .pp-record-user .flex-box.vanilla .user:first-child").addClass("edge");
        $("main .pp-record-user .flex-box.vanilla .user:last-child").addClass("edge");
    });
    $("main").on("click", ".pp-record-user .flex-box.relax .user", function() {
        $("main .pp-record-user .flex-box.relax .user").each(function() {
            $(this).removeClass("focused").removeClass("edge");
        });
        if ($(this).index() > 2) {
            $("main .pp-record-user .flex-box.relax .user:first-child").remove();
            $("main .pp-record-user .flex-box.relax").append($("main .pp-record-user .flex-box.relax .user:nth-child(2)").clone());
        }
        else if ($(this).index() < 2) {
            $("main .pp-record-user .flex-box.relax .user:last-child").remove();
            $("main .pp-record-user .flex-box.relax").prepend($("main .pp-record-user .flex-box.relax .user:nth-child(3)").clone());
        }
        $("main .pp-record-user .flex-box.relax .user:nth-child(3)").addClass("focused");
        $("main .pp-record-user .flex-box.relax .user:first-child").addClass("edge");
        $("main .pp-record-user .flex-box.relax .user:last-child").addClass("edge");
    });

    $("main").on("click", ".pp-record-user .special-switch li", function() {
        $("main .pp-record-user .flex-box").each(function() {
            $(this).removeClass("selected");
        });
        $("main .pp-record-user .special-switch li").each(function() {
            $(this).removeClass("selected");
        });
        switch($(this).index()) {
            case 0:
                $("main .pp-record-user .flex-box.vanilla").addClass("selected");
                $("main .pp-record-user .special-switch .vanilla").addClass("selected");
                break;
            case 1:
                $("main .pp-record-user .flex-box.relax").addClass("selected");
                $("main .pp-record-user .special-switch .relax").addClass("selected");
                break;
            case 2:
                $("main .pp-record-user .flex-box.auto-pilot").addClass("selected");
                $("main .pp-record-user .special-switch .auto-pilot").addClass("selected");
                break;
        }
    });

    const updatePlayers = (type) => {
        const ajax = new XMLHttpRequest();
        ajax.open("GET", `/players?type=${type}`, true);
        ajax.setRequestHeader("Content-Type", "text/plain");
        ajax.onload = () => {
            let value = ajax.responseText;
            value = (Number(value) + 1).toString();
            $(`main .list .player-wrap #players-${type}`).html(value);
        }
        ajax.send(null);
    }
    setInterval(() => {
        updatePlayers("online");
    }, 5000);
    setInterval(() => {
        updatePlayers("total");
    }, 10000)
});