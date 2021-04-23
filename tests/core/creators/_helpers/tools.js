/* exported detachedTests */

'use strict';

var detachedTests = ( function() {
	function appendTests( creatorFunction, tests ) {

		return CKEDITOR.tools.extend( tests, {
			test_editor_is_created_immediately_on_not_detached_element_even_with_delay_config: function() {
				var editorElement = CKEDITOR.document.getById( createHtmlForEditor() ),
					editor = CKEDITOR[ creatorFunction ]( editorElement, {
						delayIfDetached: true,
						delayIfDetached_callback: function() {}
					} );

				assert.isNotNull( editor, 'Editor should be created immediately on not detached element, even if config allows a delay. Creator function used: ' + creatorFunction );
			},

			test_editor_is_created_immediately_on_not_detached_element_with_delayIfDetached_config_set_as_false: function() {
				var editorElement = CKEDITOR.document.getById( createHtmlForEditor() ),
					editor = CKEDITOR[ creatorFunction ]( editorElement, {
						delayIfDetached: false
					} );

				assert.isNotNull( editor, 'Editor should be created immediately on not detached element, despite config delay option. Creator function used: ' + creatorFunction );
			},

			test_editor_without_config_is_created_immediately_on_not_detached_element: function() {
				var editorElement = CKEDITOR.document.getById( createHtmlForEditor() ),
					editor = CKEDITOR[ creatorFunction ]( editorElement );

				assert.isNotNull( editor, 'Editor should be created immediately with default config options. Creator function used: ' + creatorFunction );
			},

			test_delay_editor_creation_if_target_element_is_detached: function() {
				var editorElement = CKEDITOR.document.getById( createHtmlForEditor() ),
					editorParent = editorElement.getParent();

				editorElement.remove();

				var editor = CKEDITOR[ creatorFunction ]( editorElement, {
					delayIfDetached: true
				} );

				assert.isNull( editor, 'Editor should not be created on detached element, if config allows a delay. Creator function used: ' + creatorFunction );

				editorParent.append( editorElement );
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
								assert.pass( 'Editor was created. Creator function used: ' + creatorFunction );
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
								assert.pass( 'Editor was created from custom callback. Creator function used: ' + creatorFunction );
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

								assert.areEqual( 'editor-delayed-creation', firstCallData.errorCode, 'First editor warn should be about creation delay with interval. Creator function used: ' + creatorFunction );
								assert.areEqual( expectedMethod , firstCallData.additionalData.method, 'First editor warn method should be interval with time. Creator function used: ' + creatorFunction );

								assert.areEqual(
									'editor-delayed-creation-success',
									secondCallData.errorCode,
									'Second editor warn should be about success editor creation with interval. Creator function used: ' + creatorFunction
								);
								assert.areEqual(
									expectedMethod,
									secondCallData.additionalData.method,
									'Second editor warn method should be interval with time. Creator function used: ' + creatorFunction
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

								assert.areEqual( 'editor-delayed-creation', firstCallData.errorCode, 'First editor warn should be about creation delay with callback. Creator function used: ' + creatorFunction );
								assert.areEqual( 'callback' , firstCallData.additionalData.method, 'First editor warn method should be \'callback\'. Creator function used: ' + creatorFunction );

								assert.areEqual(
									'editor-delayed-creation-success',
									secondCallData.errorCode,
									'Second editor warn should be about success editor creation with callback. Creator function used: ' + creatorFunction
								);
								assert.areEqual(
									'callback',
									secondCallData.additionalData.method,
									'Second editor warn method should be \'callback\'. Creator function used: ' + creatorFunction
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

				CKEDITOR[ creatorFunction ]( editorElement, {
					delayIfDetached: true,
					delayIfDetached_interval: 50
				} );

				CKEDITOR.tools.setTimeout( function() {
					resume( function() {
						editorElementParent.append( editorElement );
						assert.isTrue( spyIsDetached.callCount > 2, 'There should be at least three calls of isDetached(). Creator function used: ' + creatorFunction );
						spyIsDetached.restore();
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
