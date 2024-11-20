let loading;
$(window).on("beforeunload", function() {
    loading = false;
    $(".loading-bar").removeClass("extend");
    $(".loading-bar").removeClass("moving");
    $(".loading-bar").addClass("end");
});

$(function() {
    loading = true;
    $("a:not(.an-tab), .anchor").on("click", function(e) {
        e.preventDefault();
        $(".loading-bar").addClass("extend");
        setTimeout(() => {
            $(".loading-bar").addClass("moving");
            window.location.href = $(this).attr("href");
        }, 500);
        setTimeout(() => {
            if (loading) {
                $(".loading").addClass("spin");
            }
        }, 3000);
    });
});