/* bender-tags: embed */
/* bender-ckeditor-plugins: embedbase,embed,toolbar,htmlwriter,undo,sourcearea */

( function() {
	'use strict';

	var widgetHtml = CKEDITOR.document.findOne( '#widget-html' ).getValue(),
			response = {
				url: 'https://twitter.com/reinmarpl/status/573118615274315776',
				html: widgetHtml
			},
		iframeHtml = '<iframe width="100%" height="300" frameborder="0"></iframe>',
		data = getDowncastedHtml( response.html, response.url );

	bender.editor = {
		config: {
			on: {
				instanceReady: function() {
					this.widgets.registered.embed._cacheResponse( response.url, response );
				}
			}
		}
	};

	bender.test( {
		'test widget with attr "data-restore-html" has it\'s html restored on downcast': function() {
			var editor = this.editor;

			this.editorBot.setData( data, function() {
				assert.beautified.html( data, editor.getData() );
			} );
		},

		'test widget without attr "data-restore-html" preserves it\'s on downcast': function() {
			var editor = this.editor;

			this.editorBot.setData( data, function() {
				var element = editor.editable().findOne( '[data-restore-html]' ),
					expected = getDowncastedHtml( iframeHtml, response.url );

				element.removeAttribute( 'data-restore-html' );
				element.setHtml( iframeHtml );

				assert.beautified.html( expected, editor.getData() );
			} );
		},

		'test appendIframe': function() {
			if ( CKEDITOR.env.ie ) {
				assert.ignore();
			}

			var editor = this.editor;

			this.editorBot.setData( data, function() {
				var element = editor.editable().findOne( '[data-restore-html]' ),
					widget = editor.widgets.getByElement( element );

				element.setHtml( '' );

				widget.appendIframe().then( function() {
					resume( function() {
						assert.beautified.html( iframeHtml, element.getHtml() );
					} );
				} );

				wait();
			} );
		},

		'test iframe contents after changing modes': function() {
			if ( CKEDITOR.env.ie ) {
				assert.ignore();
			}

			var editor = this.editor;

			this.editorBot.setData( data, function() {
				var contents = getIframeContents( editor.editable().findOne( 'iframe' ) );

				editor.setMode( 'source' );

				assertIframeContents( editor, contents );

				editor.setMode( 'wysiwyg' );
				wait();
			} );
		},

		'test iframe contents after undo/redo': function() {
			if ( CKEDITOR.env.ie ) {
				assert.ignore();
			}

			var editor = this.editor;

			this.editorBot.setData( data, function() {
				var contents = getIframeContents( editor.editable().findOne( 'iframe' ) );

				whenDataReady( editor, function() {
					assertIframeContents( editor, contents );

					editor.execCommand( 'redo' );
				} );

				editor.execCommand( 'undo' );

				wait();
			} );
		},

		'test iframe contents when identical widget is inserted': function() {
			if ( CKEDITOR.env.ie ) {
				assert.ignore();
			}

			var editor = this.editor;

			var bot = this.editorBot;

			bot.setData( data, function() {
				var contents = getIframeContents( editor.editable().findOne( 'iframe' ) );

				editor.setData( '' );

				assertIframeContents( editor, contents );

				editor.setData( data );

				wait();
			} );
		}
	} );

	function assertIframeContents( editor, contents ) {
		whenDataReady( editor, function() {
			resume( function() {
				var newContents = getIframeContents( editor.editable().findOne( 'iframe' ) );

				CKEDITOR.tools.array.forEach( newContents, function( item, index ) {
					assert.isTrue( item.equals( contents[ index ] ) );
				} );
			} );
		} );
	}

	function whenDataReady( editor, callback ) {
		editor.once( 'dataReady', function() {
			setTimeout( callback );
		} );
	}

	function getIframeContents( iframe ) {
		return iframe.getFrameDocument().getDocumentElement().getChildren().toArray();
	}

	function getDowncastedHtml( innerHtml, url ) {
		return '<div data-oembed-url="' + url + '">' + innerHtml + '</div>';
	}
} )();
