window.debug = function (str) {
  var node = document.getElementById('log');
  node.appendChild(document.createElement('div')).innerHTML = str;
};

window.AppStore = {
  buttons : [],
  getNext: function (dir) {
    var current = AppStore._currentActive;
    var i = -1;
    this.buttons.some(function (node, index) {
      if (node == current) {
        i = index;
        return true;
      }
    });

    if (dir == 'next') {
      if (this.buttons[i+1]) {
        return i + 1;
      } else {
        return 0;
      }
    } else if (dir == 'prev') {
      if (this.buttons[i - 1]) {
        return i - 1;
      } else {
        return this.buttons.length - 1;
      }
    }

  },

  goRight: function () {
    var index = this.getNext('next');
    this._setActive(this.buttons[index]);
  },

  goLeft: function () {
    var index = this.getNext('prev');
    this._setActive(this.buttons[index]);
  },

  enter: function () {
    console.log('enter');
    var current = this._currentActive;
    try {
      current.onclick();
    } catch (e) {
      console.error('wtf');
    }
  },

  init: function () {
    document.body.addEventListener('keydown', function (e) {
      switch(e.keyCode) {
        case 39: //right
          AppStore.goRight();
          break;
        case 37: //left
          AppStore.goLeft();
          break;
        case 13: //enter
          AppStore.enter();
          break;
      }
    });

    var buttons = document.querySelectorAll('.action-button');
    var arr = this.buttons;
    Array.prototype.forEach.call(buttons, function (b) {
      arr.push(b);
    });

    // put the first one, active
    this._setActive(arr[0]);

    debug('inited');

    window.onerror = function (e) {
      debug(e.message);
    }
  },

  _setInactive: function (node) {
    var classes = node.className.split(' ');
    var index = classes.indexOf('active');
    classes.splice(index, 1);
    node.className = classes.join(' ');
  },

  _setActive: function (node) {
    if (AppStore._currentActive) {
      this._setInactive(AppStore._currentActive);
    }

    AppStore._currentActive = node;

    var classes = node.className.split(' ');
    classes.push('active');
    node.className = classes.join(' ');
  },

  openGameCenter: function () {
    console.log('openGameCenter');

    console.log('openGame');
    try {
      AppStore._openIFrame('./app/index.html');
    } catch (e) {
      console.error(e);
    }
  },

  openGame: function () {
    console.log('openGame');
    try {
      AppStore._openIFrame('./2048/index.html');
    } catch (e) {
      console.error(e);
    }
  },

  _openIFrame: function (src) {
    document.location = src;
    return;

    var node = document.getElementById('iframe-container');
    var iframe = document.createElement('iframe');
    iframe.src = src;
    node.style.backgroundColor = 'red';
    node.appendChild(iframe);

    iframe.onerror = function (e) {
      debug('iframe error: ' + e.message);
    }


    document.body.className = 'full-screen';

    setTimeout(function () {
      try {
        //XXX: need correct node to focus
        iframe.contentWindow.focus();
      } catch (e) {
        debug('zork:' + e.message);
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
