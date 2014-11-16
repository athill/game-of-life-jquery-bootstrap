var $fixture = $('#qunit-fixture');
var valmap = {
	interval: 80,
	size: 40,
	threshold: 0.2
};
// QUnit.module( "tests", {
// 	setup: function() {
// 		// prepare something for all following tests
// 		var $form = $('<form id="controller"></form>');
// 		var ranges = ['interval', 'size', 'threshold'];
// 		for (var id in valmap) {
// 			$form.append('<label for="'+id+'"><span class="value"></span></label>');
// 			$form.append('<input type="range" id="'+id+'" value="'+valmap[id]+'"/>');
// 		}
// 		var buttons = ['start', 'stop', 'pause'];
// 		$.each(buttons, function(i, v) {
// 			$form.append('<button id="'+v+'"></button>');
// 		});
		
// 		$fixture.append($form);
// 		$fixture.append('<div id="grid"></div>');
// 		game.init();
// 	},
// 	teardown: function() {
// 		// clean up after each test
// 		$fixture.html('');
// 	}
// });

QUnit.test( "values update", function( assert ) {

	for (var id in valmap) {
		var $range = $('#'+id, $fixture);
		var value = (valmap[id]*.05)
		$range.val(value);
		
		console.log(id, game.settings[id], $range);
		// $('#'+id).change();
		assert.equal(game.settings[id], value, 'settings updated for '+id);
		assert.equal($('label[for="'+id+'"]').find('.value').html(), ' ('+value+')', 'display updated for '+id);
	}
});