Meteor.methods({
	setFriend: function (userId) {

		//"profile.friends" will be a array of friends
		var query = {};

		query[ alreadyFriends(userId) ? '$pull' : '$push' ] = {
			'profile.friends': userId
		};
		//query['$push'] = { 'profile.friends': 'ID' }
		//=>
		//query = { '$push': { 'profile.friends': 'ID' } }

		//The $push operator appends a specified value to an array.
		//If the field is absent in the document to update, $push adds the
		//array field with the value as its element.
		//so ... with this method we are creating an array in the document

		Meteor.users.update(this.userId, query);
	},

	createGame: function (color, opponentId) {

		var otherColor = (color === 'w') ? 'b' : 'w';

		var game = {
			moves: '',
			//returns current position of the boad in FEN notation
			board: (new Chess).fen()
		};

		game[color] = this.userId;
		game[otherColor] = opponentId;
		game.needsConfirmation = opponentId;

		Games.insert(game, function (err, id) {
			if (err) throw err;

			Conversations.insert({
				game: id,
				users: [this.userId, opponentId],
				messages: [{
					name: 'system',
					text: 'Game started ' + (new Date).toString()
				}]
			});

		}.bind(this));
	},
	acceptGame: function (gameId) {
		Games.update(gameId, { $unset: { needsConfirmation: null }});
	},
	declineGame: function (gameId) {
		Games.remove(gameId);
	},

	makeMove: function (gameId, move) {

		var game = Games.findOne(gameId);
		var chess = new Chess();

		//loads the current board with all moves / history in PGN
		chess.load_pgn(game.moves);
		chess.move(move);

		var result = null;

		if (chess.game_over()) {
			//after chess.move(move), is there are checkmate situation?
			//of so set result to the user who as made the move otherwise it must be a draw
			result = chess.in_checkmate() ? Meteor.userId() : 'draw';
		}

		Games.update(gameId, {
			$set: {
				board: chess.fen(),
				moves: chess.pgn(),
				result: result
			}
		}, function (err) {
			if (err) throw err;

			var message;

			if (result === 'draw')
				message = 'Game over; draw.';
			else if (result)
				message = getUsername(result) + ' won.';
			else if (chess.in_check())
				message = 'Check by ' + Meteor.user().username;
			else
				return;

			Conversations.update({ game: gameId }, {
				$push: {
					messages: {
						name: 'system',
						text: message
					}
				}
			});
		});
	},


	addMessage: function (message, gameId) {
		Conversations.update({ game: gameId }, {
			$push: {
				messages: {
					name: Meteor.user().username,
					text: message
				}
			}
		});
	}
});