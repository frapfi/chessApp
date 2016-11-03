FlowRouter.route('/', {
	//doesn't have to be 'main' like 'main.html' / template-name = 'main'
	name: 'main',
	action() {
		//renders the layout with specified data object
		//template.dynamic template=child
			//=> what ever value is assigned to child will be rendered: <template name='main'> in main.html
		BlazeLayout.render('layout', {child: 'main'});
	}
});

FlowRouter.route('/users', {
	name: 'users',
	action() {
		//keeps current layout and only rerenders child object
		//<template name='users'> in users.html
		BlazeLayout.render('layout', {child: 'users'});
	}
});

FlowRouter.route('/games', {
	name: 'games',
	action() {
		BlazeLayout.render('layout', { child: 'games' });
	}
});

FlowRouter.route('/games/:id', {
	name: 'game',
	action() {
		BlazeLayout.render('layout', { child: 'game' });
	}
});