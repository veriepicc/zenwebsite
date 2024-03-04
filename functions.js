// Check if URL is valid
function isValidURL(url) {
    var url_validate = /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

    if (!url_validate.test(url)) {
        return false;
    }

    return true;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Write function to check how many stages
function stageCount() {
    var stages = $('.verified_action').length;

    if ($('.action_inputs').find('input[name="action_type[]"]').val().length > 0) {
        stages += 1;
    }

    $('.stage_progress').text('(0/' + stages + ')');
}

// Check preview button spacing
function checkSpacing() {
    var title = $('input[name="title"]');
    var subtitle = $('input[name="subtitle"]');

    if (title.val().length > 0 || subtitle.val().length > 0) {
        $('.preview_buttons').addClass('space_button');
    } else {
        $('.preview_buttons').removeClass('space_button');
    }
}

// Validate an email address
function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Check a single action box
function checkActionBox(box) {
    var action = box.find('input[name="action_type[]"]');
    var link = box.find('input[name="action_link[]"]');
    var errors = false;

    $(link).css('border-bottom-color', 'white');
    box.find('.one_select').css('border-bottom-color', 'white');

    if (action.val().length == 0) {
        box.find('.one_select').css('border-bottom-color', 'red');
        errors = true;
    }

    if (link.val().length == 0 || isValidURL(link.val()) == 0) {
        link.css('border-bottom-color', 'red');
        errors = true;
    }

    if (errors) {
        return false;
    }

    return true;
}

// Open a link in a new tab
function openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
}

// Click to copy to clipboard
function copyToClipboard(text) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
}

// Dynamically create nicescroll
var setScroll = function (i) {
    if ($(i).length > 0)
        $(i).niceScroll().updateScrollBar();
}

// Trigger confetti
function triggerConfetti() {
    window.initBurst();
    render();
}

// Show the loading screen
function showLoadingScreen() {
    $('.loading_screen').css('display', 'table').animate({ opacity: 1 }, 500);
}

// Hide the loading screen
function hideLoadingScreen() {
    $('.loading_screen').animate({ opacity: 0 }, 500, function () {
        $('.loading_screen').css('display', 'none');
    });
}

