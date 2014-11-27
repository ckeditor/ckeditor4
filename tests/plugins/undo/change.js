/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: undo,basicstyles,toolbar,wysiwygarea */
/* global undoEventDispatchTestsTools */

( function() {
	'use strict';

	var waitingForChange = false;
	var changeCounter = 0;

	bender.editor = {
		startupData: '<p>foo</p>',
		config: {
			on: {
				change: function() {
					changeCounter++;
				}
			}
		}
	};

	bender.test( {
		checkChange: function( action ) {
			waitingForChange = true;

			bender.editor.focus();

			action( bender.editor );

			assert.areSame( 1, changeCounter, 'Invalid change calls count' );
		},

		setUp: function() {
			changeCounter = 0;
			// Inits tools used to mimic events if needed.
			if ( !this.tools ) {
				this.tools = undoEventDispatchTestsTools( this );
				// Alias for more convenient accesss.
				this.keyTools = this.tools.key;
			}
		},

		_should: {
			ignore: {
				'test backspace': CKEDITOR.env.ie,
				'test IE backspace': !CKEDITOR.env.ie
			}
		},

		'test setData': function() {
			bender.editor.focus();

			bender.editor.setData( 'bar', function() {
				resume( function() {
					assert.areSame( 1, changeCounter );
				} );
			} );
			wait();
		},

		'test typing': function() {
			var that = this;
			this.checkChange( function() {
				that.keyTools.typingEvents( 'a' );
			} );
		},

		'test command': function() {
			this.checkChange( function( editor ) {
				editor.execCommand( 'bold' );
			} );
		},

		'test undo': function() {
			this.checkChange( function( editor ) {
				editor.execCommand( 'undo' );
			} );
		},

		'test redo': function() {
			this.checkChange( function( editor ) {
				editor.execCommand( 'redo' );
			} );
		},

		'test no change event during navigation': function() {
			var editor = bender.editor;

			changeCounter = 0;

			var navigationKeyCodes = [
				37, // Left arrow.
				39, // Right arrow.
				35, // End.
				9 // Tab.
			];

			for ( var i = 0; i < navigationKeyCodes.length; i++ ) {
				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: navigationKeyCodes[ i ] } ) );
				// Firefox will fire keypress for all of these keys (#11611).
				if ( CKEDITOR.env.gecko ) {
					editor.editable().fire( 'keypress', new CKEDITOR.dom.event( { keyCode: navigationKeyCodes[ i ] } ) );
				}
			}

			wait( function() {
				assert.areSame( 0, changeCounter, 'There should be no change events' );
			}, 10 );
		},

		'test no change event on create and destroy': function() {
			changeCounter = 0;

			var editor = CKEDITOR.replace( 'createAndDestroy' );

			editor.on( 'change', function() {
				changeCounter++;
			} );

			editor.on( 'instanceReady', function() {
				editor.destroy();
			} );

			editor.on( 'destroy', function() {
				resume( function() {
					assert.areSame( 0, changeCounter, 'There should be no change events' );
				} );
			} );

			wait();
		},

		'test backspace': function() {
			// IE: In case of backspace and delete we need to make real change to DOM content.
			var that = this;
			this.checkChange( function() {
				that.keyTools.keyEvent( 8 /* backspace */ );
			} );
		},

		'test IE backspace': function() {
			// IE doesn't send keypress event, which is used as a `input` event.
			var that = this,
				textNode = this.editor.editable().getFirst().getFirst();
			this.checkChange( function() {
				that.keyTools.keyEvent( 8 /* backspace */, null, true, function() {
					textNode.setText( 'fo' );
				} );
				textNode.setText( 'foo' );
			} );
		},

		'test delete': function() {
			var that = this,
				textNode = this.editor.editable().getFirst().getFirst();
			// In case of backspace and delete we need to make real change to DOM content.
			this.checkChange( function() {
				that.keyTools.keyEvent( 46 /* delete */, null, null, function() {
					// Textnode change required by IE.
					textNode.setText( 'f' );
				} );
				textNode.setText( 'foo' );
			} );
		},

		// #12300
		'test change event not fired after navigation key': function() {
			this.editorBot.setHtmlWithSelection( '<p>foo^</p>' );

			var textNode = this.editor.editable().getFirst().getFirst(),
				keyTools = this.keyTools,
				keyCodesEnum = keyTools.keyCodesEnum;

			this.checkChange( function() {
				keyTools.keyEvent( keyCodesEnum.KEY_D, null, null, function() {
					// Textnode change required by IE.
					textNode.setText( 'food' );
				} );

				// After setting text - caret is moved to beginning. We don't care - it does not change nothing.
				keyTools.keyEvent( keyCodesEnum.LEFT, null, true );
			} );
		}
	} );

} )();