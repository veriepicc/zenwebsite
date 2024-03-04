// Process form submission
$('body').on('click', '.create_link', function () {

    $('.create_link').animate({ opacity: 0.5 }, 500).css('pointer-events', 'none');

    // Make AJAX request
    var formData = new FormData(document.getElementById("link"));

    $.ajax({
        type: 'POST',
        url: '/create-link',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {

            if (!isJSON(data)) {
                return false;
            }

            // Is JSON
            data = $.parseJSON(data);

            // Check for error
            if (data.error) {
                return false;
            }

            showLoadingScreen();

            window.location.href = '/' + data.slug;

            // No errors
        },
        error: function (data) {
            console.log(data);
        }
    });
});
