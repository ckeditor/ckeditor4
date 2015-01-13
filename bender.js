/* jshint browser: false, node: true */

'use strict';

var config = {

	applications: {
		ckeditor: {
			path: '.',
			files: [
				'ckeditor.js'
			]
		}
	},

	framework: 'yui',

	plugins: [
		'benderjs-yui',
		'benderjs-sinon',
		'benderjs-jquery',
		'tests/_benderjs/ckeditor'
	],

	tests: {
		'Adapters': {
			applications: [ 'ckeditor' ],
			basePath: 'tests/',
			paths: [
				'adapters/**',
				'!**/_*/**'
			],
			// Latest of the old API (1.8.3)
			// Latest of the 1.* branch
			// Latest of the 2.* branch
			jQuery: [ '1.8.3', '1.11.1', '2.1.1' ]
		},

		'Core': {
			applications: [ 'ckeditor' ],
			basePath: 'tests/',
			paths: [
				'core/**',
				'!**/_*/**'
			],
			regressions: {
				// IE8 (#11242)
				'tests/core/style/editor#test apply inline style on non-editable inline element - at non-editable inline boundary': 'env.ie && env.version == 8',
				'tests/core/style/editor#test remove inline style from non-editable inline element - at non-editable inline boundary': 'env.ie && env.version == 8',

				// IE8 (fails only in testing env - window.window === window gives false)
				'tests/core/tools#test_clone_Window': 'env.ie && env.version == 8',

				// Safari (#11980)
				'tests/core/editable/keystrokes/delbackspacequirks/collapsed#test backspace #2': 'env.safari',
				'tests/core/editable/keystrokes/delbackspacequirks/collapsed#test backspace #3': 'env.safari',
				'tests/core/editable/keystrokes/delbackspacequirks/collapsed#test backspace #9': 'env.safari',
				'tests/core/editable/keystrokes/delbackspacequirks/collapsed#test backspace, merge #2': 'env.safari',
				'tests/core/editable/keystrokes/delbackspacequirks/collapsed#test backspace, merge #3': 'env.safari',
				'tests/core/editable/keystrokes/delbackspacequirks/collapsed#test backspace, merge #8': 'env.safari'
			}
		},

		'Plugins': {
			applications: [ 'ckeditor' ],
			basePath: 'tests/',
			paths: [
				'plugins/**',
				'!**/_*/**'
			],
			regressions: {
				// IE10
				'tests/plugins/ajax/ajax#test_loadXml_sync': 'env.ie && env.version > 9',
				'tests/plugins/ajax/ajax#test_loadXml_async': 'env.ie && env.version > 9',

				// IE8 (#11242)
				'tests/plugins/indent/indent#test indent next to inline non-editable': 'env.ie && env.version == 8',

				// IE8 (#11055)
				'tests/plugins/widget/nestededitables#test pasting widget which was copied (d&d) when its nested editable was focused': 'env.ie && env.version == 8',

				// Firefox (#11399)
				'tests/plugins/widget/nestededitables#test selection in nested editable is preserved after opening and closing dialog - inline editor': 'env.gecko',

				// https://bugzilla.mozilla.org/show_bug.cgi?id=911201
				'tests/plugins/magicline/widgets#test commands[previous], first block in nested': 'env.gecko',
				'tests/plugins/magicline/widgets#test commands[next], block after block in nested': 'env.gecko',
				'tests/plugins/magicline/widgets#test commands[previous], block before block in nested': 'env.gecko',
				'tests/plugins/magicline/widgets#test commands[next], last block in nested': 'env.gecko',

				// Safari (#12690)
				'tests/plugins/font/font#test apply font size over another font size (deeply nested collapsed selection)': 'env.safari'
			}
		},

		'External Plugins': {
			applications: [ 'ckeditor' ],
			basePath: 'plugins/',
			paths: [
				'*/tests/**',
				'!**/_*/**'
			]
		},

		'Tickets': {
			applications: [ 'ckeditor' ],
			basePath: 'tests/',
			paths: [
				'tickets/**',
				'!**/_*/**'
			],
			regressions: {
				// IE8 & IE9 have problems with loading iframe.
				'tests/tickets/11121/1#test HC detection in hidden iframe': 'env.ie && env.version < 10'
			}
		},

		'Utils': {
			applications: [ 'ckeditor' ],
			basePath: 'tests/',
			paths: [
				'utils/**',
				'!**/_*/**'
			]
		}
	}
};

module.exports = config;
