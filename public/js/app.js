(function () {
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
})();