(function() {
    var GameHub = window.GameHub || GameHub;

    GameHub.showGames = function() {

    };

    GameHub.showGame = function(id) {
        $('[data-page]').hide();
        $('[data-page="/game"]').show();
        dNav.init();
    };

    GameHub.init = function() {
        page('/game/:id', GameHub.showGame);
    };

})();