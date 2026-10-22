/**
 * Disable double-submit on confirm (same pattern as cheque module).
 */
$(document).ready(function () {
    $(document).on('click', '.confirm_order', function (e) {
        e.preventDefault();
        $(this).attr('disabled', 'disabled');
        $(this).closest('form').get(0).submit();
    });
});
