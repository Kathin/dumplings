document.documentElement.classList.add(isMobile.any ? 'mobile' : 'no-mobile');
jQuery(document).ready(function($) {
    (function () {
      document.documentElement.className = document.documentElement.className.replace('no-js', '')

      // First, let's merge real config with default values...

      let defaults = {
        path: '',
        modal: ''
      }

      if (!window.ENV) {
        window.ENV = defaults
      }
    })()
    /*Плавная прокрутка*/
    $('a[href^="#"]').on('click', function(e) {
        //e.preventDefault();
        var a = $(this),
            hash = a.attr('href'),
            target = $('[id="' + hash.substr(1) + '"]')

        $('html:not(:animated), body:not(:animated)').animate({
            scrollTop: target.offset().top
        }, 500, function() {
            window.location.hash = hash;
        });
    });
    /*Табы*/
    $(".using__tabs-titles").on(
        "click",
        ".using__tabs-titles-item:not(.active)",
        function() {
            $(this)
                .addClass("active")
                .siblings()
                .removeClass("active")
                .closest(".using__tabs")
                .find(".using__tabs-content-item")
                .removeClass("active")
                .eq($(this).index())
                .addClass("active");
        }
    );
    $(".prices__tabs-titles").on(
        "click",
        ".prices__tabs-titles-item:not(.active)",
        function() {
            $(this)
                .addClass("active")
                .siblings()
                .removeClass("active")
                .closest(".prices__tabs")
                .find(".prices__tabs-content-item")
                .removeClass("active")
                .eq($(this).index())
                .addClass("active");
        }
    );
    /*Динамика placeholder в форме*/
    $(function() {
        $("input, textarea").each(function() {
            if ($(this).val().length > 0)
                $(this)
                .parent(".input")
                .find(".input__placeholder")
                .addClass("hidden");
            else
                $(this)
                .parent(".input")
                .find(".input__placeholder")
                .removeClass("hidden");
            $(this).on("click", function(e) {
                if ($(this).val().length > 0)
                    $(this)
                    .parent(".input")
                    .removeClass(" -error")
                    .find(".input__placeholder")
                    .addClass("hidden");
                else
                    $(this)
                    .parent(".input")
                    .find(".input__placeholder")
                    .removeClass("hidden");
            });
            $(".input__placeholder").on("click", function(e) {
                $(this)
                    .parent(".input")
                    .find("input, textarea")
                    .focus()
                    .parent(".input")
                    .removeClass(" -error");
            });
            $(this).focusout(function(e) {
                if (
                    $(this).val().length > 0 &&
                    $(this).val() !== "+7 (___) ___ __ __"
                ) {
                    $(this)
                        .parent(".input")
                        .find(".input__placeholder")
                        .addClass("hidden")
                        .parent(".input")
                        .removeClass(" -error");
                    if (
                        $(this)
                        .parents(".form__field")
                        .hasClass("-step2")
                    ) {
                        $(this)
                            .parent(".input")
                            .find(".input__placeholder")
                            .css("opacity", "0");
                    }
                } else
                    $(this)
                    .parent(".input")
                    .find(".input__placeholder")
                    .removeClass("hidden")
            });
            $(this).focusin(function(e) {
                $(this)
                    .parent(".input")
                    .removeClass(" -error");
            });
        });
    });
    /*форма регистрации на главной дизактивация*/
    $(function() {
        $("input[name='conditions']").each(function() {
            if ($(this).is(":checked"))
              $(this).parents("form").find(".summary__form-button").removeClass("-disable")  
            else
              $(this).parents("form").find(".summary__form-button").addClass("-disable") 
              
            $(this).on("click", function(e) {
                if ($(this).is(":checked"))
                  $(this).parents("form").find(".summary__form-button").removeClass("-disable")  
                else
                  $(this).parents("form").find(".summary__form-button").addClass("-disable") 
            })
        })
    })
    /*подписка*/
    $(".preview__form form").on("submit", function(e) {
        e.preventDefault();
        var src = $(this).attr("action");
        var serialize = $(this).serialize();
        var data_field = $(this).serializeArray();
        var form = $(this);
        var type = $(this).data("type");
        var fields = {
            email: ""
        };

        var require = ["name", "email"];
        var errors = [];
        var message = "Поле является обязательным для заполнения";
        var expr = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        for (var field in fields) {
            var val = $(form)
                .find("[name='" + field + "']")
                .val();
            fields[field] = $.trim(val);
            if (fields[field] == "" && require.indexOf(field) != -1) {
                errors.push(message);
                $(form)
                    .find("[name='" + field + "']")
                    .parent(".input")
                    .addClass("-error")
                    .find(".input__error")
                    .html(message);
            } else {
                if (field == "email") {
                    if (!expr.test(fields[field])) {
                        errors.push(message);
                        $(form)
                            .find("[name='" + field + "']")
                            .parent(".input")
                            .addClass("-error")
                            .find(".input__error")
                            .html("введите корректный e-mail");
                    }
                }
            }
        }
        if (!errors.length) {
            $.ajax({
                type: "post",
                async: false,
                dataType: "json",
                cache: false,
                url: src,
                data: data_field
            }).done(function(data) {
                $(form)
                    .find("input")
                    .val("")
                    .parent(".input")
                    .find(".input__placeholder")
                    .removeClass("hidden")
                $.arcticmodal({
                   content: '<div class="box-modal modal"><div class="modal__close arcticmodal-close"></div><div class="modal__message"><p>Данные успешно отправлены</p><img src="' + window.ENV.path +'img/ok.png" align="center" alt="ok" /></div></div>'
                });
            })
            .fail(function(data) {
                $.arcticmodal({
                   content: '<div class="box-modal modal"><div class="modal__close arcticmodal-close"></div><div class="modal__message"><p>Ошибка отправки данных</p><img src="' + window.ENV.path +'img/error.png" align="center" alt="ok" /></div></div>'
                });
            })
        }
    });
    $(".registration__form form").on("submit", function(e) {
        e.preventDefault();
        var src = $(this).attr("action");
        var serialize = $(this).serialize();
        var data_field = $(this).serializeArray();
        var form = $(this);
        var type = $(this).data("type");
        var fields = {
            email: "",
            password: ""
        };

        var require = ["password", "email"];
        var errors = [];
        var message = "Поле является обязательным для заполнения";
        var expr = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        for (var field in fields) {
            var val = $(form)
                .find("[name='" + field + "']")
                .val();
            fields[field] = $.trim(val);
            if (fields[field] == "" && require.indexOf(field) != -1) {
                errors.push(message);
                $(form)
                    .find("[name='" + field + "']")
                    .parent(".input")
                    .addClass("-error")
                    .find(".input__error")
                    .html(message);
            } else {
                if (field == "email") {
                    if (!expr.test(fields[field])) {
                        errors.push(message);
                        $(form)
                            .find("[name='" + field + "']")
                            .parent(".input")
                            .addClass("-error")
                            .find(".input__error")
                            .html("введите корректный e-mail");
                    }
                }
            }
        }
        if (!errors.length) {
            $.ajax({
                type: "post",
                async: false,
                dataType: "json",
                cache: false,
                url: src,
                data: data_field
            }).done(function(data) {
                $(form)
                    .find("input")
                    .val("")
                    .parent(".input")
                    .find(".input__placeholder")
                    .removeClass("hidden")
                $.arcticmodal({
                   content: '<div class="box-modal modal"><div class="modal__close arcticmodal-close"></div><div class="modal__message"><p>Данные успешно отправлены</p><img src="' + window.ENV.path +'img/ok.png" align="center" alt="ok" /></div></div>'
                });
            })
            .fail(function(data) {
                $.arcticmodal({
                   content: '<div class="box-modal modal"><div class="modal__close arcticmodal-close"></div><div class="modal__message"><p>Ошибка отправки данных</p><img src="' + window.ENV.path +'img/error.png" align="center" alt="ok" /></div></div>'
                });
            })
        }
    });
    $(".summary__form form").on("submit", function(e) {
        e.preventDefault();
        var src = $(this).attr("action");
        var serialize = $(this).serialize();
        var data_field = $(this).serializeArray();
        var form = $(this);
        var type = $(this).data("type");
        var fields = {
            name: "",
            contact: "",
            conditions: $("[name=conditions]:checked").length,
        };

        var require = ["name", "contact"];
        var errors = [];
        var message = "Поле является обязательным для заполнения";

        for (var field in fields) {
            var val = $(form)
                .find("[name='" + field + "']")
                .val();
            fields[field] = $.trim(val);
            if (fields[field] == "" && require.indexOf(field) != -1) {
                errors.push(message);
                $(form)
                    .find("[name='" + field + "']")
                    .parent(".input")
                    .addClass("-error")
                    .find(".input__error")
                    .html(message);
            } else {
                if (field == "email") {
                    if (!expr.test(fields[field])) {
                        errors.push(message);
                        $(form)
                            .find("[name='" + field + "']")
                            .parent(".input")
                            .addClass("-error")
                            .find(".input__error")
                            .html("введите корректный e-mail");
                    }
                }
            }
        }
        if (!$(form)
            .find("[name='conditions']")
            .is(":checked")
        ) {
            errors.push(message);
            $(form)
                .find("[name='conditions']")
                .parents(".control-label__input")
                .addClass("-error")
                .find(".input__error")
                .html("Подтвердите условия");
        } else
            $(form)
            .find("[name='conditions']")
            .parents(".control-label__input")
            .removeClass("-error");

        if (!errors.length) {
            $.ajax({
                type: "post",
                async: false,
                dataType: "json",
                cache: false,
                url: src,
                data: data_field
            })
            .done(function(data) {
                $(form)
                    .find("input")
                    .val("")
                    .parent(".input")
                    .find(".input__placeholder")
                    .removeClass("hidden")
                $.arcticmodal({
                   content: '<div class="box-modal modal"><div class="modal__close arcticmodal-close"></div><div class="modal__message"><p>Данные успешно отправлены</p><img src="' + window.ENV.path +'img/ok.png" align="center" alt="ok" /></div></div>'
                });

            })
            .fail(function(data) {
                $.arcticmodal({
                   content: '<div class="box-modal modal"><div class="modal__close arcticmodal-close"></div><div class="modal__message"><p>Ошибка отправки данных</p><img src="' + window.ENV.path +'img/error.png" align="center" alt="ok" /></div></div>'
                });
            })
        }
    });
     $(".support__top-form form").on("submit", function(e) {
        e.preventDefault();
        var src = $(this).attr("action");
        var serialize = $(this).serialize();
        var data_field = $(this).serializeArray();
        var form = $(this);
        var type = $(this).data("type");
        var fields = {
            name: "",
            email: "",
            comment: ""
        };

        var require = ["name", "email", "comment"];
        var errors = [];
        var message = "Поле является обязательным для заполнения";
        var expr = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        for (var field in fields) {
            var val = $(form)
                .find("[name='" + field + "']")
                .val();
            fields[field] = $.trim(val);
            if (fields[field] == "" && require.indexOf(field) != -1) {
                errors.push(message);
                $(form)
                    .find("[name='" + field + "']")
                    .parent(".input")
                    .addClass("-error")
                    .find(".input__error")
                    .html(message);
            } else {
                if (field == "email") {
                    if (!expr.test(fields[field])) {
                        errors.push(message);
                        $(form)
                            .find("[name='" + field + "']")
                            .parent(".input")
                            .addClass("-error")
                            .find(".input__error")
                            .html("введите корректный e-mail");
                    }
                }
            }
        }
        if (!errors.length) {
            $.ajax({
                type: "post",
                async: false,
                dataType: "json",
                cache: false,
                url: src,
                data: data_field
            })
            .done(function(data) {
                $(form)
                    .find("input")
                    .val("")
                    .parent(".input")
                    .find(".input__placeholder")
                    .removeClass("hidden")
                $.arcticmodal({
                   content: '<div class="box-modal modal"><div class="modal__close arcticmodal-close"></div><div class="modal__message"><p>Ваша заявка успешно отправлена</p><img src="' + window.ENV.path +'img/ok.png" align="center" alt="ok" /></div></div>'
                });

            })
            .fail(function(data) {
                $.arcticmodal({
                   content: '<div class="box-modal modal"><div class="modal__close arcticmodal-close"></div><div class="modal__message"><p>Ошибка отправки данных</p><img src="' + window.ENV.path +'img/error.png" align="center" alt="ok" /></div></div>'
                });
            })
        }
    });
    $(".registration-page__form form").on("submit", function(e) {
        e.preventDefault();
        var src = $(this).attr("action");
        var serialize = $(this).serialize();
        var data_field = $(this).serializeArray();
        var form = $(this);
        var type = $(this).data("type");
        var fields = {
            name: "",
            remember: $("[name=remember]:checked").length,
            email: "",
            password: "",
            repeat: ""
        };

        var require = ["name", "email", "password", "repeat"];
        var errors = [];
        var message = "Поле является обязательным для заполнения";
        var expr = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        for (var field in fields) {
            var val = $(form)
                .find("[name='" + field + "']")
                .val();
            fields[field] = $.trim(val);
            if (fields[field] == "" && require.indexOf(field) != -1) {
                errors.push(message);
                $(form)
                    .find("[name='" + field + "']")
                    .parent(".input")
                    .addClass("-error")
                    .find(".input__error")
                    .html(message);
            } else {
                if (field == "email") {
                    if (!expr.test(fields[field])) {
                        errors.push(message);
                        $(form)
                            .find("[name='" + field + "']")
                            .parent(".input")
                            .addClass("-error")
                            .find(".input__error")
                            .html("введите корректный e-mail");
                    }
                } else {
                    if (field == "repeat") {
                        if (!(fields[field] == fields["password"])) {
                            errors.push(message);
                            $(form)
                                .find("[name='" + field + "']")
                                .parent(".input")
                                .addClass("-error")
                                .find(".input__error")
                                .html("Пароли не совпадают");
                        }
                    }
                }
            }
        }
        if (!errors.length) {
            $.ajax({
                type: "post",
                async: false,
                dataType: "json",
                cache: false,
                url: src,
                data: data_field
            })
            .done(function(data) {
                $(form)
                    .find("input")
                    .val("")
                    .parent(".input")
                    .find(".input__placeholder")
                    .removeClass("hidden")
                $.arcticmodal({
                   content: '<div class="box-modal modal"><div class="modal__close arcticmodal-close"></div><div class="modal__message"><p>Данные успешно отправлены</p><img src="' + window.ENV.path +'img/ok.png" align="center" alt="ok" /></div></div>'
                });

            })
            .fail(function(data) {
                $.arcticmodal({
                   content: '<div class="box-modal modal"><div class="modal__close arcticmodal-close"></div><div class="modal__message"><p>Ошибка отправки данных</p><img src="' + window.ENV.path +'img/error.png" align="center" alt="ok" /></div></div>'
                });
            })
        }
    });
    $(".autorization__form form").on("submit", function(e) {
        e.preventDefault();
        var src = $(this).attr("action");
        var serialize = $(this).serialize();
        var data_field = $(this).serializeArray();
        var form = $(this);
        var type = $(this).data("type");
        var fields = {
            remember: $("[name=remember]:checked").length,
            email: "",
            password: ""
        };

        var require = ["email", "password"];
        var errors = [];
        var message = "Поле является обязательным для заполнения";
        var expr = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        for (var field in fields) {
            var val = $(form)
                .find("[name='" + field + "']")
                .val();
            fields[field] = $.trim(val);
            if (fields[field] == "" && require.indexOf(field) != -1) {
                errors.push(message);
                $(form)
                    .find("[name='" + field + "']")
                    .parent(".input")
                    .addClass("-error")
                    .find(".input__error")
                    .html(message);
            } else {
                if (field == "email") {
                    if (!expr.test(fields[field])) {
                        errors.push(message);
                        $(form)
                            .find("[name='" + field + "']")
                            .parent(".input")
                            .addClass("-error")
                            .find(".input__error")
                            .html("введите корректный e-mail");
                    }
                } 
            }
        }
        if (!errors.length) {
            $.ajax({
                type: "post",
                async: false,
                dataType: "json",
                cache: false,
                url: src,
                data: data_field
            })
            .done(function(data) {
                $(form)
                    .find("input")
                    .val("")
                    .parent(".input")
                    .find(".input__placeholder")
                    .removeClass("hidden")
                $.arcticmodal({
                   content: '<div class="box-modal modal"><div class="modal__close arcticmodal-close"></div><div class="modal__message"><p>Данные успешно отправлены</p><img src="' + window.ENV.path +'img/ok.png" align="center" alt="ok" /></div></div>'
                });

            })
            .fail(function(data) {
                $.arcticmodal({
                   content: '<div class="box-modal modal"><div class="modal__close arcticmodal-close"></div><div class="modal__message"><p>Ошибка отправки данных</p><img src="' + window.ENV.path +'img/error.png" align="center" alt="ok" /></div></div>'
                });
            })
        }
    });
    /*подгрузка*/
    $('.gallery__upload').click(function() {
        $.ajax({
            type: "get",
            url: $('.gallery__upload').attr('data-resource'),
            dataType: 'json',
            success: function(data) {
                $('.gallery__list').append(data.html);
                if (data.url.length) {
                    $('.gallery__upload').attr('data-resource', data.url)
                } else {                    
                    $('.gallery__upload').hide();
                }
            }
        })      
    });  
    /*модальные окна*/  
    /*статичная функция*/
    function Modal(r) {
        $("[data-modal]").on('click', function(e){
            e.preventDefault();
            e.stopImmediatePropagation;
            var src = $(this).attr('data-modal')
            $.arcticmodal({
                type: 'ajax',
                url: src,
                overlay: {
                    css: {
                        backgroundColor: '#353a43',
                        opacity: .6
                    }
                },
                afterLoading: function(data, el) {              
                },
                afterLoadingOnShow: function(data, el) {
                    
                }
            });
        });
    }
    /*динамичная функция*/
    $(".gallery__list").on('click', function(e){
            e.preventDefault();
            e.stopImmediatePropagation;
            var target = e.target;
            while (target != this) {
                if (target.hasAttribute('data-modal')){
                    var src = target.getAttribute('data-modal')
                    $.arcticmodal({
                        type: 'ajax',
                        url: src,
                        overlay: {
                            css: {
                                backgroundColor: '#353a43',
                                opacity: .6
                            }
                        }
                    }); 
                }
                target = target.parentNode;
            }

    })
    /* Сворачивание инфы*/
    $(".support__faq-item").each(function() {
        var target = "";
        target = $(".support__faq-item-text", $(this));

        if ($(this).hasClass("-active")) {
            $(target).addClass("-active");
        } else {
            $(target).removeClass("-active");
        }
        $(this).on("click", function(e) {
            if ($(this).hasClass("-active")) {
                $(this).removeClass("-active");
                $(target).removeClass("-active");
            } else {
                $(this).addClass("-active");
                $(target).addClass("-active");
            }
        });
    });
    /*модальное окно по ссылке*/
    window.onload = function() {
        if ((window.ENV.modal.length) && ($(".gallery").length)){
            var modal = window.ENV.modal
            $.arcticmodal({
                type: 'ajax',
                url: modal,
                overlay: {
                    css: {
                        backgroundColor: '#353a43',
                        opacity: .6
                    }
                }
            });
        }
    }
    /*Анимация для мобильного меню*/
    $(function() {
        var pull = $("#pull"),
            menu = $(".topnav__list"),
            menuHeight = menu.height(),
            close = $(".topnav__list-close");

        $(pull).on("click", function(e) {
            e.preventDefault();
            menu.animate(
                {
                    left: "0px"
                },
                200,
                "linear"
            );
            setTimeout(function() {
                menu.addClass("active");
            }, 200);
        });
        $(close).on("click", function(e) {
            e.preventDefault();
            menu.animate(
                {
                    left: "-100%"
                },
                200,
                "linear"
            );
            setTimeout(function() {
                menu.removeClass("active");
            }, 200);
        });
    });
    /*Смещение скролла на главной*/
    $(function() {
        $(".sphere__wrap").each(function() {            
            var x = (1366 - document.body.clientWidth)/2,
                self = $(this)
            self.scrollLeft(x)
            $( window ).resize(function() {
              x = (1366 - document.body.clientWidth)/2,
              self.scrollLeft(x)
            });
        })
        $(".prices__tabs-content").each(function() {            
            var x = (1433 - document.body.clientWidth)/2,
                self = $(this)
            self.scrollLeft(x)
            $( window ).resize(function() {
              x = (1433 - document.body.clientWidth)/2,
              self.scrollLeft(x)
            });
        })
    })
})