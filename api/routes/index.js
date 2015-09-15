var express = require('express');
var router = express.Router();

router.get('/auth', require('./auth.js').get);
/*
 * POST /api/auth {
 *  username: 'hackathon19',
 *  password: 'Hackathon19!'
 * }
 */
router.post('/auth', require('./auth.js').post);

router.get('/appauth', require('./appauth.js').get);

/*
 * POST {
 *  appId: 'com.olo.test'
 * }
 */
router.post('/appauth', require('./appauth.js').post);

router.get('/score', require('./score.js').get);
router.post('/score', require('./score.js').post);

router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });   
});

module.exports = router;

