$(window).on("load scroll", function() {
    if ($(window).scrollTop() > 0) {
        $("header").addClass("scroll");
    } else {
        $("header").removeClass("scroll");
    }
});