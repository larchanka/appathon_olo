/**
	* HUB SDK
	* Methods to work with HUB
	**/

var HUB = function() {

	var TMP = {
		username: 'hackathon19',
		password: 'Hackathon19!'
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
					appId: appId
				})
			});
		},

		// Score
		setScore: function(score) {
			return fetch(_apiUrl + '/score/set', {
				method: 'POST',
				body: JSON.stringify({
					score: score,
					appId: _appId
				})
			});
		},

		getScore: function() {
			return fetch(_apiUrl + '/score/get?appId=' + _appId);
		},

		// Leaderboard
		getLeaderBoard: function(itemsNum) {
			return fetch(_apiUrl + '/leaderboard/get?itemsNum=' + itemsNum + '&appId=' + _appId);
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

				if (!score || typeof score !== 'number') {
					return false;
				}

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
				if (typeof itemsNum !== 'number') {
					return false;
				}

				return _api.getLeaderBoard(itemsNum || _defaultLeaderboardItemsNum);
			}
		},

		// TODO: Friends methods
		// Unsupported methods
		friends: {
			add: function() {
				//TODO
			},

			get: function() {
				return [
					{
						id: 1,
						name: 'Ilya Pukhalski'
					},
					{
						id: 2,
						name: 'Maks Nemijs'
					},
					{
						id: 3,
						name: 'Mikhail Larchanka'
					}
				];
			}
		}
	};

};