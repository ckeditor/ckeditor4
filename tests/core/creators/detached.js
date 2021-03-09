/* bender-tags: editor, feature, 4461*/
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

			assert.isNotNull( editor );
		},

		'test editor is created immediately on not detached element with delayIfDetached config set as false': function() {
			var editorElement = CKEDITOR.document.getById( 'editor2' ),
				editor = CKEDITOR.replace( editorElement, {
					delayIfDetached: false
				} );

			assert.isNotNull( editor );
		},

		'test editor without config is created immediately on not detached element': function() {
			var editorElement = CKEDITOR.document.getById( 'editor3' ),
				editor = CKEDITOR.replace( editorElement );

			assert.isNotNull( editor );
		},

		'test delay editor creation if target element is detached': function() {
			var editorElement = CKEDITOR.document.getById( 'editor4' ),
				editorParent = editorElement.getParent();

			editorElement.remove();

			var editor = CKEDITOR.replace( editorElement, {
				delayIfDetached: true
			} );

			assert.isNull( editor );

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
							assert.pass();
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
							assert.pass();
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
			var stubbedWarn = sinon.stub( CKEDITOR, 'warn' ),
				editorElement = CKEDITOR.document.getById( 'editor7' ),
				editorParent = editorElement.getParent();

			editorElement.remove();

			CKEDITOR.replace( editorElement, {
				delayIfDetached: true,
				on: {
					instanceReady: function() {
						resume( function() {
							assert.isTrue( stubbedWarn.calledTwice );
							stubbedWarn.restore();
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
					assert.isTrue( spyIsDetached.callCount > 2 );
					spyIsDetached.restore();

				} );
			}, 200 );

			wait();
		}
	};

	bender.test( tests );
}() );
