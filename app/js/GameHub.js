(function() {
    var GameHub = window.GameHub || GameHub;

    GameHub.showGames = function() {
        var games = hub.games.list();
        var placeHolder = document.getElementById("gamesListView");
        placeHolder.innerHTML = tmpl("gameListTemplate", {data:games});
        dNav.init();
    };

    GameHub.showGame = function(route) {
        var route = location.hash;
        var row = route.split('/');
        var id = row[2];
        hub.games.get(id)
            .then(function(data) {
                console.log(data)
                $('[data-page]').hide();
                $('[data-page="/game"]').show();
                var placeHolder = document.getElementById("gameView");
                placeHolder.innerHTML = tmpl("gameTemplate", data);
            })
            .catch(function(err) {
                console.log(err)
            });
    };

    GameHub.showFriends = function() {
        var friends = hub.friends.get();
        var placeHolder = document.getElementById("friendsListView");
        placeHolder.innerHTML = tmpl("friendsListTemplate", {data:friends});
    };

    GameHub.showMe = function() {
        var me = hub.user.getData();
        var placeHolder = document.getElementById("meView");
        placeHolder.innerHTML = tmpl("meTemplate", {data:me});
    };

    GameHub.init = function() {
    };
    
    window.GameHub = GameHub;
})();
