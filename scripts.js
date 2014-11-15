// var game.grid = [];

$(function() {
	game.$game = $('#game');
	$.each(['#interval', '#size', '#threshold'], function(i, v) {
		game.setDisplayValue($(v));
	})
	$('#start').click(function(e) {
		game.begin();
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

	$('#game').click(function(e) {
		var $target = $(e.target);
		//// click in cell
		if ($target.hasClass('cell')) {
			var id = $target.attr('id');
			var regex = /cell_(\d+)-(\d+)/;
			var i = id.replace(regex, "$1");
			var j = id.replace(regex, "$2");
			game.grid[i][j] = (game.grid[i][j] == 1) ? 0 : 1;
			(game.grid[i][j] == 1) ? 
				$target.addClass('on') : 
				$target.removeClass('on');
		}
	})
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
				newgrid[i][j] = game.getStatus(game.grid[i][j], alive);
			}
		}
		for (var i = 0; i < size; i++) {
			for (var j = 0; j < size; j++) {
				var $cell = $('#cell_'+i+'-'+j);
				if (newgrid[i][j]) $cell.addClass('on');
				else $cell.removeClass('on');
			}
		}
		game.grid = newgrid;
	},
	begin: function(callback) {
		var callback = callback || game.play;
		game.$game.html("");
		game.grid = [];
		game.settings.interval = $('#interval').val();
		game.settings.threshold = $('#threshold').val();
		var size = game.settings.size = $('#size').val();
		(size > 150) ? 
			game.$game.addClass('mini') : 
			game.$game.removeClass('mini');
		for (var i = 0; i < size; i++) {
			var $row = $('<div class="row"></div>');
			game.grid[i] = [];
			for (var j = 0; j <  size; j++) {
				var on = (Math.random() >= game.settings.threshold) ? 1 : 0;
				game.grid[i].push(on);
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
			
		return game.grid[i][jm1] +		//// top
				game.grid[ip1][jm1] + 
				game.grid[ip1][j] + 		//// right
				game.grid[ip1][jp1] + 
				game.grid[i][jp1] +		//// bottom
				game.grid[im1][jp1] +
				game.grid[im1][j] +		//// left
				game.grid[im1][jm1];
	},
	setDisplayValue: function($rangeField) {
		var $value = $('label[for="'+$rangeField.attr('id')+'"]').find('.value');
		$value.html(' ('+$rangeField.val()+')');
	} 
}