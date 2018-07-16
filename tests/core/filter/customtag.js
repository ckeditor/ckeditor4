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
		var customTag = item + 'foo';
		extraAllowedContent += customTag + '[*]{*}(*);';
	} );

	bender.editor = {
		config: {
			extraAllowedContent: extraAllowedContent,
			autoParagraph: false
		}
	};

	bender.test( {
		'test allowed custom tags': function() {
			var editor = this.editor,
				bot = this.editorBot,
				data = '<objectfoo data-foo="bar">objectfoo</objectfoo>' +
					'<embedfoo data-foo="bar">embedfoo</embedfoo>' +
					'<paramfoo data-foo="bar">paramfoo</paramfoo>' +
					'<htmlfoo data-foo="bar">htmlfoo</htmlfoo>' +
					'<headfoo data-foo="bar">headfoo</headfoo>' +
					'<bodyfoo data-foo="bar">bodyfoo</bodyfoo>' +
					'<titlefoo data-foo="bar">titlefoo</titlefoo>';

			bot.setData( data, function() {
				assert.areEqual( data, editor.getData() );
			} );
		},
		'test not allowed custom tags': function() {
			var editor = this.editor,
				bot = this.editorBot,
				data = '<objectbar data-bar="foo">objectbar</objectbar>' +
					'<embedbar data-bar="foo">embedbar</embedbar>' +
					'<parambar data-bar="foo">parambar</parambar>' +
					'<htmlbar data-bar="foo">htmlbar</htmlbar>' +
					'<headbar data-bar="foo">headbar</headbar>' +
					'<bodybar data-bar="foo">bodybar</bodybar>' +
					'<titlebar data-bar="foo">titlebar</titlebar>';

			bot.setData( data, function() {
				assert.areEqual( 'objectbarembedbarparambarhtmlbarheadbarbodybartitlebar', editor.getData() );
			} );
		}
	} );
} )();
