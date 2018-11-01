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
    /*Динамика placeholder в форме*/
    function dinamicForm() {
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
    };
    function formSubmit() {
        $("form").on("submit", function(e) {
            e.preventDefault();
            var src = $(this).attr("action");
            var serialize = $(this).serialize();
            var data_field = $(this).serializeArray();
            var form = $(this);
            var type = $(this).data("type");
            var fields = {
                name: "",
                phone: "",
                comment: ""
            };

            var require = ["name", "phone"];
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
                    $.arcticmodal('close');
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
    }
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
                        backgroundColor: 'transparent',
                        opacity: .6
                    }
                },
                afterLoadingOnShow: function(data, el) {
                    dinamicForm();
                    formSubmit();
                },
            });
        });
    }
    Modal();
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
    /*Анимация для мобильного меню*/
    $(function() {
        var pull = $("#pull"),
            menu = $(".topnav__list"),
            menuHeight = menu.height();

        $(pull).on("click", function(e) {
            e.preventDefault();
            if (menu.hasClass("active"))
            {
                pull.css("position", "absolute")
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
            }   
            else
            {
                pull.css("position", "fixed")
                menu.animate(
                    {
                        left: "0px"
                    },
                    200,
                    "linear"
                );
                setTimeout(function() {
                    menu.addClass("active");
                }, 200 ); 
            }  
        });
    });
})