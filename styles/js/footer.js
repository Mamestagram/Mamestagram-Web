$(function() {
    $("footer").hover(
        function() {
            $(this).addClass("hovered");
            $("html, body").stop().animate({
                scrollTop: $(window).scrollTop() + 500
            }, 500);
        },
        function() {
            $(this).removeClass("hovered");
            $("html, body").stop().animate({
                scrollTop: $("footer").offset().top + $("footer").height() - $(window).height()
            }, 500);
        }
    )
});