// Add action to list
function addAction() {
    var container = $('.action_inputs');

    var action = container.find('input[name="action_type[]"]');
    var link = container.find('input[name="action_link[]"]');

    var action_id = action.attr('js-id');

    var action_data = window.actions[action_id];

    var id = 'dd_' + Math.floor(Math.random() * 100);

    var dropdown_items = '';

    $.each(window.actions, function (key, value) {
        dropdown_items += '<li js-id="' + value.id + '" option-value="' + value.action_value + '"><i class="' + value.icon + '"></i> ' + value.action_text + '</li>';
    });

    var v_id = $('.verified_action').length;


    var template = `
        <div class="verified_action" verified-action-id="` + $('.preview_button').length + `">
            <div class="head">
                <h1> <i class="` + action_data.icon + `"></i> ` + action_data.button_instruction + `</h1>

                <div class="actions">
                    <i class="fa fa-trash delete_action"></i>
                    <i class="fas fa-caret-down arrow"></i>
                </div>
            </div>

            <div class="body">
                <div class="one_action">
                    <div class="dual_inputs">
                        <div class="group no_margin_bottom">
                            <div class="one_select" data-type="custom-select">
                                <p class="selected_value"><i class="` + action_data.icon + `"></i> ` + action_data.action_text + `</p>
                                <input type="text" name="action_type[]" js-id="` + (action_data.id - 1) + `" verified-action-id="` + $('.preview_button').length + `" value="` + action_data.action_value + `">
                                <div class="select">
                                    <p class="move_label">Select an action</p>

                                    <i class="fas fa-caret-down arrow"></i>

                                    <div class="dropdown">
                                        <div class="inner_dropdown" id="` + id + `">
                                            ` + dropdown_items + `
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="group no_margin_bottom">
                            <input type="text" name="action_link[]" required  autocomplete="off" value="` + link.val() + `">
                            <span class="highlight"></span>
                            <span class="bar"></span>
                            <label class="with_icon label action_link_label">` + action_data.action_label + `</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('.verified_actions').append(template);

    resetSelect();
    stageCount();

    setScroll("#" + id);

}

// Check if varaible is JSON
function isJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }

    return true;
}

// Reset fields after action is added
function resetSelect() {
    var select = $('.action_inputs').find('.one_select');

    select.find('.selected_value').remove();
    select.find('.move_label').removeClass('move_label');

    $('.action_inputs').find('input[name="action_type[]"]').val('');

    $('.action_inputs').find('input[name="action_link[]"]').val('');
}

// Check if submit button can be revealed
function checkFormValidity() {
    var verified_actions = $('.verified_action');

    if ($('.create_form').length == 0) return;

    var action = $('.action_inputs input[name="action_type[]"]');
    var link = $('.action_inputs input[name="action_link[]"]');
    var destination = $('input[name="destination"]');

    if (action.val().length == 0 || link.val().length == 0 || isValidURL(link.val()) == 0) {
        var preloaded_action = false;
    } else {
        var preloaded_action = true;
    }

    if (verified_actions.length == 0 && preloaded_action == false) {
        $('.create_link').css('pointer-events', 'none').css('opacity', 0.6);
        return false;
    }

    verified_actions.each(function () {
        if (checkActionBox($(this)) == false && preloaded_action == false) {
            $('.create_link').css('pointer-events', 'none').css('opacity', 0.6);
            return false;
        }
    });

    if (isValidURL(destination.val()) == 0) {
        $('.create_link').css('pointer-events', 'none').css('opacity', 0.6);
        return false;
    }

    if (validUrl == false) {
        $('.create_link').css('pointer-events', 'none').css('opacity', 0.6);
        return false;
    }

    if (!widgetIsOkay()) {
        $('.create_link').css('pointer-events', 'none').css('opacity', 0.6);
        return false;
    }

    $('.create_link').css('pointer-events', 'all').css('opacity', 1);

}

// Check if submit button can be revealed on edit form
function checkEditFormValidity() {
    var destination = $('input[name="destination"]');

    if (isValidURL(destination.val()) == 0) {
        $('.create_link').css('pointer-events', 'none').css('opacity', 0.6);
        return false;
    }

    $('.create_link').css('pointer-events', 'all').css('opacity', 1);
}

function openDeleteUnlockPopup() {
    var popup = $('.popup[name="delete-unlock"]');

    popup.not(popup).css('pointer-events', 'none').css('opacity', 1);
    popup.css('pointer-events', 'all');
    popup.animate({ opacity: 1 }, 150);
}

function openEditUnlockPopup(id, data) {
    var popup = $('.popup[name="edit-unlock"]');
    var title = popup.find('input[name="title"]');
    var subtitle = popup.find('input[name="subtitle"]');
    var destination = popup.find('input[name="destination"]');

    var id = $('input[name="unlock_id"]');

    id.val(data.id);
    title.val(data.title);
    subtitle.val(data.subtitle);
    destination.val(data.destination);

    popup.css('pointer-events', 'all');
    popup.animate({ opacity: 1 }, 150);
    popup.find('.container').removeClass('preload');
}


function openShareUnlockPopup(url) {
    var popup = $('.popup[name="share-unlock"]');

    var facebookShareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
    var twitterShareUrl = 'https://twitter.com/intent/tweet?text=' + url;

    popup.find('#facebook').attr('href', facebookShareUrl);
    popup.find('#twitter').attr('href', twitterShareUrl);

    popup.css('pointer-events', 'all');
    popup.animate({ opacity: 1 }, 150);
    popup.find('.container').removeClass('preload');
}

function closeUnlockPopup(form, id = null, data = null) {
    var popup = $('.popup[name="' + form + '"]');
    var unlock = $('.one_link[unlock-id="' + id + '"]');

    if (data != null) {
        unlock.find('.title truncate').text(data.title ?? 'Untitled Unlock #' + data.id);
    }

    popup.css('pointer-events', 'none');
    popup.animate({ opacity: 0 }, 150);

    if (form == 'edit-form') {
        popup.find('.container').addClass('preload');
    }

    $('.edit_link').css('pointer-events', 'all').css('opacity', 1);
}

function closeDeleteUnlockPopup() {
    closeUnlockPopup('edit-unlock');
    closeUnlockPopup('delete-unlock');
}

function intlFormat(num) {
    return new Intl.NumberFormat().format(Math.round(num * 10) / 10);
}

function makeFriendly(num) {
    if (num >= 1000000)
        return intlFormat(num / 1000000) + 'm';
    if (num >= 10000)
        return intlFormat(num / 1000) + 'k';
    return intlFormat(num);
}
