$(function() {
    $("footer").hover(
        function() {
            $(this).addClass("hovered");
            $("html, body").animate({
                scrollTop: $(window).scrollTop() + 500
            }, 500);
        },
        function() {
            $(this).removeClass("hovered");
            $("html, body").animate({
                scrollTop: $("footer").offset().top + $("footer").height() - $(window).height()
            }, 500);
        }
    )
});