alreadyFriends = function (userId) {
	var user = Meteor.user();

	//return true if
	return user && // there is a user logged in
		user.profile && // and the user has a profile
		user.profile.friends && // and the user has friends
		user.profile.friends.indexOf(userId) > -1; // and this user id is in their list of friends (exists), so we
		//know that they are already friends
};

getUsername = function (userId) {
	return Meteor.users.findOne(userId).username;
};