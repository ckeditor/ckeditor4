/* bender-tags: editor */
( function() {
	'use strict';

	bender.test( {
		setUp: function() {
			this.createColor = function(colorCode) {
				return new CKEDITOR.tools.style.Color(colorCode);
			};
		},

		'test color object creation': function() {
			var colorObject = this.createColor('');

			assert.isObject(colorObject);
		},

		'test color return 6-HEX from 6-HEX string ignore letter-case': function() {
			var hexCode = '#ffffff';
			var expectedHex = '#FFFFFF';
			var colorObject = this.createColor(hexCode);

			var resultHex = colorObject.getHex();

			assert.areSame(expectedHex, resultHex);
		},

		'test color return 6-HEX from 3-HEX string ignore letter-case' : function(){
			var hexCode = '#fff';
			var expectedHexCode = '#FFFFFF';
			var colorObject = this.createColor(hexCode);

			var resultHex = colorObject.getHex();

			assert.areSame(expectedHexCode, resultHex);
		},

		'test color from 3 non defined color characters value string return 6-HEX': function() {
			var hexCode = 'fff';
			var expectedHexCode = '#FFFFFF';
			var colorObject = this.createColor(hexCode);

			var resultHex = colorObject.getHex();

			assert.areSame(expectedHexCode, resultHex);
		}
	});

} )();
