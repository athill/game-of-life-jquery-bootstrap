var grid = [];

$(function() {
	game.$game = $('#game');
	$.each(['#interval', '#size', '#threshold'], function(i, v) {
		game.setDisplayValue($(v));
	})
	$('#start').click(function(e) {
		test = game.begin();
		return false;
	});
	$('#stop').click(function(e) {
		game.stop();
		return false;
	});
	$('#pause').click(function(e) {
		if (game.$game.html() != '') {
			(game.runner == null) ? game.start() : game.stop();	
		}
		return false;
	});
	$('#interval').change(function(e) {
		game.settings.interval = $('#interval').val();
		game.setDisplayValue($(this));
		if (game.$game.html() != '') {
			game.stop();
			game.start();
		}
	});
	$('#size').change(function(e) {
		game.settings.size = $('#size').val();
		game.setDisplayValue($(this));
	});	
	$('#threshold').change(function(e) {
		game.settings.threshold = $('#threshold').val();
		game.setDisplayValue($(this));
	});		
});

var game =  {
	runner: null,
	$game: null,
	grid: [],
	settings: {
		size: 20,
		threshold: 0.5,
		interval: null,
		
	},
	play: function() {
		var newgrid = [];
		var size = game.settings.size;
		for (var i = 0; i  < size; i++) {
			newgrid[i] = [];
			for (var j = 0; j < size; j++) {
				var alive = game.getAlive(i, j);
				newgrid[i][j] = game.getStatus(grid[i][j], alive);
			}
		}
		for (var i = 0; i < size; i++) {
			for (var j = 0; j < size; j++) {
				var $cell = $('#cell_'+i+'-'+j);
				if (newgrid[i][j]) $cell.addClass('on');
				else $cell.removeClass('on');
			}
		}
		grid = newgrid;
	},
	begin: function(callback) {
		var callback = callback || game.play;
		game.$game.html("");
		grid: [];
		game.settings.interval = $('#interval').val();
		game.settings.threshold = $('#threshold').val();
		game.settings.size = $('#size').val();
		for (var i = 0; i < game.settings.size; i++) {
			var $row = $('<div class="row"></div>');
			grid[i] = [];
			for (var j = 0; j <  game.settings.size; j++) {
				var on = (Math.random() >= game.settings.threshold) ? 1 : 0;
				grid[i].push(on);
				var classes = 'cell';
				if (on) classes += ' on';
				$row.append('<div class="'+classes+'" id="cell_'+i+'-'+j+'"></div>');
			}
			game.$game.append($row);
		}
		game.start();
	},
	start: function(callback) {
		var callback = callback || game.play;

		game.runner = window.setInterval(game.play, game.settings.interval);
	},
	stop: function() {
		window.clearInterval(game.runner);
		game.runner = null;
	},
	getStatus: function(stat, alive) {
		if (stat && alive < 2 || alive > 3) return 0;
		if (!stat && alive == 3) return 1;
		return stat;
	},
	getAlive: function(i, j) {
		var jm1 = (j == 0) ? game.settings.size-1 : j-1;	//// j-1 top
		var ip1 = (i+1)%game.settings.size;				//// i+1 right
		var jp1 = (j+1)%game.settings.size;				//// j+i bottom
		var im1 = (i == 0) ? game.settings.size-1 : i-1;	//// i-1 left
			
		return grid[i][jm1] +		//// top
				grid[ip1][jm1] + 
				grid[ip1][j] + 		//// right
				grid[ip1][jp1] + 
				grid[i][jp1] +		//// bottom
				grid[im1][jp1] +
				grid[im1][j] +		//// left
				grid[im1][jm1];
	},
	setDisplayValue: function($rangeField) {
		var $value = $('label[for="'+$rangeField.attr('id')+'"]').find('.value');
		$value.html(' ('+$rangeField.val()+')');
	} 
}