Template.game.onCreated(function () {

	//calling "autorun" on the template:
	//reruns every time whenever one of values of the reactive functions changes
	this.autorun(() => {
		this.subscribe('users');
		//FlowRouter.getParam('id') is the reactive function
		//so when ever the id valuer changes we get a new subscription
		this.subscribe('game', FlowRouter.getParam('id'));
	});
});

/**
 * Gets game with provided URL ID of DB
 * @returns {any} game object from DB
 */
function getGame() {
	return Games.findOne(FlowRouter.getParam('id'));
}

Template.game.helpers({

	//returns username whom's turn it is
	currentTurn: function () {
		var game = getGame();

		//game.b / game.w, which gives us the ID of the player as param for getUsername
		return getUsername(game[game.board.split(' ')[1]]);
	},

	//return string based on result
	result: function () {
		var result = getGame().result;

		if (!result) return null;
		if (result === 'draw') return 'Draw!';

		return getUsername(result) + ' won!';
	},

	//returns pair of strings of made move:
	//for each array, map / transfer its item to a pair of strings
	// e.g.: arr["Nf3", "d5"], ["g3", "c6"]
	// => Nf3 d5
	// => g3 c6
	moves: function () {
		return pair(getMoves())
			.map(function (arr) {
				return arr[0] + ' ' + (arr[1] || '');
		});
	},

	//returns an array of arrays with cell objects to be drawn on the board:
	//Array[8] : Array[8] : Object 1, Object 2, {cell:"a8", img:"&#9820;", piece:"r"}
	rows: function () {
		var chess = new Chess();
		//put already made moves in the newly created chess game
		//e.g.: chess.move('e4')

		//gets array of moves, loops over each move and makes the move here
		//array.forEach(chess.move)
		//The bind method creates a new function that will call the
		//original function but with "this" explicitly set to the chess object
		getMoves().forEach(chess.move.bind(chess));

		var temp = makeRows(chess.fen(), getGame().b);
		console.log(temp);

		return makeRows(chess.fen(), getGame().b);
	}
});

/**
 * Creates an array of arrays. Each array contains moves of one round:
 *
 * @param arr
 * @returns {Array}
 */
function pair (arr) {
	var i = 0;
	var ret = [];

	while(i < arr.length) ret.push([arr[i++], arr[i++]]);
	//console.log('getMoves Array: ',arr);
	//console.log('Array "pairs" per round: ',ret);
	return ret;
}

var selectedData = null;
var selectedNode = null;

Template.game.events({

	'click td': function (evt) {

		//get game record from DB
		var data = getGame();
		//data.board => FEN:
		//rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
		//data.board.split(' ')[1]
		console.log('game object: ', data);
		console.log('player ID which is in turn:  ', data[data.board.split(' ')[1]]);

		//ignore clicks when currently logged in user is not in turn
		if (data[data.board.split(' ')[1]] !== Meteor.userId()) return;

		var chess = new Chess(data.board);

		if(selectedData) { //if we select a cell (e.g. e2) and it has been the second click ...
			if (selectedData.cell === this.cell) { //when clicking the same cell a second time, deselect it
				deselect();
			} else { // otherwise it is a new cell, i.d. a possible cell to which can be drawn ...
				// so check if previously selected piece can be moved to this cell
				var move = canMove(selectedData.cell, this.cell);
				console.log('Choosen move: ', move);
				if (move) { //if move can be made, update database; do some server side logic
					Meteor.call('makeMove', data._id, move);
					deselect();
				}
			}
		} else { // first click (cell is not yet selected)
			if (canMove(this.cell)) select(evt.target, this); //data context: cell object
			console.log('currently clicked cell data object: ', this)
		}

		/**
		 * Check if moves are possible
		 *
		 * @param from
		 * @param to
		 * @returns {boolean} or the full AN of move that we are trying to make
		 */
		function canMove(from, to) { // e4, h8
			var moves = chess.moves({square: from});
			console.log('All possible moves for this piece: ', moves); //e.g.: ["Nf3", "Nh3"]

			//if no 'to' parameter was passed to func return whether move is possible or not (boolean) else ..
			return !to ? moves.length > 0 : moves.reduce(function (prev, curr) { //.. return the full move to the cell we want to move to

				if (prev) return prev;

				return curr.indexOf(to)	> -1 ? curr : false; //Nxh4+ => is h4 in the string?

			}, false);
		}


	}


});

