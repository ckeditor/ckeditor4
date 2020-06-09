/* bender-tags: widgetcore, 3998 */
/* bender-ckeditor-plugins: wysiwygarea,sourcearea,widget */

( function() {
	'use strict';

	function pressCtrlEnter( editor ) {
		editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: CKEDITOR.CTRL + 13 } ) );
	}

	var currentError = null;
	window.onerror = function( error ) {
		currentError = error;
	};

	bender.editors = {
		wysiwyg: {
			config: {
				keystrokes: [
					[ CKEDITOR.CTRL + 13 /*Enter*/, 'source' ]
				]
			}
		},
		source: {
			config: {
				keystrokes: [
					[ CKEDITOR.CTRL + 13 /*Enter*/, 'source' ]
				],
				startupMode: 'source'
			}
		}
	};

	bender.test( {
		tearDown: function() {
			currentError = null;
		},

		// (#3998)
		'test change wysiwyg mode to source mode by pressing keystroke': function() {
			var editor = this.editors.wysiwyg;

			assert.areSame( 'wysiwyg', editor.mode, 'Wysiwyg mode is active at start.' );

			editor.on( 'mode', function() {
				resume( function() {
					assert.areSame( 'source', editor.mode, 'Source mode is active (changed from wysiwyg mode).' );

					if ( currentError ) {
						assert.fail( currentError );
					}
				} );
			} );

			pressCtrlEnter( editor );

			wait();
		},

		// (#3998)
		'test change source mode to wysiwyg mode by pressing keystroke': function() {
			var editor = this.editors.source;

			assert.areSame( 'source', editor.mode, 'Source mode is active at start.' );

			editor.on( 'mode', function() {
				resume( function() {
					assert.areSame( 'wysiwyg', editor.mode, 'Wysiwyg mode is active (changed from source mode).' );

					if ( currentError ) {
						assert.fail( currentError );
					}
				} );
			} );

			pressCtrlEnter( editor );

			wait();
		}
	} );
} )();
