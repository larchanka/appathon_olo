var rewire = require('rewire');
var expect = require('chai').expect;

require('../db.js');
var scoreRoute = rewire('../routes/score.js');
var UserModel = require('../models/user.js');
var AppModel = require('../models/app.js');

var auth = {
  getSessionUser: function (token) {
    return new Promise(function (res, rej) {
      if (token === 'bad') {
        return rej(new Error('bla'));
      }

      var user = new UserModel({
        username: token
      });

      return res(user);

    });
  }
};

scoreRoute.__set__('auth', auth);

describe('api', function () {

  var username = 'user-name-4';
  var score = '1000';

  it('should correcty break on POST', function (done) {
    var req = {
      body: {
        score: '500',
        appId: 'com.olo.test',
        session: 'bad'
      }
    };
    var res = {
      send: function (result) {
        expect(result.type).to.be.equal('ERROR');
        expect(result.message).to.be.equal('bla');
        return done();
      }
    };

    scoreRoute.post(req, res);
  });

  it('should post data to app', function (done) {
    var req = {
      body: {
        score: score,
        appId: 'com.olo.test',
        session: username
      }
    };

    var res = {
      send: function (result) {
        console.log('result is', result);
        return done();
      }
    };

    return scoreRoute.post(req, res)
  });

  it('should rewire getSessionUser of scoreRoute', function (done) {

    AppModel.auth('com.olo.test').then(function (app) {
      console.log('app is', app.getScores());
      return done();
    });

    return;

    var req = {
      query: {
        appId: 'com.olo.test',
        session: username
      }
    };

    var res = {
      send: function (result) {
        console.log('result is', result);
        return done();
      }
    };

    return scoreRoute.get(req, res)
  });

});