function select(node, data) {
    selectedNode = node;
	selectedData = data;
	selectedNode.classList.add('selected');
}

function deselect() {
	selectedNode.classList.remove('selected');
	selectedNode = null;
	selectedData = null;

}

/*
 * Helper Functions ****************************************
*/

// -> '   +------------------------+
//      8 | r  n  b  q  k  b  n  r |
//      7 | p  p  p  p  .  p  p  p |
//      6 | .  .  .  .  .  .  .  . |
//      5 | .  .  .  .  p  .  .  . |
//      4 | .  .  .  .  P  P  .  . |
//      3 | .  .  .  .  .  .  .  . |
//      2 | P  P  P  P  .  .  P  P |
//      1 | R  N  B  Q  K  B  N  R |
//        +------------------------+
//          a  b  c  d  e  f  g  h'

/**
 *
 * @param board
 * @param b
 * @returns {Array}: [
 * 						[{cell: 'h1', img: '&#9814;', piece: 'R'},{...},{...},etc.],
 * 						[...],
 * 						[...],
 * 						etc.
 * 					 ]
 */
function makeRows(board, b) {

	//board: chess.fen() returns e.g.: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
	var rows = board.split(' ')[0].split('/');
	//rows => [rnbqkbnr, pppppppp, etc.]


	var data = rows.map(function (row, i) {

		var rank = 8 - i; // row number
		var file = 0; // column

		//split to a single character, e.g.: 'r','n','b','q'
		/*
		    without flattening:
			4P3
			[[{}, {}, {}, {}], {P}, [{},{},{}]]

			when flattened: [{}, {}, {}, {}, {P}, {}, {}, {}]
		 */
		return [].concat.apply( [], row.split('').map(function (cell) {

			var n = parseInt(cell);
			//if n is not a number (cell is empty) make a cell with a piece, add to data array and
			// increment file / column
			if (isNaN(n)) return makeCell(cell, rank, file++);

			//if it is a number, return an array of n number of empty cells
			return Array.apply(null, Array(n)).map(function (cell) {
				return makeCell(cell, rank, file++);
			});
		}));

	});

	//reverse evrythin within each rows and then reverse each roe itself
	if (b === Meteor.userId()) {
		data.reverse();
		data = data.map(function (row) {
			return row.reverse();
		});
	}
	//array of rows and each of those rows is an array of this cell notation that we have chosen
	return data;
}

/**
 * Create a cell object
 * @param val
 * @param rank
 * @param file
 * @returns {{piece: *, img: (*|string), cell: string}}
 */
function makeCell(val, rank, file) {
	return {
		piece: val,
		img: pieces[val] || '',
		//AN coordinance, e.g.: e5
		//conversion of column to AN notation
		//97 => 'a' + file / column number + row number
		cell: String.fromCharCode(97 + file) + rank
	};
}

/**
 * What is eventually stored in that "move" field is in "Portable Game Notation (PGN)"
 * so it is possible to set up the board where their have left off
 * @returns  an array of moves that have been made so far in a chess game ["Nf3", "d5", "g3", "c6", ...]
 */
function getMoves() {
	//new chess game
	var chess = new Chess();

	//load the chess game with the pgn set-up notation
	//get the current state of game from the database "moves" field (string in which we store the
	//state in PNG game notation)
	chess.load_pgn(getGame().moves);

	//chess.history() represents same moves except as an array, where each move is
	//an item in the array: e.g.: ["Nf3", "d5", "g3", "c6", ...]
	var moves = chess.history();

	//based on index only apply part of the moves array (from 0 to the moveIndex)
	if (Session.get('stepping')) {

		//catches the case when user clicks 'next' beyond all made moves in total
		if (moves.length < Session.get('moveIndex')) {
			Session.set('moveIndex', moves.length);
		}
		
		moves = moves.slice(0, Session.get('moveIndex'))
	}

	return moves;
}

Template.stepper.helpers({

	canStep: function (result) {
		return result && !Session.get('stepping');
	},
	stepping: function () {
		return Session.get('stepping');
	}
});

Template.stepper.events({
	'click #step': function (evt) {
		Session.set('stepping', true);
		Session.set('moveIndex', 0);
	},
	'click #prev': function (evt) {
		var idx = Session.get('moveIndex');
		Session.set('moveIndex', idx <= 0 ? 0 : idx - 1);
	},
	'click #next': function (evt) {
		Session.set('moveIndex', Session.get('moveIndex') + 1);
	}
});