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
			jquery: [ '1.7', '1.7.2', '1.8.3', '1.9.1', '1.10.2', '2.0.0' ]
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
				'tests/core/editable/keystrokes/delbackspacequirks/collapsed#test backspace, merge #8': 'env.safari',

				// Firefox (#12104)
				'tests/core/editor/focus#test blur after setData': 'env.gecko'
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

				// Firefox (#12104)
				'tests/plugins/widget/widgetselection#test focusing widget': 'env.gecko',
				'tests/plugins/widget/widgetselection#test focusing by click': 'env.gecko',
				'tests/plugins/widget/widgetselection#test focus editor when focusing widget by click': 'env.gecko',
				'tests/plugins/widget/widgetselection#test focus editor when focusing widget by method': 'env.gecko'
			}
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