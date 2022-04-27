/* exported detachedTests */

'use strict';

var detachedTests = ( function() {
	function appendTests( creatorFunction, tests ) {

		var assertMessage = 'Creator function used: ' + creatorFunction;

		return CKEDITOR.tools.extend( tests, {
			test_editor_is_created_immediately_on_not_detached_element_even_with_delay_config: function() {
				var editorElement = CKEDITOR.document.getById( createHtmlForEditor() ),
					editor = CKEDITOR[ creatorFunction ]( editorElement, {
						delayIfDetached: true,
						delayIfDetached_callback: function() {}
					} );

				assert.isTrue( editor instanceof CKEDITOR.editor, 'Editor should be created immediately on not detached element, even if config allows a delay. ' + assertMessage );
			},

			test_editor_is_created_immediately_on_not_detached_element_with_delayIfDetached_config_set_as_false: function() {
				var editorElement = CKEDITOR.document.getById( createHtmlForEditor() ),
					editor = CKEDITOR[ creatorFunction ]( editorElement, {
						delayIfDetached: false
					} );

				assert.isTrue( editor instanceof CKEDITOR.editor, 'Editor should be created immediately on not detached element, despite config delay option. ' + assertMessage );
			},

			test_editor_without_config_is_created_immediately_on_not_detached_element: function() {
				var editorElement = CKEDITOR.document.getById( createHtmlForEditor() ),
					editor = CKEDITOR[ creatorFunction ]( editorElement );

				assert.isTrue( editor instanceof CKEDITOR.editor, 'Editor should be created immediately with default config options. ' + assertMessage );
			},

			test_delay_editor_creation_if_target_element_is_detached: function() {
				var editorElement = CKEDITOR.document.getById( createHtmlForEditor() ),
					editorParent = editorElement.getParent();

				editorElement.remove();

				var cancel = CKEDITOR[ creatorFunction ]( editorElement, {
					delayIfDetached: true
				} );

				assert.areSame( 'function', typeof cancel, 'Editor should return function that allows to cancel creation. ' + assertMessage );

				editorParent.append( editorElement );
				cancel();
			},

			test_delayed_editor_creation_is_cancelable: function() {
				var editorElement = CKEDITOR.document.getById( createHtmlForEditor() ),
					editorParent = editorElement.getParent();

				editorElement.remove();

				var cancel = CKEDITOR[ creatorFunction ]( editorElement, {
					delayIfDetached: true,
					delayIfDetached_interval: 50
				} );

				// Make sure that editor is canceled to test if callback works properly.
				cancel();

				// Use spy to check if editor has been initialized despite being canceled.
				var creatorSpy = sinon.spy( CKEDITOR, creatorFunction );

				CKEDITOR.tools.setTimeout( function() {
					resume( function() {
						assert.areSame( 0, creatorSpy.callCount, 'Creator function should not be called. ' + assertMessage );
						creatorSpy.restore();
					} );
				}, 150 );

				editorParent.append( editorElement );

				wait();
			},

			test_delay_editor_creation_with_default_interval_strategy_until_target_element_attach_to_DOM: function() {
				var editorElement = CKEDITOR.document.getById( createHtmlForEditor() ),
					editorParent = editorElement.getParent();

				editorElement.remove();

				CKEDITOR[ creatorFunction ]( editorElement, {
					delayIfDetached: true,
					on: {
						instanceReady: function() {
							resume( function() {
								assert.pass( 'Editor was created. ' + assertMessage );
							} );
						}
					}
				} );

				CKEDITOR.tools.setTimeout( function() {
					editorParent.append( editorElement );
				}, 250 );

				wait();
			},

			test_editor_creation_from_provided_callback: function() {
				var editorElement = CKEDITOR.document.getById( createHtmlForEditor() ),
					editorParent = editorElement.getParent(),
					editorCreationCallback;

				editorElement.remove();

				CKEDITOR[ creatorFunction ]( editorElement, {
					delayIfDetached: true,
					delayIfDetached_callback: registerCallback,
					on: {
						instanceReady: function() {
							resume( function() {
								assert.pass( 'Editor was created from custom callback. ' + assertMessage );
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

			test_editor_default_delay_creation_invokes_CKEDITOR_warn: function() {
				var spyWarn = sinon.spy(),
					editorElement = CKEDITOR.document.getById( createHtmlForEditor() ),
					editorParent = editorElement.getParent();

				editorElement.remove();

				CKEDITOR.on( 'log', spyWarn );

				CKEDITOR[ creatorFunction ]( editorElement, {
					delayIfDetached: true,
					on: {
						instanceReady: function() {
							resume( function() {
								var firstCallData = spyWarn.firstCall.args[ 0 ].data,
									secondCallData = spyWarn.secondCall.args[ 0 ].data,
									expectedMethod = 'interval - ' + CKEDITOR.config.delayIfDetached_interval + ' ms';

								assert.areEqual( 'editor-delayed-creation', firstCallData.errorCode, 'First editor warn should be about creation delay with interval. ' + assertMessage );
								assert.areEqual( expectedMethod , firstCallData.additionalData.method, 'First editor warn method should be interval with time. ' + assertMessage );

								assert.areEqual(
									'editor-delayed-creation-success',
									secondCallData.errorCode,
									'Second editor warn should be about success editor creation with interval. ' + assertMessage
								);
								assert.areEqual(
									expectedMethod,
									secondCallData.additionalData.method,
									'Second editor warn method should be interval with time. ' + assertMessage
								);

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

			test_editor_delay_creation_with_callback_invokes_CKEDITOR_warn: function() {
				var spyWarn = sinon.spy(),
					editorElement = CKEDITOR.document.getById( createHtmlForEditor() ),
					editorParent = editorElement.getParent(),
					resumeEditorCreation;

				editorElement.remove();

				CKEDITOR.on( 'log', spyWarn );

				function delayedCallback( createEditorFunction ) {
					resumeEditorCreation = createEditorFunction;
				}

				CKEDITOR[ creatorFunction ]( editorElement, {
					delayIfDetached: true,
					delayIfDetached_callback: delayedCallback,
					on: {
						instanceReady: function() {
							resume( function() {
								var firstCallData = spyWarn.firstCall.args[ 0 ].data,
									secondCallData = spyWarn.secondCall.args[ 0 ].data;

								assert.areEqual( 'editor-delayed-creation', firstCallData.errorCode, 'First editor warn should be about creation delay with callback. ' + assertMessage );
								assert.areEqual( 'callback' , firstCallData.additionalData.method, 'First editor warn method should be \'callback\'. ' + assertMessage );

								assert.areEqual(
									'editor-delayed-creation-success',
									secondCallData.errorCode,
									'Second editor warn should be about success editor creation with callback. ' + assertMessage
								);
								assert.areEqual(
									'callback',
									secondCallData.additionalData.method,
									'Second editor warn method should be \'callback\'. ' + assertMessage
								);

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

			test_editor_interval_attempts_to_create_if_target_element_is_detached: function() {
				var editorElement = CKEDITOR.document.getById( createHtmlForEditor() ),
					editorElementParent = editorElement.getParent(),
					spyIsDetached = sinon.spy( editorElement, 'isDetached' );

				editorElement.remove();

				var cancel = CKEDITOR[ creatorFunction ]( editorElement, {
					delayIfDetached: true,
					delayIfDetached_interval: 50
				} );

				CKEDITOR.tools.setTimeout( function() {
					resume( function() {
						editorElementParent.append( editorElement );
						assert.isTrue( spyIsDetached.callCount > 2, 'There should be at least three calls of isDetached(). ' + assertMessage );
						spyIsDetached.restore();
						cancel();
					} );
				}, 200 );

				wait();
			}
		} );
	}

	function createHtmlForEditor() {
		var	editorId = 'editor' + new Date().getTime(),
			editorSlot = CKEDITOR.dom.element.createFromHtml( '<div><div id="' + editorId + '"><p>Content!!</p></div></div>' );

		CKEDITOR.document.getBody().append( editorSlot );

		return editorId;
	}

	return {
		appendTests: appendTests
	};

} )();
