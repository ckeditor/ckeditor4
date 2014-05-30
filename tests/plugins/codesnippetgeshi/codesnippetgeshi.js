/* bender-tags: editor,unit,widget */
/* bender-ckeditor-plugins: codesnippet,codesnippetgeshi,toolbar */

( function() {
	'use strict';

	bender.editor = {
		config: {
			codeSnippetGeshi_url: 'myCustomGeshi/colorize.php',
			codeSnippet_codeClass: 'geshi'
		}
	};

	var obj2Array = widgetTestsTools.obj2Array,
		html = '<pre><code class="language-php">foo</code></pre>';

	function fixHtml( html ) {
		return bender.tools.compatHtml( bender.tools.fixHtml( html, true, true, true ), true, true, true );
	}

	bender.test( {
		'test ajax querying': function() {
			var editor = this.editor,
				originalAjax = CKEDITOR.ajax.post,
				ajaxCalled = 0,
				ajaxData,
				ajaxContentType,
				ajaxUrl;

			// Override post, we need to do it at first highlighter call,
			// we can't do it before setData, because it gets overriden
			// at some point in editorBot#setData.
			CKEDITOR.ajax.post = function( url, data, contentType, callback ) {
				var unserializedData = JSON.parse( data );
				ajaxCalled++;
				ajaxUrl = url;
				ajaxData = unserializedData;
				ajaxContentType = contentType;

				callback( '<pre>foo<strong>bar</strong></pre>' );
			};

			// Closing in try/catch because we need to retreive original post and
			// highlighter functions in any case. It's done in finally block.
			try {
				this.editorBot.setData( html, function() {
					var widget = obj2Array( this.editor.widgets.instances )[ 0 ],
						expectedHtml = fixHtml( '<code class="language-php geshi">foo<strong>bar</strong></code>' );

					assert.areSame( 1, ajaxCalled, 'Invalid count of calls to CKEDITOR.ajax#post' );
					assert.isTrue( ajaxUrl.indexOf( 'myCustomGeshi/colorize.php' ) > -1, 'queried URL does not match to expected pattern' );
					assert.areSame( 'php', ajaxData.lang, 'Invalid data.lang value in json' );
					assert.areSame( 'foo', ajaxData.html, 'Invalid data.html value in json' );
					assert.areSame( 'application/json', ajaxContentType, 'Invalid content type given to CKEDITOR.ajax#post' );

					// Checking html produced in pre element.
					assert.areEqual( 'code', widget.element.getFirst().getName(), 'Invalid element placed directly inside pre' );
					assert.areEqual( expectedHtml, fixHtml( widget.element.getHtml() ), 'Invalid innerHtml' );

					restoreOriginalCallbacks();
				} );
			} catch ( e ) {
				if ( e instanceof YUITest.Wait == false )
					restoreOriginalCallbacks();
				// Propagate the exception.
				throw e;
			}

			function restoreOriginalCallbacks() {
				CKEDITOR.ajax.post = originalAjax;
			}
		},

		'test missing geshi URL': function() {
			// Ensures that no unhandled exception will be raised if geshi
			// URL is missing.
			var editorBotConfig = {
				name: 'editor2',
				creator: 'inline',
				config: {}
			};

			bender.editorBot.create( editorBotConfig, function( bot ) {
				bot.setData( html, function() {
					// If exception would have been thrown, then TC would automatically
					// be marked as failed.
					assert.isTrue( true );
				} );
			} );

		}
	} );
} )();