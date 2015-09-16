console.log('init');
document.body.addEventListener('keydown', function (e) {
  console.log('zork:onkeypress', e);
  if (e.keyCode == 36) {
    var parentWindow = window.parent;
    if (parentWindow && parentWindow.AppStore) {
      parentWindow.AppStore.emit('quit');
    }
  }
});
console.log('after init');
