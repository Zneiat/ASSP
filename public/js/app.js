$(document).ready(function () {
    app.init();
});

var app = {
    init: function () {
        this.navbarSearch.init();
        this.musicList.init();

        this.initRouter();
    },

    initRouter: function () {
        var routesMap = {
            '/': function () {
                console.log('HOME');
            },
            '/author': function () {
                console.log("author");
            },
            '/books': [function () {
                console.log("books");
            }, function () {
                console.log("An inline route handler.");
            }],
            '/search/:site/:keyword/:page': function (site, keyword, page) {
                site = decodeURIComponent(site);
                keyword = decodeURIComponent(keyword);
                page = page || '1';

                console.log(site, keyword, page);
                app.navbarSearch.submit(site, keyword, page);
            }
        };

        window.router = Router(routesMap);

        router.notfound = function() {
            console.log('404');
        };

        router.init('/');
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

                // 若点击其他地方
                $(document).bind(selectorClickEN, function (e) {
                    if(!$(e.target).is('.search-selector-options')
                        && !$(e.target).is('.option-selected')
                        && !$(e.target).closest('.item').length) {
                        _this.hideSelectorOptions();
                    }
                });
            };

            _this.hideSelectorOptions = function () {
                $(document).unbind(selectorClickEN);
                selectorOptions.removeClass('show');
            };

            selectorSelected.click(_this.showSelectorOptions.bind(_this));
            _this.formElem.submit(function () {
                router.setRoute('/search/' + _this.siteInput.val() + '/' + _this.keywrodInput.val() + '/1');
            });
        },

        submit: function (site, keyword, page) {
            var _this = this;

            $.ajax({
                url: 'm-api',
                data: {
                    action: 'search',
                    site: site,
                    keyword: keyword,
                    page: page,
                },
                method: 'GET',
                beforeSend: function () {
                    app.musicList.listLoading.show();
                    app.musicList.listPagination.hide();
                },
                success: function (data) {
                    app.musicList.listLoading.hide();
                    app.musicList.listPagination.show();
                    console.log(data);
                    app.musicList.push(data);
                    $('html, body').animate({
                        scrollTop: '0px'
                    }, 200);
                }, error: function () {
                    app.musicList.listLoading.hide();
                    alert('网络错误');
                }
            });

            return false;
        }
    },

    musicList: {
        init: function () {
            var _this = this;
            _this.elem = $('.music-list');
            _this.listMainElem = _this.elem.find('.music-list-main');
            _this.listLoading = _this.elem.find('.music-list-loading');
            _this.listLoading.append(app.loadingRender());

            // Pagination
            _this.listPagination = _this.elem.find('.music-list-pagination');
            _this.currentPage = 1;
            _this.syncRouterPage = function () {
                var routeArr = router.getRoute();
                routeArr[routeArr.length - 1] = _this.currentPage;
                router.setRoute(routeArr.join('/'));
            };

            var prePageBtn = _this.listPagination.find('.pre-page');
            var nxtPageBtn = _this.listPagination.find('.nxt-page');
            prePageBtn.click(function () {
                if (_this.currentPage <= 1)
                    return;

                _this.currentPage--;
                _this.syncRouterPage();
            });
            nxtPageBtn.click(function () {
                _this.currentPage++;
                _this.syncRouterPage();
            })
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
                '<a class="action-item" href="' + srcUrl + '" download><i class="zmdi zmdi-download"></i> 下载</a>' +
                '</div>' +
                '</div>'
            );

            return itemElem;
        },
    },

    loadingRender: function () {
        return $('<div class="spinner-root"><div class="spinner-spinner"><span class="spinner-blade"></span><span class="spinner-blade"></span><span class="spinner-blade"></span><span class="spinner-blade"></span><span class="spinner-blade"></span><span class="spinner-blade"></span><span class="spinner-blade"></span><span class="spinner-blade"></span><span class="spinner-blade"></span><span class="spinner-blade"></span><span class="spinner-blade"></span><span class="spinner-blade"></span></div></div>');
    },
};