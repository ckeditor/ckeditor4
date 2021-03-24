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

			assert.isNotNull( editor, 'Editor should be created immediately on not detached element, even if config allows a delay.' );
		},

		'test editor is created immediately on not detached element with delayIfDetached config set as false': function() {
			var editorElement = CKEDITOR.document.getById( 'editor2' ),
				editor = CKEDITOR.replace( editorElement, {
					delayIfDetached: false
				} );

			assert.isNotNull( editor, 'Editor should be created immediately on not detached element, despite config delay option.' );
		},

		'test editor without config is created immediately on not detached element': function() {
			var editorElement = CKEDITOR.document.getById( 'editor3' ),
				editor = CKEDITOR.replace( editorElement );

			assert.isNotNull( editor, 'Editor should be created immediately with default config options.' );
		},

		'test delay editor creation if target element is detached': function() {
			var editorElement = CKEDITOR.document.getById( 'editor4' ),
				editorParent = editorElement.getParent();

			editorElement.remove();

			var editor = CKEDITOR.replace( editorElement, {
				delayIfDetached: true
			} );

			assert.isNull( editor, 'Editor should not be created on detached element, if config allows a delay.' );

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

		'test editor default delay creation invokes CKEDITOR.warn': function() {
			var spyWarn = sinon.spy(),
				editorElement = CKEDITOR.document.getById( 'editor7' ),
				editorParent = editorElement.getParent();

			editorElement.remove();

			CKEDITOR.on( 'log', spyWarn );

			CKEDITOR.replace( editorElement, {
				delayIfDetached: true,
				on: {
					instanceReady: function() {
						resume( function() {
							var firstCallData = spyWarn.firstCall.args[ 0 ].data,
								secondCallData = spyWarn.secondCall.args[ 0 ].data,
								expectedMethod = 'interval - ' + CKEDITOR.config.delayIfDetached_interval + ' ms';

							assert.areEqual( 'editor-delayed-creation', firstCallData.errorCode, 'First editor warn should be about creation delay with interval.' );
							assert.areEqual( expectedMethod , firstCallData.additionalData.method, 'First editor warn method should be interval with time.' );

							assert.areEqual( 'editor-delayed-creation-success', secondCallData.errorCode, 'Second editor warn should be about success editor creation with interval.' );
							assert.areEqual( expectedMethod, secondCallData.additionalData.method, 'Second editor warn method should be interval with time.' );

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

		'test editor delay creation with callback invokes CKEDITOR.warn': function() {
			var spyWarn = sinon.spy(),
				editorElement = CKEDITOR.document.getById( 'editor8' ),
				editorParent = editorElement.getParent(),
				resumeEditorCreation;

			editorElement.remove();

			CKEDITOR.on( 'log', spyWarn );

			function delayedCallback( createEditorFunction ) {
				resumeEditorCreation = createEditorFunction;
			}

			CKEDITOR.replace( editorElement, {
				delayIfDetached: true,
				delayIfDetached_callback: delayedCallback,
				on: {
					instanceReady: function() {
						resume( function() {
							var firstCallData = spyWarn.firstCall.args[ 0 ].data,
								secondCallData = spyWarn.secondCall.args[ 0 ].data;

							assert.areEqual( 'editor-delayed-creation', firstCallData.errorCode, 'First editor warn should be about creation delay with callback.' );
							assert.areEqual( 'callback' , firstCallData.additionalData.method, 'First editor warn method should be \'callback\'.' );

							assert.areEqual( 'editor-delayed-creation-success', secondCallData.errorCode, 'Second editor warn should be about success editor creation with callback.' );
							assert.areEqual( 'callback', secondCallData.additionalData.method, 'Second editor warn method should be \'callback\'.' );

							CKEDITOR.removeListener( 'log', spyWarn );
						} );
					}
				}
			} );

			CKEDITOR.tools.setTimeout( function() {
				editorParent.append( editorElement );

				resumeEditorCreation();
			}, 250 );

			wait();
		},

		'test editor interval attempts to create if target element is detached': function() {
			var editorElement = CKEDITOR.document.getById( 'editor9' ),
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
					assert.isTrue( spyIsDetached.callCount > 2, 'There should be at least three calls of isDetached().' );
					spyIsDetached.restore();
				} );
			}, 200 );

			wait();
		}
	};

	bender.test( tests );
}() );
