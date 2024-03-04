// Make dropdown scrollbars nice
$(document).ready(function () {
    stageCount();
    $(".inner_dropdown").niceScroll({
        cursorcolor: 'var(--highlight)'
    });
});

$('*').on('keyup paste click', function () {
    checkFormValidity();
});

// Fix dropdown overflow issue
$("body").on('mouseover', '.inner_dropdown', function () {
    $(".inner_dropdown").getNiceScroll().resize();
});

// Update preview box on type
$('input[name="title"]').on('keyup', function () {
    var text = $(this).val();

    if (text.length == 0) {
        $('.preview h1').css('display', 'none');
    } else {
        $('.preview h1').text(text).css('display', 'block');
    }

    checkSpacing();
});

$('input[name="subtitle"]').on('keyup', function () {
    var text = $(this).val();

    if (text.length == 0) {
        $('.preview h2').css('display', 'none');
    } else {
        $('.preview h2').text(text).css('display', 'block');
    }

    checkSpacing();
});

// Create event listeners to update preview button
document.addEventListener("change-button", function (e) {
    var id = parseInt($('input[name="action_type[]"]').last().attr('js-id'));

    if (typeof id != 'number') return false;

    // Get the action from actions object
    var this_action = window.actions[id];

    var actions = $('.verified_action').length;
    var buttons = $('.preview_button').length;

    if (actions == buttons) {
        // Create button
        var button_id = 'button_' + Math.floor(Math.random() * 100);
        var element = $('#' + button_id);

        $('.preview_buttons').append('<a id="' + button_id + '" verified-action-id="' + (buttons + 1) + '" class="preview_button" style="background-color: ' + this_action.button_color + '"><i class="' + this_action.icon + '"></i> ' + this_action.button_instruction + '</a>');
    } else {
        var element = $('.preview_buttons .preview_button').last();
    }

    // Update the label
    $('.action_inputs').find('.action_link_label').text(this_action.action_label);

    // Update the preview window
    element
        .css('background-color', this_action.button_color)
        .html('<i class="' + this_action.icon + '"></i> ' + this_action.button_instruction);

    stageCount();
});



// Create event listeners to update preview button
document.addEventListener("update-verified-button", function (e) {

    var v_id = parseInt($('input[name="select_just_changed"]').val());
    var js_id = parseInt($('input[verified-action-id="' + v_id + '"]').attr('js-id'));

    if (typeof js_id != 'number' || typeof v_id != 'number') {
        return false;
    }

    if (typeof window.actions[js_id - 1] !== 'undefined') {
        // Get the action from actions object
        var this_action = window.actions[js_id - 1];
        var button = $('.preview_button[verified-action-id="' + v_id + '"]');

        // Update the label
        $('.verified_action[verified-action-id="' + v_id + '"]').find('.action_link_label').text(this_action.action_label);

        button
            .css('background-color', this_action.button_color)
            .html('<i class="' + this_action.icon + '"></i> ' + this_action.button_instruction);

        $('.verified_action[verified-action-id="' + v_id + '"]').find('.head h1').html('<i class="' + this_action.icon + '"></i> ' + this_action.button_instruction);
    }
});


// Create the change-button event
var select_change_event = new CustomEvent("change-button");
var update_verified_button = new CustomEvent("update-verified-button");


$('.add_action').click(function () {
    var last_action_box = $('.one_action').last();

    if (!checkActionBox(last_action_box)) {
        // Errors on action box
        return false;
    }

    addAction();

});


$('body').on('click', '.verified_action .head', function () {
    var body = $(this).closest('.verified_action').find('.body');

    $('.verified_action .body').not(body).removeClass('show_body');

    body.toggleClass('show_body');
});


$('body').on('click', '.delete_action', function () {
    var action = $(this).closest('.verified_action');
    var v_id = action.attr('verified-action-id');

    action.remove();
    $('.preview_button[verified-action-id="' + v_id + '"]').remove();

    stageCount();
});

$('body').on('click', '.additional_options .heading', function () {
    $('.additional_section').toggleClass('show_additional');
});

var typingTimer;                //timer identifier
var doneTypingInterval = 1000;  //time in ms (5 seconds)
var validUrl = true;
$('body').on('keyup', 'input[name="url"]', function () {
    var field = $(this);
    var value = field.val();
    var message = $('p.url');
    validUrl = false;

    console.log('triggering');

    clearTimeout(typingTimer);

    if (value) typingTimer = setTimeout(assureUrlIsUnique, doneTypingInterval);

    message.text('Checking url is allowed...');

    field.css('border-bottom-color', 'var(--white)');

    var not_allowed = [
        '?',
        '.',
        ' ',
        '/',
        '\\',
        ',',
        '%',
        '(',
        ')',
        '`',
        '{',
        '}'
    ];

    if (not_allowed.some(v => value.includes(v))) {
        message.text('Your url contains an invalid character');
        field.css('border-bottom-color', 'red');
        return;
    }

    if (value.length == 0) {
        message.text('Start typing above to see your link');
        validUrl = true;
        checkFormValidity();
    }

    if (value.length > 20) {
        message.text('Custom urls can\'t be >20 characters');
        validUrl = true;
        checkFormValidity();
    }
});

function assureUrlIsUnique() {
    var url = $('input[name="url"]').val();
    var csrf = $('input[name="_token"]').val();
    var message = $('p.url');
    var field = $('input[name="url"]');

    $.post('/check-custom-url', {
        url: url,
        _token: csrf
    }, function (data) {
        if (data) {
            // link is allowed
            validUrl = true;
            checkFormValidity();
            message.text('social-unlock.com/' + url);
            field.css('border-bottom-color', 'var(--white)');
            return;
        }

        // not allowed
        message.text('This custom url has been used before');
        field.css('border-bottom-color', 'red');
    });
}


$('body').on('change', 'input[name="theme"]', function () {
    var id = $(this).closest('label').attr('iteration');
    var theme = window.themes[id - 1];

    $('.themes label').removeClass('circle');
    $(this).closest('label').addClass('circle');

    $('body').append(`
        <style>
            :root{
                --highlight: rgb(${theme.ball_color});
            }
        </style>
    `);

    loadBackground([theme.left_color, theme.center_color, theme.right_color, theme.ball_color], theme.has_balls);
});
