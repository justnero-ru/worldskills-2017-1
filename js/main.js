(function ($) {
    $(function () {
        ticketsInit();
        financialInit();
        secretInit();
        careersInit();
        newsInit();
    });

    function ticketsInit() {
        var last = false;
        $('.tickets-amount select').on('change', function () {
            var $this = $(this),
                _for = $this.data('for');
            ticketsSetTo($('.tickets-' + _for), $this.val(), _for, last);
        });
        $('body').on('change', '.fast_pass_checkbox', function () {
            var $this = $(this),
                preview = $this.closest('.ticket').find('.preview');
            last = $this.is(':checked');
            if (last) {
                preview.addClass('fast_pass');
            } else {
                preview.removeClass('fast_pass');
            }
        }).on('change', '.ticket_name', function () {
            var $this = $(this);
            $this.closest('.ticket')
                .find('.preview .name')
                .text($this.val());
        });
    }

    function ticketsSetTo(cont, count, _for, fast_pass) {
        while (cont.children().length > count) {
            cont.children().last().remove();
        }
        while (cont.children().length < count) {
            var i = cont.children().length + 1;
            cont.append(
                $('<div></div>', {'class': 'ticket row-flex'})
                    .append(
                        $('<div></div>', {'class': 'form-group'})
                            .append(
                                $('<label></label>', {'for': 'ticket_' + _for + '_' + i})
                                    .text(_for.charAt(0).toUpperCase() + _for.slice(1) + ' ' + i),
                                $('<input/>', {
                                    'type': 'text',
                                    'class': 'ticket_name',
                                    'name': 'ticket_' + _for + '[' + i + '][name]',
                                    'id': 'ticket_' + _for + '_' + i
                                }),
                                $('<label></label>')
                                    .append(
                                        $('<input/>', {
                                            'type': 'checkbox',
                                            'class': 'fast_pass_checkbox',
                                            'name': 'ticket_' + _for + '[' + i + '][fast_pass]',
                                            'checked': fast_pass,
                                            'value': true
                                        }),
                                        '+ Fast Pass >>'
                                    )
                            ),
                        $('<div></div>', {'class': 'preview' + (fast_pass ? ' fast_pass' : '')})
                            .append(
                                $('<div></div>', {'class': 'ticket'})
                                    .append(
                                        $('<div></div>', {'class': 'name'})
                                            .text(' ')
                                    )
                            )
                    )
            );
        }
    }

    function financialInit() {
        var price = $('#financial-price');
        if (price.length) {
            window.financial = {
                price: price,
                xhr: undefined
            };
            setInterval(financialReload, 10000);
        }
    }

    function financialReload() {
        if (financial.xhr === undefined) {
            financial.xhr = $.get('stock.php')
                .done(function (result) {
                    financial.price.text(result);
                    financial.xhr = undefined;
                });
        }
    }

    function careersInit() {
        var list = $('.careers_list');
        if (list.length) {
            careersLoad(list);
        }
    }

    function careersLoad(list) {
        $.get('career.php')
            .done(function (result) {
                $('#careers_count').text(result.length);
                list.find('.career_wrap')
                    .remove();
                $.each(result, function () {
                    list.append(
                        $('<div></div>', {class: 'career_wrap'})
                            .append(
                                $('<a></a>', {class: 'career', href: '#'})
                                    .append(
                                        $('<img/>', {
                                            class: 'photo',
                                            src: 'img/' + this.image,
                                            alt: this.name
                                        }),
                                        $('<div></div>', {class: 'title'})
                                            .text(this.name)
                                    )
                            )
                    )
                });
            });
    }

    function newsInit() {
        var news = $('#news');
        news.find('.read-more')
            .on('click', function (e) {
                e.preventDefault();
                var $this = $(this),
                    articles = news.find('article'),
                    current_article = $this.closest('article'),
                    was = current_article.hasClass('more');
                articles
                    .removeClass('more')
                    .find('.read-more')
                    .each(function () {
                        var _this = $(this);
                        if (_this.data('original')) {
                            _this.html(_this.data('original'))
                                .data('original', '');
                        }
                    })
                    .end()
                    .find('.content > .more')
                    .slideUp(300);
                if (!was) {
                    current_article
                        .addClass('more')
                        .find('.content > .more')
                        .slideDown(300);
                    var btn = current_article.find('.read-more');
                    btn.data('original', btn.html())
                        .html('Close');
                }
            });
    }

    function secretInit() {
        var code = localStorage.getItem('discount');
        if (code) {
            secretSet(code);
        } else {
            $('.hidden-egg .code').on('click', secretClick);
        }
    }

    function secretClick() {
        var $this = $(this);
        if ($this.hasClass('state-2')) {
            secretGenerate();
            $this.removeClass('state-2')
                .addClass('state-3');
        } else if ($this.hasClass('state-1')) {
            $this.removeClass('state-1')
                .addClass('state-2');
        } else {
            $this.addClass('state-1');
        }
    }

    function secretGenerate() {
        var code = Math.random().toString(36).substring(2, 6).toUpperCase();
        secretSet(code);
        localStorage.setItem('discount', code);
    }

    function secretSet(code) {
        $('.hidden-egg .code').removeClass('state-1')
            .removeClass('state-2')
            .addClass('state-3');
        $('#discount').text(code);
    }

})(jQuery);