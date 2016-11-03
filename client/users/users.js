//subscribing to the data published on the server
//best practice: subscribe closest where data is actually needed
Template.users.onCreated(function () {
	/*
	 this refers to the template instance the is being created

	 Note that we’re not calling the usual Meteor.subscribe(), but instead instance.subscribe(),
	 where instance refers to the current template. This is a special version of Meteor.subscribe()
	 that is automatically stopped when the template is destroyed (when navigating away from the user list)
	 */
	this.subscribe('users');
});

//Create data for the template array
Template.users.helpers ({
	users: function () {
		//mini mongo instantiation is receiving the data published from the server mongo collection
		//and is filtering for all users except the currently logged in user
		//=> "Meteor.user()" => currently signed in user
		//if no user is logged it return empty object
		return Meteor.users.find({ username: { $not: (Meteor.user() || {}).username}});
	}
});

Template.user.helpers({
	//'alreadyFriends' function was defined globally (without 'var x = ',
	// so we can assign and access it it here)
	alreadyFriends: alreadyFriends
});

Template.user.events({
	//because in 'users' template data context was set to users object
	//so within here we still have that data context and 'this._id' is the ID of a user
	'click .add': function (evt) {
		Meteor.call('setFriend', this._id);
	}
});