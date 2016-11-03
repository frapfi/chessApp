Meteor.publish('users', function () {
	//find all of the records in the users Collections and only return
	//username and profile
	//what data is send to the client
	return Meteor.users.find({}, { username: 1, profile: 1})
});

Meteor.publish('games', function () {
	//get ID of logged in user: 'this.userId'
	//find all games where userId is in the game record
	//there are two fileds where the user is being kept: the b (black) of w (white) field
	return Games.find({ $or: [{ b: this.userId }, { w: this.userId }]});
});

//possibility to choose which (single) game we want to subscribe to
//side note: meteor only alows to subscribe to a cursor object not a single object
Meteor.publish('game', function (gameId) {
	return Games.find({ _id: gameId });
});

Meteor.publish('chat', function (gameId) {
	return Conversations.find({game: gameId})
});
