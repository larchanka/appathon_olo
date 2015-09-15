/**
	* HUB SDK
	* Methods to work with HUB
	**/

var HUB = function() {

	var TMP = {
		username: 'hackathon19',
		password: 'Hackathon19!'
		// username: 'orionprodnl09',
		// password: 'Welkom910'
		// username: 'nvierhout',
		// password: 'password'
	};

	var _userName,
			_userData = {
				givenName: '',
				familyName: ''
			},
			_userToken,
			_appId,
			_defaultLeaderboardItemsNum = 10,
			_hubappId = '',
			_initialized = false,
			_apiUrl = 'http://olo.herokuapp.com';

	var _api = {

		init: function(appId, successCallback, errorCallback) {
			return _api.authorizeUser(TMP.username, TMP.password)
				.then(function(response) {
					return response.json()
				})
				.then(function(data) {
					_userData = data.message.details;
					_userToken = data.message.token;
					// document.cookie = 'session=' + data.message.token;
				})
				.then(function() {
					return _api.checkBundle(appId)
				})		 
				.then(function(bundleResponse) {
					return bundleResponse.json();
				})
				.then(function(bundleData) {
					_initialized = true;
					_appId = appId;

					if (typeof successCallback === 'function') {
						successCallback(bundleData);
					}
				})
				.catch(function(err) {
					if (typeof errorCallback === 'function') {
						errorCallback(err);
					}
				});
		},

		// User
		authorizeUser: function(username, password) {
			if (!username || !password) {
				return false;
			}

			_userName = username;

			return fetch(_apiUrl + '/api/auth', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: username,
					password: password
				})
			});
		},

		// Application
		checkBundle: function(appId) {
			return fetch(_apiUrl + '/api/appauth', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					appId: appId,
					session: _userToken
				})
			});
		},

		// Score
		setScore: function(score) {
			console.log(_userToken)
			return fetch(_apiUrl + '/api/score', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					score: score,
					appId: _appId,
					session: _userToken
				})
			});
		},

		getScore: function(appId) {
			return fetch(_apiUrl + '/api/score?appId=' + (appId || _appId) + '&session=' + _userToken);
		},

		// Leaderboard
		getLeaderBoard: function(itemsNum) {
			return fetch(_apiUrl + '/api/app?appId=' + _appId);
		}
	};
	
	return {

		/**
			* Init application
			* @param {string} appId – application bundle
			* @param {function} successCallback
			* @param {function} errorCallback
			*
			* @returns {boolean} true/false
			**/

		init: function(appId, successCallback, errorCallback) {
			return _api.init(appId, successCallback, errorCallback);
		},

		// User methods
		user: {

			/**
				* Get user data
				*
				* @returns {object} user data
				**/

			getData: function() {
				return {
					userName: _userName,
					userData: _userData
				};
			}
		},

		// Application score methods
		score: {

			/**
				* Set application score
				* @param {number} score
				*
				* @returns {promise}
				**/

			set: function(score) {

				// if (!score || typeof score !== 'number') {
				// 	return false;
				// }

				return _api.setScore(score);
			},

			/**
				* Get application score
				*
				* @returns {promise}
				**/

			get: function() {
				return _api.getScore();
			}
		},

		// Applications leaderboard methods
		leaderBoard: {

			/**
				* Get application leaderboard
				* @param {number} itemsNum – number of results (default: 10)
				*
				* @returns {promise}
				**/
			get: function(itemsNum) {
				// if (typeof itemsNum !== 'number') {
				// 	return false;
				// }

				return _api.getLeaderBoard(itemsNum || _defaultLeaderboardItemsNum);
			}
		},

		// TODO: Friends methods
		friends: {

			/**
				* Add friend
				* TODO
				*
				* @returns {void}
				**/
			add: function() {
				//Magic
			},

			/**
				* Get friends list
				*
				* @returns {array}
				**/
			get: function() {
				return [
					{
						id: 1,
						name: 'Ilya Pukhalski',
						image: './images/friends/1.png',
						games: 4,
						common: 1
					},
					{
						id: 2,
						name: 'Maks Nemijs',
						image: './images/friends/2.jpg',
						games: 2,
						common: 1
					},
					{
						id: 3,
						name: 'Mikhail Larchanka',
						image: './images/friends/3.png',
						games: 5,
						common: 0
					}
				];
			}
		},

		games: {

			/**
				* Get Game information
				*
				* @returns {object}
				**/
			get: function(appId) {
				if (!appId) {
					return false;
				}

				var _data = {
					score: 0,
					game: {
						appdId: 'com.olo.test',
						name: '2048 Free',
						description: 'Nice game description. List of all features and possibilities.',
						path: './game/index.html',
						image: './images/game.jpg',
						stats: {
							friends: 2,
							total: 126
						}
					},
					leaderboard: []
				};

				return _api.getScore(appId)
					.then(function(response) {
						return response.json();
					}).then(function(data) {
						_data.score = data.message[0];
						return _api.getLeaderBoard();
					})
					.then(function(response) {
						return response.json();
					})
					.then(function(data) {
						_data.leaderboard = data.message;
						return _data;
					});
			},

			/**
				* Get Games list
				*
				* @returns {array}
				**/
			list: function() {
				return [
					{
						appdId: 'com.olo.test',
						name: '2048 Free',
						image: './images/game.jpg',
						stats: {
							friends: 2,
							total: 126
						}
					}
				];
			}
		}
	};
};