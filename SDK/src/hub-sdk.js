var HUB = function() {

	var _userName,
			_userToken,
			_appBundle,
			_defaultLeaderboardItemsNum = 10,
			_hubAppBundle = '',
			_initialized = false,
			_apiUrl = 'https://google.com';

	var _api = {

		// Application
		checkBundle: function(appBundle) {
			return fetch(_apiUrl + '/app/check', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: {
					score: 10,
					appBundle: '123'
				}
			});
		},

		// Score
		setScore: function(score) {
			return fetch(_apiUrl + '/score/set', {
				method: 'POST',
				body: {
					score: score,
					appBundle: _appBundle
				}
			});
		},

		getScore: function() {
			return fetch(_apiUrl + '/score/get?appBundle=' + _appBundle);
		},

		// Leaderboard
		getLeaderBoard: function(itemsNum) {
			return fetch(_apiUrl + '/leaderboard/get?itemsNum=' + itemsNum + '&appBundle=' + _appBundle);
		}
	};
	
	return {

		/**
			* Init: inits sdk
			* @param {string} appBundle – application bundle
			*
			* @returns {boolean} true/false
			**/

		init: function(appBundle, successCallback, errorCallback) {
			return _api.checkBundle(appBundle)
				.then(function(data) {
					_initialized = true;
					_appBundle = appBundle;
					successCallback(data);
				})
				.catch(function(err) {
					errorCallback(err);
				});
		},

		score: {
			set: function(score) {

				if (!score || typeof score !== 'number') {
					return false;
				}

				return _api.setScore(score);
			},

			get: function() {

			}
		},

		leaderBoard: {
			get: function(itemsNum) {
				if (typeof itemsNum !== 'number') {
					return false;
				}

				return _api.getLeaderBoard(itemsNum || _defaultLeaderboardItemsNum);
			}
		}
	};

};