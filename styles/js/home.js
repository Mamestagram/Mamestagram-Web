$(function() {
    $("main .pp-record-user .focused-user-score-data").html($("main .pp-record-user .flex-box.selected .focused .score-data").clone());
    $("main").on("click", ".pp-record-user .flex-box.vanilla .user", function() {
        if (!$("main .pp-record-user .flex-box.vanilla .user:nth-child(3)").hasClass("space")) {
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
            $("main .pp-record-user .focused-user-score-data").html($("main .pp-record-user .flex-box.selected .focused .score-data").clone());
        }
    });
    $("main").on("click", ".pp-record-user .flex-box.relax .user", function() {
        if (!$("main .pp-record-user .flex-box.relax .user:nth-child(3)").hasClass("space")) {
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
            $("main .pp-record-user .focused-user-score-data").html($("main .pp-record-user .flex-box.selected .focused .score-data").clone());
        }
    });

    $("main").on("click", ".pp-record-user .flex-box.selected .focused", function() {
        if (!$(this).hasClass("details")) {
            $(this).removeClass("anim-end").addClass("details");
            $(this).parent().addClass("details");
            $(".pp-record-user .special-switch").addClass("details");
        }
        if (!$("main .pp-record-user .flex-box.selected .user:nth-child(3)").hasClass("space")) {
            $("main .pp-record-user .flex-box.selected .user:nth-child(2)").after($(this).clone());
            $("main .pp-record-user .flex-box.selected .user:nth-child(3)").removeClass("details").addClass("space");
        }
    });

    $("main").on("animationend", ".pp-record-user .flex-box.selected .details", function() {
        $(this).addClass("anim-end");
    });

    $("body").click(function(e) {
        if (!$(e.target).closest("main .pp-record-user .flex-box.selected .focused").length) {
            $("main .pp-record-user .flex-box.selected .details").removeClass("anim-end");
            $("main .pp-record-user .flex-box.selected .focused").removeClass("details");
            $("main .pp-record-user .flex-box.selected").removeClass("details");
            $("main .pp-record-user .special-switch").removeClass("details");
        }
    });

    $("main").on("animationend", ".pp-record-user .flex-box.selected .focused", function() {
        $(this).addClass("anim-end");
        if (!$("main .pp-record-user .flex-box.selected .user:nth-child(4)").hasClass("details")) {
            $("main .pp-record-user .flex-box.selected .user:nth-child(3)").remove();
        }
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
                $("main .pp-record-user .focused-user").html($("main .pp-record-user .flex-box.vanilla .focused").clone());
                break;
            case 1:
                $("main .pp-record-user .flex-box.relax").addClass("selected");
                $("main .pp-record-user .special-switch .relax").addClass("selected");
                $("main .pp-record-user .focused-user").html($("main .pp-record-user .flex-box.relax .focused").clone());
                break;
            case 2:
                $("main .pp-record-user .flex-box.auto-pilot").addClass("selected");
                $("main .pp-record-user .special-switch .auto-pilot").addClass("selected");
                $("main .pp-record-user .focused-user").html($("main .pp-record-user .flex-box.auto-pilot .focused").clone());
                break;
        }
        $("main .pp-record-user .focused-user-score-data").html($("main .pp-record-user .flex-box.selected .focused .score-data").clone());
    });

    const updatePlayers = (type) => {
        const ajax = new XMLHttpRequest();
        ajax.open("GET", `/players?type=${type}`, true);
        ajax.setRequestHeader("Content-Type", "text/plain");
        ajax.onload = () => {
            $(`main .list .player-wrap #players-${type}`).html(ajax.responseText);
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