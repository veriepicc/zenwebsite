$(document).on('click', 'div[data-type="custom-select"]', function (e) {
    var select = $(this);
    var dropdown = select.find('.dropdown');
    var selected = $(e.target);
    var input = select.find('input');

    $('div[data-type="custom-select"]').not(select).find('.dropdown').removeClass('show_dropdown');
    $('div[data-type="custom-select"]').not(select).removeClass('on_top');

    if (selected.attr('class') == 'disabled') {
        return false;
    }

    select.toggleClass('on_top');
    dropdown.toggleClass('show_dropdown');

    if (dropdown.hasClass('show_dropdown')) {
        $('.form .submit.create_link').css('z-index', '-99');
    } else {
        $('.form .submit.create_link').css('z-index', 9);
    }

    if (selected.attr('option-value')) {
        input.val(selected.attr('option-value'));

        $('.nicescroll-rails').css('opacity', 0);

        if (!select.find('p:not(.selected_value)').hasClass('move_label')) {
            select.find('p:not(.selected_value)').addClass('move_label');
        }

        if (select.find('p.selected_value').length == 0) {
            setTimeout(function () {
                select.prepend('<p class="selected_value">' + selected.html() + '</p>');
            }, 200);
        } else {
            select.find('p.selected_value').html(selected.html());
        }

        input.attr('js-id', selected.attr('js-id'));

        if (select.closest('.action_inputs').length > 0) {
            document.dispatchEvent(select_change_event);
        } else if (select.closest('.widget_inputs').length > 0) {
            document.dispatchEvent(trigger_widget_select_change);
        } else {
            // Select located inside of verified action
            $('input[name="select_just_changed"]').val(input.attr('verified-action-id'));
            document.dispatchEvent(update_verified_button);
        }
    }

});
