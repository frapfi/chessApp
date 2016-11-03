Template.chat.onCreated(function () {

	this.id = () => FlowRouter.getParam('id');

	this.subscribe('chat', this.id());
});

Template.chat.helpers({
	//get messages list of Conversation collection
	//Template.instance() => returns current instance "this"; si we can call id() on it
	messages: function () {
		return Conversations.findOne({ game: Template.instance().id() }).messages;
	},
	//return class based on message type
	getClass: function (name) {
		if (name === 'system') return 'system';
		if (name === Meteor.user().username) return 'me';
		return 'them';
	}
});

Template.chat.events({
	//we can have access to the current template instance
	'keypress input': function (evt, instance) {
		if (evt.keyCode !== 13) return;
		Meteor.call('addMessage', evt.target.value, instance.id());
		evt.target.value = '';
	}
});