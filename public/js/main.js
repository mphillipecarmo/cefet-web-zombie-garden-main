// $(function () {
//   $('[data-toggle="tooltip"]').tooltip();
// });
document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el))

document.querySelectorAll('.toast').forEach(el => new bootstrap.Toast(el, { autohide: false, animation: true }).show())
