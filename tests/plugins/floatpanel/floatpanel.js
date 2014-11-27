/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: floatpanel,wysiwygarea,sourcearea */

( function() {
	'use strict';

	var panel, panel2;

	bender.editor = {
		config: {
			on: {
				pluginsLoaded: function( evt ) {
					var body = CKEDITOR.document.getBody();

					panel = new CKEDITOR.ui.floatPanel( evt.editor, body, {} );

					panel.addBlock( 'testBlock1', {
						attributes: {
							title: 'test block 1'
						}
					} );

					panel2 = new CKEDITOR.ui.floatPanel( evt.editor, body, {} );

					panel2.addBlock( 'testBlock2', {
						attributes: {
							title: 'test block 2'
						}
					} );
				}
			}
		}
	};

	function testHideOn( editor, obj, evtName, callback ) {
		editor.once( 'panelShow', function() {
			setTimeout( function() {
				// Execute callback which should fire correct event.
				callback();
			} );
		} );

		obj.once( evtName, function() {
			resume( function() {
				assert.isFalse( !!panel.visible );
				assert.isFalse( panel.element.isVisible() );
			} );
		} );

		// Ensure async.
		setTimeout( function() {
			// Open in top-left corner of editable.
			panel.showBlock( 'testBlock1', editor.editable(), 1 );
		} );

		wait();
	}

	bender.test( {
		'test block panel opening&hiding': function() {
			var editor = this.editor;

			editor.once( 'panelShow', function() {
				resume( function() {
					assert.isTrue( !!panel.visible );
					assert.isTrue( panel.element.isVisible() );

					setTimeout( function() {
						panel.hide();
					} );

					wait();
				} );
			} );

			editor.once( 'panelHide', function() {
				resume( function() {
					assert.isFalse( !!panel.visible );
					assert.isFalse( panel.element.isVisible() );
				} );
			} );

			// Ensure async.
			setTimeout( function() {
				// Open in top-left corner of editable.
				panel.showBlock( 'testBlock1', editor.editable(), 1 );
			} );

			wait();
		},

		'test panel hide on mode switch': function() {
			var editor = this.editor;

			testHideOn( editor, editor, 'mode', function() {
				editor.setMode( 'source' );
			} );
		},

		'test panel hide on editor resize': function() {
			var editor = this.editor;

			testHideOn( editor, editor, 'resize', function() {
				editor.resize( 500, 100 );
			} );
		},

		'test panel hide on window resize': function() {
			// IE7-8 can't fire custom event on DOM object.
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 )
				assert.ignore();

			var editor = this.editor;

			testHideOn( editor, CKEDITOR.document.getWindow(), 'resize', function() {
				if ( document.createEvent ) {
					var e = document.createEvent( 'HTMLEvents' );
					e.initEvent( 'resize', true, false );
					document.body.dispatchEvent( e );
				} else if ( document.createEventObject ) {
					document.body.fireEvent( 'onresize' );
				}
			} );
		},

		// #9800. Scenario:
		// 1. open first panel,
		// 2. close first panel,
		// 3. open second panel,
		// 4. resize editor,
		// 5. check if second panel was closed.
		'test second panel hide on resize': function() {
			var editor = this.editor;

			editor.once( 'panelShow', function() {
				setTimeout( function() {
					panel.hide();
				} );
			} );

			editor.once( 'panelHide', function() {
				editor.once( 'panelHide', function() {
					resume( function() {
						assert.isTrue( true, 'Second panel was closed after editor\'s been resized.' );
					} );
				} );
				editor.once( 'panelShow', function() {
					editor.resize( 800, 200 );
				} );

				panel2.showBlock( 'testBlock2', editor.editable(), 1 );
			} );

			// Ensure async.
			setTimeout( function() {
				// Open in top-left corner of editable.
				panel.showBlock( 'testBlock1', editor.editable(), 1 );
			} );

			wait();
		}
	} );

} )();