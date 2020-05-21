window.onload = function init() {
    document.querySelector('#model_notebook').value = localStorage.getItem('model');
    document.querySelector('#email').value = localStorage.getItem('email');
    document.querySelector('#comment').value = localStorage.getItem('comment');


    document.querySelector('.btn_black').onclick = function () {
        var input_model = document.querySelector('#model_notebook').value;
        var input_email = document.querySelector('#email').value;
        var input_comment = document.querySelector('#comment').value;

        if (input_model.length != 0 && input_email.length != 0) {
            localStorage.setItem('model', input_model);
            localStorage.setItem('email', input_email);
            localStorage.setItem('comment', input_comment);
        }
    }

    setTimeout(function () {
        localStorage.clear();
     }, 24 * 60 * 60 * 1000);
};