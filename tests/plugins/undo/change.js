/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: undo,basicstyles,toolbar,wysiwygarea */

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

					if ( waitingForChange ) {
						waitingForChange = false;
						resume( function() {
							assert.isTrue( true, 'Change event emitted.' );
						} );
					}
				}
			}
		}
	};

	bender.test( {
		checkChange: function( action ) {
			waitingForChange = true;

			bender.editor.focus();

			action( bender.editor );
			wait();
		},

		setUp: function() {
			changeCounter = 0;
		},

		'test setData': function() {
			bender.editor.focus();

			bender.editor.setData( 'bar', function( editor ) {
				resume( function() {
					assert.areSame( 1, changeCounter );
				} );
			} );
			wait();
		},

		'test typing': function() {
			this.checkChange( function( editor ) {
				editor.editable().fire( 'keypress', new CKEDITOR.dom.event( { keyCode: 66/* character b */ } ) );
			} );
		},

		'test backspace': function() {
			this.checkChange( function( editor ) {
				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 8/* backspace */ } ) );
			} );
		},

		'test delete': function() {
			this.checkChange( function( editor ) {
				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 46/* delete */ } ) );
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

			editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 37/* left arrow */ } ) );
			editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 39/* right arrow */ } ) );
			editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 35/* end */ } ) );
			editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 9/* tab */ } ) );

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
		}
	} );

} )();