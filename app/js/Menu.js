(function() {
    var Menu = {};
    var _selector = '.tabbar .tabbar--item';
    var _activeClass = 'is-active';
    var _els = $(_selector);
    var _current = 0;

    var _moveSelection = function(inc) {
        _current += inc;

        _current = (_current >= _els.length) ? 0 : _current;
        _current = (_current < 0) ? (_els.length - 1) : _current;

        location.hash = $(_els[_current]).data('route');
    };

    var _route = function() {
        var route = location.hash;
        var row = route.split('/');
        var path = '/' + row[1];
        var el = $('[data-route="' + path + '"]');

        _current = _els.index(el);
        _els.removeClass(_activeClass);
        $(_els[_current]).addClass(_activeClass);

        $('[data-page]').hide();
        $('[data-page="' + path + '"]').show();
        dNav.init();
    };

    var _bindEvents = function(selector) {
        $(_els[0]).addClass(_activeClass);
        $('body').on('keydown', function (e) {
            switch (e.keyCode) {
                case CONTROL_KEYS['left']:
                    _moveSelection(-1);
                    break;
                case CONTROL_KEYS['right']:
                    _moveSelection(1);
                    break;
                case CONTROL_KEYS['back']:
                    page.back();
                    break;
            }

            e.preventDefault();
            return false;
        });
    };

    Menu.init = function() {

        var routes = {
            '/': function(route) {
                _route(route);
                GameHub.showGames(route);
            },
            '/friends': function(route) {
                _route(route);
                GameHub.showFriends(route);
            },
            '/me': function(route) {
                _route(route);
                GameHub.showMe(route);
            },
            '/game/:id': function(route) {
                _route({path: '/game'});
                GameHub.showGame();
            }
        };

        var router = Router(routes);

        router.init();

        _bindEvents(_selector);
    };



    window.GameHub = window.GameHub || {};
    window.GameHub.Menu = Menu;
})();