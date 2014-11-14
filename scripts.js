var size = 20;
var threshold = 0.5;
var interval = 500;
var grid = [];
var max = 100;
var count = 0;

$(function() {
	var $game = $('#game');
	
	for (var i = 0; i < size; i++) {
		var $row = $('<div class="row"></div>');
		grid[i] = [];
		for (var j = 0; j <  size; j++) {
			var on = Math.random() >= threshold;
			grid[i].push(on);
			var clazz = (on) ? 'on' : 'off';
			$row.append('<div class="cell '+clazz+'" id="cell_'+i+'-'+j+'"></div>');
		}
		$game.append($row);
	}
	// console.log(grid);
	setTimeout(game.play, interval);
	// game.play();
});

var game =  {
	play: function() {
		console.log('playing');
		var newgrid = [];
		for (var i = 0; i  < size; i++) {
			newgrid[i] = [];
			for (var j = 0; j < size; j++) {
				var counts = game.getCounts(i, j);
				// console.log(grid[i][j], counts);
				newgrid[i][j] = game.getStatus(grid[i][j], counts);
			}
		}
		for (var i = 0; i < size; i++) {
			for (var j = 0; j < size; j++) {
				var clazz = (newgrid[i][j]) ? 'on' : 'off';
				var $cell = $('#cell_'+i+'-'+j);
				$cell.removeClass('on off');
				$cell.addClass(clazz);				
			}
		}
		grid = newgrid;
		count++;
		if (count < max) {
			setTimeout(game.play, interval);	
		}
		
	},
	getStatus: function(stat, counts) {
		if (stat) {
			if (counts.on < 2 || counts.on > 3) return false;
		} else {
			if (counts.on == 3) return true;
		}
		return stat;
	},
	getCounts: function(i, j) {
		var neighbors = [];
		if (i > 0) {
			var it = i - 1;
			neighbors.push(grid[it][j]);
			if (j > 0) neighbors.push(grid[it][j-1]);
			if (j < size-1) neighbors.push(grid[it][j+1]);
		}
		if (i < size-1) {
			var it = i+1;
			neighbors.push(grid[it][j]);
			if (j > 0) neighbors.push(grid[it][j-1]);
			if (j < size-1) neighbors.push(grid[it][j+1]);
		}		
		if (j > 0) neighbors.push(grid[i][j-1]);	
		if (j < size-1) neighbors.push(grid[i][j+1]);
		var counts = {
			on: 0,
			off: 0
		}
		for (var i = 0; i < neighbors.length; i++) {
			if (neighbors[i]) {
				counts.on++;
			} else {
				counts.off++;
			}
		}
		return counts;
	}
}