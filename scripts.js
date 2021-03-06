$(function() {
	game.init();
	//// controls
	$('#start').click(function(e) {
		game.begin();
		return false;
	});
	$('#stop').click(function(e) {
		game.end();
		return false;
	});
	$('#pause').click(function(e) {
		if (game.$grid.html() != '') {
			(game.runner == null) ? game.start() : game.stop();	
		}
		return false;
	});

	//// #interval
	game.$fields.interval.change(function(e) {
		game.updateRange($(this));
		if (game.$grid.html() != '' && game.runner != null) {
			game.stop();
			game.start();
		}
	});
	//// #size
	game.$fields.size.change(function(e) {
		game.updateRange($(this));
	});	
	//// #threshold
	game.$fields.threshold.change(function(e) {
		game.updateRange($(this));
	});

	//// #grid
	game.$grid.click(function(e) {
		var $target = $(e.target);
		//// click in cell
		if ($target.hasClass('cell')) {
			game.toggleCell($target);
		}
	});
});



var game =  {
	runner: null,		//// setInterval pointer
	$grid: null,		//// grid div dom object
	grid: [],			//// internal grid representation TODO: look into elimiating?
	$cells: null,		//// array of cell dom objects
	settings: {
		size: null,		//// size of grid	
		threshold: null,//// random threshold	
		interval: null, //// delay between iterations
	},
	$fields: null,		//// references to field dom object
	$rangevalues: {},
	fieldsets: null,	//// sets of field objects by type
	regex: {
		toggleCell: /cell_(\d+)-(\d+)/
	},
	init: function() {
		//// initialize $fields
		game.$fields = {
			size: $('#size'),
			threshold: $('#threshold'),
			interval: $('#interval')
		};		
		//// initialize fieldsets
		game.fieldsets = {
			setup: [game.$fields.size, game.$fields.threshold ],
			interactive: [game.$fields.interval]
		};
		game.fieldsets.all = game.fieldsets.setup.concat(game.fieldsets.interactive);
		//// initialize $grid
		game.$grid = $('#grid');
		//// set initial range values
		$.each(game.fieldsets.all, function(i, v) {
			var id = v.attr('id');
			game.$rangevalues[id] = $('label[for="'+id+'"]').find('.value');
			game.updateRange(v);

		});	
		//// in case browser caches diabled attribute on refresh
		$.each(game.fieldsets.setup, function(i, v) {
			v.prop('disabled', false);
		});

	},
	
	play: function() {
		var newgrid = [],
			size = game.settings.size;
		//// build new grid
		for (var x = 0; x  < size; x++) {
			newgrid.push([]);
			for (var y = 0; y < size; y++) {
				var active = game.getActive(x, y);
				newgrid[x].push(game.getStatus(game.grid[x][y], active));
			}
		}
		//// update $grid
		game.$cells.each(function(index) {
			var c = game.getCoordinates($(this));
			if (newgrid[c.x][c.y] === 1) $(this).addClass('active');
			else $(this).removeClass('active');			
		});
		//// update grid
		game.grid = newgrid;
	},
	begin: function(callback) {
		var callback = callback || game.play;
		//// reset grid
		game.$grid.html("");
		game.grid = [];
		//// initialize settings
		$.each(game.fieldsets.all, function(i, v) {
			var key = v.attr('id');
			game.settings[key] = v.val();
		});
		var size = game.settings.size;
		//// disable setup fields
		$.each(game.fieldsets.setup, function(i, v) {
			v.prop('disabled', true);
			v.parent().addClass('disabled');
		});
		//// smaller cells for large grids
		(size > 150) ? 
			game.$grid.addClass('mini') : 
			game.$grid.removeClass('mini');
		//// build grid and $grid
		for (var x = 0; x < size; x++) {
			var $row = $('<div class="row"></div>');
			game.grid.push([]);
			for (var y = 0; y <  size; y++) {
				var active = (Math.random() >= game.settings.threshold) ? 1 : 0;
				game.grid[x].push(active);
				var classes = 'cell';
				if (active) classes += ' active';
				$row.append('<div class="'+classes+'" id="cell_'+x+'-'+y+'"></div>');
			}
			game.$grid.append($row);
		}
		game.$cells = $('.cell');
		//// start game
		game.start();
	},
	end: function() {
		game.stop();
		game.$grid.html('');
		game.$cells = null;
		$.each(game.fieldsets.setup, function(i, v) {
			v.prop('disabled', false);
			v.parent().removeClass('disabled');
		});
				
	},
	start: function(callback) {
		var callback = callback || game.play;
		game.runner = window.setInterval(game.play, game.settings.interval);
	},
	stop: function() {
		window.clearInterval(game.runner);
		game.runner = null;
	},
	getStatus: function(stat, active) {
		if (stat && active < 2 || active > 3) return 0;
		if (!stat && active == 3) return 1;
		return stat;
	},
	getActive: function(x, y) {
		var ym1 = (y == 0) ? game.settings.size-1 : y-1,	//// y-1 top
			xp1 = (x+1)%game.settings.size,				//// x+1 right
			yp1 = (y+1)%game.settings.size,				//// y+i bottom
			xm1 = (x == 0) ? game.settings.size-1 : x-1;	//// x-1 left
			
		return game.grid[x][ym1] +		//// top
				game.grid[xp1][ym1] + 
				game.grid[xp1][y] + 		//// right
				game.grid[xp1][yp1] + 
				game.grid[x][yp1] +		//// bottom
				game.grid[xm1][yp1] +
				game.grid[xm1][y] +		//// left
				game.grid[xm1][ym1];
	},
	updateRange: function($range) {

		//// update setting
		var id = $range.attr('id');
		// console.log('updating range '+id+' '+$range.val(), $range.prop('value'));
		game.settings[id] = $range.val();
		//// update value display
		var $value = game.$rangevalues[id];
		$value.html(' ('+$range.val()+')');
	},
	toggleCell: function($target) {
		var c = game.getCoordinates($target);
		game.grid[c.x][c.y] = (game.grid[c.x][c.y] == 1) ? 0 : 1;
		(game.grid[c.x][c.y] == 1) ? 
			$target.addClass('active') : 
			$target.removeClass('active');
	},
	getCoordinates: function($cell) {
		var id = $cell.attr('id'),
			regex = game.regex.toggleCell;
		return {
			x: id.replace(regex, "$1"),
			y: id.replace(regex, "$2")
		};

	}
}