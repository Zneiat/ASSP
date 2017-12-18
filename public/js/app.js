$(document).ready(function () {
    app.init();
});

var app = {
    init: function () {
        this.initRouter();
        this.navbarSearch.init();
        this.musicList.init();
    },

    initRouter: function () {
        var routesMap = {
            '/': function () {
                console.log('Home');
            },
            '/author': function () {
                console.log("author");
            },
            '/books': [function () {
                console.log("books");
            }, function () {
                console.log("An inline route handler.");
            }],
            '/books/:bookId': function (bookId) {
                console.log("viewBook: bookId is populated: " + bookId);
            }
        };

        window.router = Router(routesMap);

        router.init();
        router.setRoute('/');
    },

    navbarSearch: {
        init: function () {
            var _this = this;
            _this.formElem = $('.navbar-search-form');
            _this.siteInput = _this.formElem.find('[name="site"]');
            _this.keywrodInput = _this.formElem.find('[name="keyword"]');

            // Selector
            var selectorElem = _this.formElem.find('.search-site-selector'),
                selectorSelected = selectorElem.find('.option-selected'),
                selectorOptions = selectorElem.find('.options'),
                selectorItems = selectorOptions.find('.item'),
                selectorClickEN = 'click.search-selector-options';

            var selectorDefaultVal = selectorItems.first();
            selectorSelected.text(selectorDefaultVal.html());
            _this.siteInput.val(selectorDefaultVal.attr('data-val'));

            selectorItems.click(function () {
                selectorSelected.text($(this).text());
                selectorItems.removeClass('selected');
                $(this).addClass('selected');
                _this.siteInput.val($(this).attr('data-val'));
                _this.hideSelectorOptions();
            });

            _this.showSelectorOptions = function () {
                selectorOptions.addClass('show');

                setTimeout(function () {
                    // 若点击其他地方
                    $(document).bind(selectorClickEN, function (e) {
                        if(!$(e.target).is('.search-selector-options')
                            && !$(e.target).closest('.item').length) {
                            _this.hideSelectorOptions();
                        }
                    });
                }, 20);
            };

            _this.hideSelectorOptions = function () {
                $(document).unbind(selectorClickEN);
                selectorOptions.removeClass('show');
            };

            selectorSelected.click(_this.showSelectorOptions.bind(_this));
            _this.formElem.submit(this.submit.bind(_this));
        },

        submit: function () {
            var _this = this;

            $.ajax({
                url: _this.formElem.attr('action'),
                data: _this.formElem.serializeArray(),
                method: 'GET',
                success: function (data) {
                    console.log(data);
                    app.musicList.push(data);
                }, error: function () {
                    alert('网络错误，用户资料无法失败');
                }
            });

            return false;
        }
    },

    musicList: {
        init: function () {
            this.elem = $('.music-list');
            this.listMainElem = this.elem.find('.music-list-main');
        },

        push: function (obj) {
            this.listMainElem.html('');
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                var itemElem = this.itemRender(obj[i]);
                this.listMainElem.append(itemElem);
            }
        },

        itemRender: function (obj) {
            var srcUrl = 'm-api?site=' + encodeURIComponent(obj['source']) + '&action=song_src_r&id=' + encodeURIComponent(obj['id']);
            var itemElem = $(
                '<div class="music-list-item">' +
                '<div class="title">' + obj['name'] + '</div>' +
                '<div class="album">' + obj['album'] + '</div>' +
                '<div class="author">' + obj['artist'].join(' & ') + '</div>' +
                '<div class="actions">' +
                '<a class="action-item" href="' + srcUrl + '" download><i class="zmdi zmdi-download">下载</i></a>' +
                '</div>' +
                '</div>'
            );

            return itemElem;
        },
    }
};