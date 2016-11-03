Template.games.onCreated(function () {
	this.subscribe('users');
	this.subscribe('games');
});

Template.games.helpers({

	possibleOpponents: function () {
		//current logged in user
		var user = Meteor.user();
		//get list of his friends
		var friends = user.profile.friends || [];

		//Note: Published games from server only contains the games which
		//the current user is playing

		//find all games which the result fields are null, which means: the games have
		//not been finished yet (there is no result available) => find the game that are
		//currently in play and loop over them
		Games.find({ result: null }).forEach(function (game) {
			//find the opponent: If current user is playing white, the opponent is black
			var color = (game.w === user._id) ? 'b': 'w';
			//get the id of the opponent and check if the id is in our friends list, i.d.
			//finding that user in the friends array
			var idx   = friends.indexOf(game[color]);
			//if it is in the friends array
			//do inplace edit on the array: renmove that friend
			if (idx > -1) friends.splice(idx, 1);
		});
		//friends array which contains fiends we are not currently playing a game with
		//return the set of friends with whom we can play a game with
		//in order to use "possibleOpponents" also as booelan value (falsy / truthy) and array,
		//check for friends.length (an empty array itselfe is not a falsy value)
		return friends.length ? Meteor.users.find({ _id: { $in: friends } }) : null;
	},
	//when a game is finished, the result field has the ID of the winner
	//otherwise the result field is null
	currentGames: function () {
		return Games.find({ result: null });
	},
	archivedGames: function () {

		return Games.find({ result: { $not: null } }).map(function (game) {
			//remapping the userID to the username + won
			if (game.result !== 'draw') game.result = getUsername(game.result) + ' won';

			return game;
		});
	},
	//get / reference username function from helper.js
	username: getUsername,
	//needsConfirmation field of game object (data scope set by for each in games.html)
	byMe: function () {
		return this.needsConfirmation && this.needsConfirmation === Meteor.userId();
	},
	opponent: function () {
		return (this.w === Meteor.userId()) ? this.b : this.w;
	}
});

Template.games.events({
	'submit form': function (evt) {
		evt.preventDefault();
		Meteor.call('createGame', evt.target.color.value, evt.target.otherPlayer.value);
	},
	'click #accept': function (evt) {
		Meteor.call('acceptGame', this._id);
	},
	'click #decline': function (evt) {
		Meteor.call('declineGame', this._id);
	}
});

