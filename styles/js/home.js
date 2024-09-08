$(function() {
    var $ppRecordUser = $("main .pp-record-user .user");
    $ppRecordUser.click(function() {
        var $ppRecordFocused = $("main .pp-record-user .user.focused");
        $ppRecordFocused.removeClass("focused");
        $(this).addClass("focused");
    });
});