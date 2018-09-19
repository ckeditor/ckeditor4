/* bender-tags: editor */

( function() {
	var elements = [
			'object',
			'embed',
			'param',
			'html',
			'head',
			'body',
			'title'
		];

	bender.editor = {
		config: {
			extraAllowedContent: elements.join( 'foo[*]{*}(*);' ) + 'foo[*]{*}(*);',
			autoParagraph: false
		}
	};

	bender.test( {
		// (#988)
		'test allowed custom tags': ( function() {
			var data = '<objectfoo data-foo="bar">objectfoo</objectfoo>' +
				'<embedfoo data-foo="bar">embedfoo</embedfoo>' +
				'<paramfoo data-foo="bar">paramfoo</paramfoo>' +
				'<htmlfoo data-foo="bar">htmlfoo</htmlfoo>' +
				'<headfoo data-foo="bar">headfoo</headfoo>' +
				'<bodyfoo data-foo="bar">bodyfoo</bodyfoo>' +
				'<titlefoo data-foo="bar">titlefoo</titlefoo>';

			return assertDataFormat( {
				data: data,
				expected: data
			} );
		} )(),

		// (#988)
		'test not allowed custom tags': assertDataFormat( {
			data: '<objectbar data-bar="foo">objectbar</objectbar>' +
				'<embedbar data-bar="foo">embedbar</embedbar>' +
				'<parambar data-bar="foo">parambar</parambar>' +
				'<htmlbar data-bar="foo">htmlbar</htmlbar>' +
				'<headbar data-bar="foo">headbar</headbar>' +
				'<bodybar data-bar="foo">bodybar</bodybar>' +
				'<titlebar data-bar="foo">titlebar</titlebar>',

			expected: 'objectbarembedbarparambarhtmlbarheadbarbodybartitlebar'
		} )
	} );

	function assertDataFormat( config ) {
		return function() {
			var editor = this.editor,
				bot = this.editorBot;

			bot.setData( config.data, function() {
				assert.areEqual( config.expected, editor.getData() );
			} );
		};
	}
} )();
