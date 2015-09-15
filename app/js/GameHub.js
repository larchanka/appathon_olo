(function() {
    var GameHub = window.GameHub || GameHub;

    GameHub.showGames = function() {
        var games = hub.games.list();
    };

    GameHub.showGame = function(id) {
        $('[data-page]').hide();
        $('[data-page="/game"]').show();
        dNav.init();
    };

    GameHub.init = function() {
        page('/', )
        page('/game/:id', GameHub.showGame);
    };

})();