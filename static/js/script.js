jQuery(document).ready(function () {
    var email;
    var comment;
    var model_notebook;

    model_notebook = localStorage.getItem('model');

    if (model_notebook != null) {
        $('.label-model').addClass('model_full');
        $('#form_icons').addClass('check');
    }

    email = localStorage.getItem('email');
    if (email != null) {
        $('.label-email').addClass('email_full');
        $('#email').addClass('checking');
    }

    comment = localStorage.getItem('comment');
    if (comment != null) {
        $('.label-comment').addClass('comment_full');
    }

    if (model_notebook != null && email != null && comment != null) {
        check_btn();
    }
    $('.wert').click(function () {
        if ($('.wert').hasClass('question')) {
            $('.form-tooltip').toggle();
        }
        if ($(window).width() < 768) {
            $('.overlay').css('display', 'block');
        }
    });

    $('#model_notebook').on('keyup', function () {
        var data = $('#model_notebook').val();

        if (data.length > 1) {
            $('#form_icons').addClass('check');
            $('#form_icons').removeClass('question');
            check_btn();
        } else {
            $('#form_icons').addClass('question');
            $('#form_icons').removeClass('check');
            check_btn();
        }
    });

    var action = $('.important_form').attr('action');
    $("#model_notebook").autocomplete({
        serviceUrl: action,
        minChars: 3,
        noSuggestionNotice: "Ничего не найдено"
    });


    $(document).on('mousedown', '.autocomplete-suggestion', e => {
        $(e.target).click();
    });

    // запрет на ввод пробела в поле email
    $('#email').on('input', function () {
        $(this).val($(this).val().replace(/ /, ''))
    });


    //валидация
    $('#email').blur(function () {

        var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,6}\.)?[a-z]{2,6}$/i;

        if ($(this).val() && !pattern.test($(this).val())) {
            $('.hint').css('opacity', '1');
            $('#email').css({
                'background': '#F2F2F2',
                'border': '1px solid #EB5757',
                'padding': '40px 0 19px 16px'
            });
            $('#email').addClass('mark');
            $('#email').removeClass('checking');
            check_btn();
        } else {
            $('.hint').css('opacity', '0');
            $('#email').css({
                'background': '#F2F2F2',
                'border': '1px solid #E0E0E0'
            });
            $('#email').addClass('checking');
            $('#email').removeClass('mark');
            check_btn();
        }
        email = $('#email').val();

        if (email == 0) {
            $('#email').removeClass('checking');
            $('#email').removeClass('mark');
            check_btn();
            $('.label-email').removeClass('email_full');
        }
    });

    // движение label
    $('#comment').blur(function () {
        var comment = $('#comment').val();

        if (comment == 0) {
            $('.label-comment').removeClass('comment_full');
        }
    });

    $('#comment').on('focus', function () {
        $('.label-comment').addClass('comment_full');
    });

    $('#model_notebook').blur(function () {
        var model = $('#model_notebook').val();

        if (model == 0) {
            $('.label-model').removeClass('model_full');
        }
    });

    $('#model_notebook').on('focus', function () {
        $('.label-model').addClass('model_full');
    });

    // смена кнопки
    function check_btn() {
        if ($('#form_icons').hasClass('check') && $('#email').hasClass('checking')) {
            $('.btn_black').addClass('green');
        } else {
            $('.btn_black').removeClass('green');
        }
    }

    $('.btn_black').click(function () {
        if ($('.btn_black').hasClass('green')) {
            $.ajax({
                url: "/orders/create",
                method: "POST",
                data: {
                    csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
                    modification: $('#model_notebook').val(),
                    comment: $('#comment').val(),
                    amount: parseFloat($('.price').text()),
                    email: $('#email').val()
                }
            }).done(function (result) {
                var id = result.id;
                var amount = result.amount;
                $('input[name="formcomment"]').val('Оплата заказа №' + id);
                $('input[name="short-dest"]').val('https://upgrade-laptop.com/');
                $('input[name="label"]').val(id);
                $('input[name="targets"]').val('Заказ №' + id);
                $('input[name="sum"]').val(amount);
                $('input[name="comment"]').val($('#comment').val());
                $('input[name="successURL"]').val("https://upgrade-laptop.com/thanks/?order=" + id);
                $('#yandex-form').submit();
            });
        }
    });

    $(document).mouseup(function (e) {
        var div = $('.form-tooltip'); // тут указываем элемент
        if (!div.is(e.target) // если клик был не по нашему блоку
            &&
            div.has(e.target).length === 0) { // и не по его дочерним элементам
            $('.form-tooltip').css('display', 'none');
            $('.overlay').css('display', 'none');
        }
    });

    $('.form-tooltip_title').click(function () {
        $('.form-tooltip').css('display', 'none');
        $('.overlay').css('display', 'none');
    });
    //поменять name при фокусе, чтобы не было автозаполнения
    $('#email').on('focus', function () {
        $('.label-email').addClass('email_full');

        var realFields = [];
        var realFieldsMapper = {};
        $(this).each(function (i) {
            realFields[i] = $(this).attr('name');
            if (realFieldsMapper[realFields[i]]) {
                $(this).attr('name', realFieldsMapper[realFields[i]]);
            } else {
                var randomName = Math.random().toString(36).replace(/[^a-z]+/g, '');
                $(this).attr('name', randomName);
                realFieldsMapper[realFields[i]] = randomName;
            }
        });
    });
});