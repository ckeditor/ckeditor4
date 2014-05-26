var config = {

	applications: {
		ckeditor: {
			path: '.',
			files: [
				'ckeditor.js'
			]
		}
	},

	assertion: 'yui',

	plugins: [
		'benderjs-yui',
		'benderjs-jquery',
		'benderjs-ckeditor'
	],

	tests: {
		'Adapters': {
			applications: [ 'ckeditor' ],
			basePath: 'tests/',
			paths: [
				'adapters/',
				'!/_'
			],
			jquery: [ '1.7', '1.7.2', '1.8.3', '1.9.1', '1.10.1', '2.0.0' ]
		},

		'Core': {
			applications: [ 'ckeditor' ],
			basePath: 'tests/',
			paths: [
				'core/',
				'!/_'
			],
			regressions: {
				'tests/core/dom/range/movetoelement#test_moveToElementEditStart4' : 'env.ie6Compat',
				'tests/core/dom/range#test enlarge element (HTML comments)' : 'env.ie6Compat',
				'tests/core/editable/wysiwyg#testFocus' : 'env.ie6Compat',
				'tests/core/style/editor#test apply inline style on non-editable inline element - at non-editable inline boundary': 'env.ie && env.version == 8',
				'tests/core/style/editor#test remove inline style from non-editable inline element - at non-editable inline boundary': 'env.ie && env.version == 8',
				'tests/core/dom/range/enlarge#test_enlarge_element12': 'env.safari'
			}
		},

		'Plugins': {
			applications: [ 'ckeditor' ],
			basePath: 'tests/',
			paths: [
				'plugins/',
				'!/_'
			],
			regressions: {
				'tests/plugins/image/image#test update image (remove)' : 'env.ie6Compat || env.ie7Compat || env.ie8Compat',
				'tests/plugins/magicline/magicline#middle-edge triggers' : 'env.ie6Compat',
				'tests/plugins/magicline/magicline#single-edge triggers' : 'env.ie6Compat',
				'tests/plugins/magicline/magicline#get size' : 'env.ie6Compat',
				'tests/plugins/magicline/magicline#is line' : 'env.ie6Compat',
				'tests/plugins/ajax/ajax#test_loadXml_sync' : 'env.ie && env.version > 9',
				'tests/plugins/ajax/ajax#test_loadXml_async' : 'env.ie && env.version > 9',
				'tests/plugins/indent/indent#test indent next to inline non-editable': 'env.ie && env.version == 8',
				'tests/plugins/widget/nestededitables#test pasting widget which was copied (d&d) when its nested editable was focused': 'env.ie && env.version == 8',
				'tests/plugins/widget/nestededitables#test selection in nested editable is preserved after opening and closing dialog - inline editor': 'env.gecko'
			}
		},

		'Tickets': {
			applications: [ 'ckeditor' ],
			basePath: 'tests/',
			paths: [
				'tickets/',
				'!/_'
			]
		}
	}
};

module.exports = config;
