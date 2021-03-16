/* bender-tags: editor, feature, 4461 */
/* bender-ckeditor-plugins: wysiwygarea */

( function() {
	'use strict';

	var tests = {
		'test editor is created immediately on not detached element even with delay config': function() {
			var editorElement = CKEDITOR.document.getById( 'editor1' ),
				editor = CKEDITOR.replace( editorElement, {
					delayIfDetached: true,
					delayIfDetached_callback: function() {}
				} );

			assert.isNotNull( editor, 'Editor should be created immediately on not detached element even with config enabling delay.' );
		},

		'test editor is created immediately on not detached element with delayIfDetached config set as false': function() {
			var editorElement = CKEDITOR.document.getById( 'editor2' ),
				editor = CKEDITOR.replace( editorElement, {
					delayIfDetached: false
				} );

			assert.isNotNull( editor, 'Editor should be created immediately on not detached element with config disabling delay.' );
		},

		'test editor without config is created immediately on not detached element': function() {
			var editorElement = CKEDITOR.document.getById( 'editor3' ),
				editor = CKEDITOR.replace( editorElement );

			assert.isNotNull( editor, 'Editor should be created immediately without custom config.' );
		},

		'test delay editor creation if target element is detached': function() {
			var editorElement = CKEDITOR.document.getById( 'editor4' ),
				editorParent = editorElement.getParent();

			editorElement.remove();

			var editor = CKEDITOR.replace( editorElement, {
				delayIfDetached: true
			} );

			assert.isNull( editor, 'Editor should not be created on detached element with config allowing delay.' );

			editorParent.append( editorElement );
		},

		'test delay editor creation until target element attach to DOM': function() {
			var editorElement = CKEDITOR.document.getById( 'editor5' ),
				editorParent = editorElement.getParent();

			editorElement.remove();

			CKEDITOR.replace( editorElement, {
				delayIfDetached: true,
				on: {
					instanceReady: function() {
						resume( function() {
							assert.pass( 'Editor was created.' );
						} );
					}
				}
			} );

			CKEDITOR.tools.setTimeout( function() {
				editorParent.append( editorElement );
			}, 250 );

			wait();
		},

		'test editor creation from provided callback': function() {
			var editorElement = CKEDITOR.document.getById( 'editor6' ),
				editorParent = editorElement.getParent(),
				editorCreationCallback;

			editorElement.remove();

			CKEDITOR.replace( editorElement, {
				delayIfDetached: true,
				delayIfDetached_callback: registerCallback,
				on: {
					instanceReady: function() {
						resume( function() {
							assert.pass( 'Editor was created from custom callback.' );
						} );
					}
				}
			} );

			function registerCallback( editorCreationFunc ) {
				editorCreationCallback = editorCreationFunc;
			}

			CKEDITOR.tools.setTimeout( function() {
				editorParent.append( editorElement );
				editorCreationCallback();
			}, 250 );

			wait();
		},

		'test editor delay creation invokes CKEDITOR.warn': function() {
			var spyWarn = sinon.spy(),
				editorElement = CKEDITOR.document.getById( 'editor7' ),
				editorParent = editorElement.getParent();
			
			CKEDITOR.on( 'log', function( event ) {
				console.log( event.data.errorCode );
			} );
			
			editorElement.remove();

			CKEDITOR.on( 'log', spyWarn );

			CKEDITOR.replace( editorElement, {
				delayIfDetached: true,
				on: {
					instanceReady: function() {
						resume( function() {
							assert.areEqual( 'editor-delayed-creation', spyWarn.firstCall.args[ 0 ].data.errorCode );
							assert.areEqual( 'editor-delayed-creation-success', spyWarn.secondCall.args[ 0 ].data.errorCode );
							CKEDITOR.removeListener( 'log', spyWarn );
						} );
					}
				}
			} );

			CKEDITOR.tools.setTimeout( function() {
				editorParent.append( editorElement );
			}, 250 );

			wait();
		},

		'test editor interval attempts to create if target element is detached': function() {
			var editorElement = CKEDITOR.document.getById( 'editor8' ),
				editorElementParent = editorElement.getParent(),
				spyIsDetached = sinon.spy( editorElement, 'isDetached' );

			editorElement.remove();

			CKEDITOR.replace( editorElement, {
				delayIfDetached: true,
				delayIfDetached_interval: 50
			} );

			CKEDITOR.tools.setTimeout( function() {
				resume( function() {
					editorElementParent.append( editorElement );
					assert.isTrue( spyIsDetached.callCount > 2, 'There should be at least 3 calls of isDetached().' );
					spyIsDetached.restore();
				} );
			}, 200 );

			wait();
		}
	};

	bender.test( tests );
}() );
