var size = 20;
var threshold = 0.5;
var interval = 50;
var grid = [];
var max = -1;
var count = 0;

$(function() {
	var $game = $('#game');
		grid = [];
		
		for (var i = 0; i < size; i++) {
			var $row = $('<div class="row"></div>');
			grid[i] = [];
			for (var j = 0; j <  size; j++) {
				var on = (Math.random() >= threshold) ? 1 : 0;
				grid[i].push(on);
				var classes = 'cell';
				if (on) classes += ' on';
				$row.append('<div class="'+classes+'" id="cell_'+i+'-'+j+'"></div>');
			}
			$game.append($row);
		}	

	// setTimeout(game.play, interval);
	$('#start').click(function(e) {
		// test = game.begin();
		game.runner = window.setInterval(game.play, interval);
		
		
		return false;
		console.log(interval);
	});
	$('#stop').click(function(e) {
		window.clearInterval(game.runner);
		return false;
	});
});

var game =  {
	runner: null,
	$game: null,
	grid: [],
	// rendering: false,
	settings: {
		size: 20,
		threshold: 0.5,
		interval: null,
		
	},
	play: function() {
		console.log('playing');
		var newgrid = [];
		for (var i = 0; i  < size; i++) {
			newgrid[i] = [];
			for (var j = 0; j < size; j++) {
				var alive = game.getAlive(i, j);
				newgrid[i][j] = game.getStatus(grid[i][j], alive);
			}
		}
		for (var i = 0; i < size; i++) {
			for (var j = 0; j < size; j++) {
				var clazz = (newgrid[i][j]) ? 'on' : 'off';
				var $cell = $('#cell_'+i+'-'+j);
				if (newgrid[i][j]) $cell.addClass('on');
				else $cell.removeClass('on');
				// $cell.removeClass('on off');
				// $cell.addClass(clazz);				
			}
		}
		grid = newgrid;
		console.log('?');
		// count++;
		// if (count < max || max < 0) {
		// 	setTimeout(game.play, interval);	
		// }
	},
	begin: function(callback) {
		// var callback = callback || game.play;
		// // game.rendering = true;
		// console.log('rendering');
		// for (var i = 0; i < size; i++) {
		// 	var $row = $('<div class="row"></div>');
		// 	grid[i] = [];
		// 	for (var j = 0; j <  size; j++) {
		// 		var on = (Math.random() >= threshold) ? 1 : 0;
		// 		grid[i].push(on);
		// 		var classes = 'cell';
		// 		if (on) classes += ' on';
		// 		$row.append('<div class="'+classes+'" id="cell_'+i+'-'+j+'"></div>');
		// 	}
		// 	$game.append($row);
		// }
		// game.runner = window.setInterval(game.play, interval);
	},
	getStatus: function(stat, alive) {
		if (stat && alive < 2 || alive > 3) return 0;
		if (!stat && alive == 3) return 1;
		return stat;
	},
	getAlive: function(i, j) {
		var ip1 = (i+1)%size;
		var jp1 = (j+1)%size;
		var im1 = (i == 0) ? size-1 : i-1;
		var jm1 = (j == 0) ? size-1 : j-1;
		return grid[i][jm1] +		//// top
				grid[ip1][jm1] + 
				grid[ip1][j] + 		//// right
				grid[ip1][jp1] + 
				grid[i][jp1] +		//// bottom
				grid[im1][jp1] +
				grid[im1][j] +		//// left
				grid[im1][jm1];
	}
}