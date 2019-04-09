/* bender-tags: balloontoolbar, context */
/* bender-ckeditor-plugins: balloontoolbar, toolbar, basicstyles, sourcearea */
/* bender-include: _helpers/tools.js */
/* global contextTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			extraAllowedContent: 'strong,em'
		}
	};

	bender.test( {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'balloontoolbar' );
		},

		tearDown: function() {
			this.editor.balloonToolbars._clear();
		},

		'test selectionChange with options.refresh': function() {
			var context = this.editor.balloonToolbars.create( {
					buttons: 'Bold,Italic,Underline',
					refresh: function( editor, path ) {
						return path.contains( 'em' );
					}
				} ),
				newRange = this.editor.createRange();

			this.editorBot.setHtmlWithSelection( '<p>Test^ <strong>Foo</strong><em>bar</em></p>' );

			// First set the selection in a place where Balloon Toolbar should not be shown.
			// Set range at <strong>F^oo</strong>.
			newRange.setStart( this.editor.editable().findOne( 'strong' ).getFirst(), 1 );
			newRange.collapse( true );

			this.editor.getSelection().selectRanges( [ newRange ] );

			contextTools._assertToolbarVisible( false, context );

			// Now, change the selection to a place that should show the toolbar.
			// For example: "<em>b^ar</em>".
			newRange.setStart( this.editor.editable().findOne( 'em' ).getFirst(), 1 );
			newRange.collapse( true );

			this.editor.getSelection().selectRanges( [ newRange ] );

			contextTools._assertToolbarVisible( true, context );

			context.destroy();
		},

		'test moving focus out of the editor hides the toolbar': function() {
			// Note: this test is verified to fail with testing window blurred (e.g. when dev console window focused).
			var context = this.editor.balloonToolbars.create( {
					buttons: 'Bold,Italic',
					refresh: sinon.stub().returns( true )
				} );

			this.editorBot.setHtmlWithSelection( '<p><strong>foo^bar</strong></p>' );

			contextTools._assertToolbarVisible( true, context );

			this.editor.once( 'blur', function() {
				resume( function() {
					contextTools._assertToolbarVisible( false, context, 'Toolbar visibility after blurring the editor' );
				} );
			}, this, null, 99999 );

			// Keep in mind that modern browsers will "debounce" the focus event, it will happen asynchronously.
			CKEDITOR.document.getById( 'focusHost' ).focus();

			wait();
		},

		'test invalid buttons wont break creation': function() {
			var context = this.editor.balloonToolbars.create( {
				buttons: 'foo!,Bold,Boldzzz,|',
				refresh: sinon.stub().returns( true )
			} );

			this.editorBot.setHtmlWithSelection( '<p><strong>foo^bar</strong></p>' );

			contextTools._assertToolbarVisible( true, context );

			arrayAssert.itemsAreSame( [ 'Bold' ], Object.keys( context.toolbar._items ) );
		},

		'test switching source mode hides the toolbar': function() {
			var initialMode = this.editor.mode;

			var context = this.editor.balloonToolbars.create( {
				buttons: 'Bold,Italic',
				refresh: sinon.stub().returns( true )
			} );

			this.editorBot.setHtmlWithSelection( '<p><strong>foo^bar</strong></p>' );

			contextTools._assertToolbarVisible( true, context );

			this.editor.setMode( 'source', function() {
				resume( function() {
					var storedException;

					try {
						contextTools._assertToolbarVisible( false, context, 'Toolbar visibility after switching to source area' );
					} catch ( e ) {
						// Propagate the exception. We can't just rethrow here... as  it's YUI and wait in finally block will... also
						// throw an exception, which will make our tests silently to pass :D
						// Thus exception need to be cached and thrown in the resume function.
						storedException = e;
					} finally {
						// In any case, set the mode back to initial editor mode.
						this.editor.setMode( initialMode, function() {
							resume( function() {
								if ( storedException ) {
									throw storedException;
								}
							} );
						} );

						wait();
					}
				} );
			} );

			wait();
		},

		'test correct highlighted element after overriding refresh': function() {
			// In this test a low priority refresh will hint to put the toolbar on element A.
			// However later on a cssSelector listener, will hint element B.
			// Make sure B is pointed by the toolbar.

			this.editorBot.setHtmlWithSelection( '<p><em>foo<strong>b^ar</strong>baz</em></p>' );

			this.editor.balloonToolbars.create( {
				buttons: 'Bold,Italic',
				refresh: sinon.stub().returns( this.editor.editable().findOne( 'p' ) ),
				priority: CKEDITOR.plugins.balloontoolbar.PRIORITY.LOW
			} );

			var cssContext = this.editor.balloonToolbars.create( {
					buttons: 'Bold,Italic',
					cssSelector: 'em'
				} ),
				showSpy = sinon.spy( cssContext, 'show' );

			this.editor.balloonToolbars.check();

			contextTools._assertToolbarVisible( true, cssContext );

			// Note can't be checked simply against this.editor.editable().findOne( '...' ) as it will be two different objects.
			sinon.assert.alwaysCalledWithMatch( showSpy, function( el ) {
				return el.getName() === 'em';
			} );
		},

		'test correct highlighted with refresh after widget was matched': function() {
			this.editorBot.setHtmlWithSelection( '<p><em>foo<strong>b^ar</strong>baz</em</p>' );

			var widgetContext = this.editor.balloonToolbars.create( {
					buttons: 'Bold,Italic'
				} ),
				refreshContext = this.editor.balloonToolbars.create( {
					buttons: 'Bold,Italic',
					// Since we're returning true, it should highlight default element, which is path's last element - a strong.
					refresh: sinon.stub().returns( true )
				} ),
				showSpy = sinon.spy( refreshContext, 'show' );

			// Also stub widget matcher for widgetContext, so that we don't have to go through all
			// the hassle of faking a widget.
			sinon.stub( widgetContext, '_matchWidget' ).returns( this.editor.editable().findOne( 'em' ) );

			this.editor.balloonToolbars.check();

			contextTools._assertToolbarVisible( true, refreshContext );

			// Note can't be checked simply against this.editor.editable().findOne( '...' ) as it will be two different objects.
			sinon.assert.alwaysCalledWithMatch( showSpy, function( el ) {
				return el.getName() === 'strong';
			} );
		}
	} );
} )();
