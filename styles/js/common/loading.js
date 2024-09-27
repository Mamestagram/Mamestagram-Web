$(window).on("beforeunload", function() {
    $(".loading-bar").removeClass("extend");
    $(".loading-bar").removeClass("moving");
    $(".loading-bar").addClass("end");
});

$(function() {
    $("a, .anchor").on("click", function(e) {
        e.preventDefault();
        $(".loading-bar").addClass("extend");
        setTimeout(() => {
            $(".loading-bar").addClass("moving");
            window.location.href = $(this).attr("href");
        }, 500);
        setTimeout(() => {
            $(".loading").addClass("spin");
        }, 3000);
    });
});