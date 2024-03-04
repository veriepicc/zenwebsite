function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


$(document).ready(function () {
    var cookie = getCookie('gdpr_consent');

    if (!cookie) {
        $('.cookie_banner').addClass('show');
        $('.notification').css('bottom', '50px');
    }
});


$('body').on('click', '.cookie_banner p span', function () {

    if ($(this).hasClass('learn_more')) {
        window.location.href = '/cookies';
        return;
    }

    setCookie('gdpr_consent', 1, 365);
    $('.cookie_banner').removeClass('show');
    $('.notification').css('bottom', '30px');

});
