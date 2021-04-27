/* bender-tags: editor */

// Basic definitions
// 3-HEX -> hexadecimal color with only 3 characters value: #FFF
// 4-HEX -> hexadecimal color with exactly 4 characters value: #FFF0. Last character is for alpha
// 6-HEX -> hexadecimal color with exactly 6 characters value: #FFFFFF
// 8-HEX -> hexadecimal color with exactly 8 characters value: #FFFFFF00. Last two characters are for alpha
// n-HEX-like -> n-HEX format without the hash at the beginning: FFF, FFF0, FFFFFF, FFFFFF00

( function() {
	'use strict';

	bender.test( {
		// (#4597)
		'test saving data about color type and both RGB and HSL channels for HSL color': function() {
			var input = 'hsl( 100, 37%, 17% )',
				color = new CKEDITOR.tools.color( input );

			assert.areSame( CKEDITOR.tools.color.TYPE_HSL, color._.type, 'Color type is not correctly set to HSL' );

			assert.areSame( 38, color._.red, 'Red data is not saved.' );
			assert.areSame( 59, color._.green, 'Green data is not saved.' );
			assert.areSame( 27, color._.blue, 'Blue data is not saved.' );

			assert.areSame( 100, color._.hue, 'Hue data is not saved.' );
			assert.areSame( 37, color._.saturation, 'Saturation data is not saved.' );
			assert.areSame( 17, color._.lightness, 'Lightness data is not saved.' );
		},

		// (#4597)
		'test saving data about color type and RGB channels for RGB color': function() {
			var input = 'rgb( 124, 54, 33 )',
				color = new CKEDITOR.tools.color( input );

			assert.areSame( CKEDITOR.tools.color.TYPE_RGB, color._.type, 'Color type is not correctly set to RGB.' );

			assert.areSame( 124, color._.red, 'Red data is not saved' );
			assert.areSame( 54, color._.green, 'Green data is not saved' );
			assert.areSame( 33, color._.blue, 'Blue data is not saved' );

			assert.areSame( 0, color._.hue, 'Hue data is not saved.' );
			assert.areSame( 0, color._.saturation, 'Saturation data is not saved.' );
			assert.areSame( 0, color._.lightness, 'Lightness data is not saved.' );
		},

		// (#4597)
		'test saving data about color type and RGB channels for hex color': function() {
			var input = '#FF00FF',
				color = new CKEDITOR.tools.color( input );

			assert.areSame( CKEDITOR.tools.color.TYPE_RGB, color._.type, 'Color type is not correctly set to RGB.' );

			assert.areSame( 255, color._.red, 'Red data is not saved.' );
			assert.areSame( 0, color._.green, 'Green data is not saved.' );
			assert.areSame( 255, color._.blue, 'Blue data is not saved.' );

			assert.areSame( 0, color._.hue, 'Hue data is not saved.' );
			assert.areSame( 0, color._.saturation, 'Saturation data is not saved.' );
			assert.areSame( 0, color._.lightness, 'Lightness data is not saved.' );
		},

		// (#4597)
		'test saving data about color type and RGB channels for hex color without hash': function() {
			var input = 'FF00FF',
				color = new CKEDITOR.tools.color( input );

			assert.areSame( CKEDITOR.tools.color.TYPE_RGB, color._.type, 'Color type is not correctly set to RGB.' );

			assert.areSame( 255, color._.red, 'Red data is not saved.' );
			assert.areSame( 0, color._.green, 'Green data is not saved.' );
			assert.areSame( 255, color._.blue, 'Blue data is not saved.' );

			assert.areSame( 0, color._.hue, 'Hue data is not saved.' );
			assert.areSame( 0, color._.saturation, 'Saturation data is not saved.' );
			assert.areSame( 0, color._.lightness, 'Lightness data is not saved.' );
		}
	} );

} )();
