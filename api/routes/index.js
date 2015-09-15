var express = require('express');
var router = express.Router();

router.get('/auth', require('./auth.js').get);
router.post('/auth', require('./auth.js').post);

router.get('/appauth', require('./appauth.js').get);
router.post('/appauth', require('./appauth.js').post);

router.get('/score', require('./score.js'));

router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });   
});

module.exports = router;

