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
      AppStore._openIFrame('/2048/index.html');
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

    setTimeout(function () {
      try {
        //XXX: need correct node to focus
        iframe.contentWindow.focus();
      } catch (e) {
        console.log('error', e);
      }
    }, 500);
  },

  _hideIFrame: function () {
    var node = document.getElementById('iframe-container');
    node.innerHTML = '';
    document.body.className = '';
  },

  emit: function (method) {

    if (method == 'quit') {
      AppStore._hideIFrame();
    }

  }
}
