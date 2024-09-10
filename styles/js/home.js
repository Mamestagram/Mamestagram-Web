$(function() {
    $("main").on("click", ".pp-record-user .flex-box .user", function() {
        $("main .pp-record-user .flex-box .user").each(function() {
            $(this).removeClass("focused").removeClass("edge");
        });
        if ($(this).index() > 2) {
            $("main .pp-record-user .flex-box .user:first-child").remove();
            $("main .pp-record-user .flex-box").append($("main .pp-record-user .flex-box .user:first-child").clone());
        }
        else if ($(this).index() < 2) {
            $("main .pp-record-user .flex-box .user:last-child").remove();
            $("main .pp-record-user .flex-box").prepend($("main .pp-record-user .flex-box .user:last-child").clone());
        }
        $("main .pp-record-user .flex-box .user:nth-child(3)").addClass("focused");
        $("main .pp-record-user .flex-box .user:first-child").addClass("edge");
        $("main .pp-record-user .flex-box .user:last-child").addClass("edge");
    });
});