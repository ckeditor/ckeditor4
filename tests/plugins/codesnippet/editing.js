/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: codesnippet,toolbar */
/* global widgetTestsTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			autoParagraph: false,
			codeSnippet_codeClass: 'customClass'
		}
	};

	var objToArray = bender.tools.objToArray;

	bender.test( {
		'test edit with dialog: defined language, change language': function() {
			var bot = this.editorBot,
				code = '<?php foo(); bar(); ?>',
				html = '<pre><code class="language-php">' + CKEDITOR.tools.htmlEncode( code ) + '</code></pre>',
				expected = '<pre><code class="language-python">' + CKEDITOR.tools.htmlEncode( code ) + '</code></pre>';

			widgetTestsTools.assertWidgetDialog( bot, 'codeSnippet', html, 0, {
				lang: 'php',
				code: code
			}, null, function( dialog ) {
				dialog.setValueOf( 'info', 'lang', 'python' );
				dialog.getButton( 'ok' ).click();
				assert.areSame( expected, bot.getData() );
			} );
		},

		'test edit with dialog: undefined language, change language': function() {
			var bot = this.editorBot,
				code = '<?php foo(); bar(); ?>',
				html = '<pre><code>' + CKEDITOR.tools.htmlEncode( code ) + '</code></pre>',
				expected = '<pre><code class="language-python">' + CKEDITOR.tools.htmlEncode( code ) + '</code></pre>';

			widgetTestsTools.assertWidgetDialog( bot, 'codeSnippet', html, 0, {
				lang: '',
				code: code
			}, null, function( dialog ) {
				dialog.setValueOf( 'info', 'lang', 'python' );
				dialog.getButton( 'ok' ).click();
				assert.areSame( expected, bot.getData() );
			} );
		},

		'test edit with dialog: defined language, set undefined': function() {
			var bot = this.editorBot,
				code = 'foo bar',
				html = '<pre><code class="language-php">' + CKEDITOR.tools.htmlEncode( code ) + '</code></pre>',
				expected = '<pre><code>' + CKEDITOR.tools.htmlEncode( code ) + '</code></pre>';

			widgetTestsTools.assertWidgetDialog( bot, 'codeSnippet', html, 0, {
				lang: 'php',
				code: code
			}, null, function( dialog ) {
				dialog.setValueOf( 'info', 'lang', '' );
				dialog.getButton( 'ok' ).click();
				assert.areSame( expected, bot.getData() );
			} );
		},

		'test edit with dialog: change code': function() {
			var bot = this.editorBot,
				oldCode = '<?php foo(); bar(); ?>',
				newCode = '<?php &<> ?>',
				html = '<pre><code class="language-php">' + CKEDITOR.tools.htmlEncode( oldCode ) + '</code></pre>',
				expected = '<pre><code class="language-php">' + CKEDITOR.tools.htmlEncode( newCode ) + '</code></pre>';

			widgetTestsTools.assertWidgetDialog( bot, 'codeSnippet', html, 0, {
				lang: 'php',
				code: oldCode
			}, null, function( dialog ) {
				dialog.setValueOf( 'info', 'code', newCode );
				dialog.getButton( 'ok' ).click();
				assert.areSame( expected, bot.getData() );
			} );
		},

		'test create with dialog': function() {
			var bot = this.editorBot,
				newCode = '<?php &<> ?>',
				expected = '<p>f</p>' +
					'<pre><code class="language-php">' + CKEDITOR.tools.htmlEncode( newCode ) + '</code></pre>' +
				'<p>oo</p>';

			widgetTestsTools.assertWidgetDialog( bot, 'codeSnippet', '', null, null, '<p>f^oo</p>', function( dialog ) {
				dialog.setValueOf( 'info', 'lang', 'php' );
				dialog.setValueOf( 'info', 'code', newCode );
				dialog.getButton( 'ok' ).click();

				var widget = objToArray( bot.editor.widgets.instances )[ 0 ];

				assert.isTrue( widget.parts.code.hasClass( 'customClass' ), 'Code has codeSnippet_codeClass' );
				assert.areSame( expected, bot.getData(), 'Widget created.' );
			} );
		}
	} );
} )();
