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
	],
	extraAllowedContent = '';

	CKEDITOR.tools.array.forEach( elements, function( item ) {
		var customTag = item;
		extraAllowedContent += customTag + '[*]{*}(*);' + customTag + 'foo' + '[*]{*}(*);';
	} );

	bender.editor = {
		config: {
			extraAllowedContent: extraAllowedContent,
			autoParagraph: false
		}
	};

	bender.test( {
		// (#988)
		'test allowed custom tags': assertHtmlDataProcessor( {
			data: '<objectfoo data-foo="bar">objectfoo</objectfoo>' +
				'<embedfoo data-foo="bar">embedfoo</embedfoo>' +
				'<paramfoo data-foo="bar">paramfoo</paramfoo>' +
				'<htmlfoo data-foo="bar">htmlfoo</htmlfoo>' +
				'<headfoo data-foo="bar">headfoo</headfoo>' +
				'<bodyfoo data-foo="bar">bodyfoo</bodyfoo>' +
				'<titlefoo data-foo="bar">titlefoo</titlefoo>',

			expected: '<objectfoo data-foo="bar">objectfoo</objectfoo>' +
				'<embedfoo data-foo="bar">embedfoo</embedfoo>' +
				'<paramfoo data-foo="bar">paramfoo</paramfoo>' +
				'<htmlfoo data-foo="bar">htmlfoo</htmlfoo>' +
				'<headfoo data-foo="bar">headfoo</headfoo>' +
				'<bodyfoo data-foo="bar">bodyfoo</bodyfoo>' +
				'<titlefoo data-foo="bar">titlefoo</titlefoo>'
		} ),

		// (#988)
		'test not allowed custom tags': assertHtmlDataProcessor( {
			data: '<objectbar data-bar="foo">objectbar</objectbar>' +
					'<embedbar data-bar="foo">embedbar</embedbar>' +
					'<parambar data-bar="foo">parambar</parambar>' +
					'<htmlbar data-bar="foo">htmlbar</htmlbar>' +
					'<headbar data-bar="foo">headbar</headbar>' +
					'<bodybar data-bar="foo">bodybar</bodybar>' +
					'<titlebar data-bar="foo">titlebar</titlebar>',

			expected: 'objectbarembedbarparambarhtmlbarheadbarbodybartitlebar'
		} ),

		// (#988)
		'test protected element names': assertHtmlDataProcessor( {
			data: '<object data-bar="foo">object</object>' +
				'<embed data-bar="foo"></embed>' +
				'<param data-bar="foo"/>' +
				'<html data-bar="foo">html</html>' +
				'<head data-bar="foo">head</head>' +
				'<body data-bar="foo">body</body>' +
				'<title data-bar="foo">title</title>',

			expected: '<object data-bar="foo">object</object>' +
				'<embed data-bar="foo"></embed>' +
				'<param data-bar="foo" />' +
				'htmlheadbody' +
				'<title data-bar="foo"></title>'
		} )
	} );

	function assertHtmlDataProcessor( config ) {
		return function() {
			var editor = this.editor,
				bot = this.editorBot;

			bot.setData( config.data, function() {
				assert.areEqual( config.expected, editor.getData() );
			} );
		};
	}
} )();
