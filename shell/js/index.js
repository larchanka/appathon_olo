window.AppStore = {
  init: function () {
    document.body.addEventListener('keydown', function (e) {
      console.log('key down', e);
    });
  },

  openGameCenter: function () {
    console.log('openGameCenter');

    console.log('openGame');
    try {
      AppStore._openIFrame('/app/index.html');
    } catch (e) {
      console.error(e);
    }
  },

  openGame: function () {
    console.log('openGame');
    try {
      AppStore._openIFrame('/game');
    } catch (e) {
      console.error(e);
    }
  },

  _openIFrame: function (src) {
    var node = document.getElementById('iframe-container');
    var iframe = document.createElement('iframe');
    iframe.src = src;
    node.appendChild(iframe);
    document.body.className = 'full-screen';
  },

  _hideIFrame: function () {
    var node = document.getElementById('iframe-container');
    node.innerHTML = '';
    document.body.className = '';
  }
}
