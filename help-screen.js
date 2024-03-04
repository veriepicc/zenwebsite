$('header .inner_header > div i.fa-question-circle').click(function(){
    $('.help_screen').addClass('show_help_screen');
});


$('.help_screen .get_started').click(function(){
    $('.help_screen').removeClass('show_help_screen');
});
