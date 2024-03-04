$('body').on('click', '.close_mobile_menu', function () {
    var header = $('.mobile_header');

    header.animate({ opacity: 0 }, 300, function () {
        header.css('display', 'none');
    });
});

$('header .inner_header > div i.fa-bars').click(function () {
    var header = $('.mobile_header');
    header.css('display', 'block');
    header.animate({ opacity: 1 }, 300);
});
