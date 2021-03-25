/* bender-tags: editor, feature, 4461 */
/* bender-ckeditor-plugins: wysiwygarea */

( function() {
	'use strict';

	var tests = {},
		editorIdCounter = 1;

	function test_editor_is_created_immediately_on_not_detached_element_even_with_delay_config( method, editorId ) {
		return function() {
			var editorElement = CKEDITOR.document.getById( editorId ),
				editor = CKEDITOR[ method ]( editorElement, {
					delayIfDetached: true,
					delayIfDetached_callback: function() {}
				} );

			assert.isNotNull( editor, 'Editor should be created immediately on not detached element, even if config allows a delay.' );
		};
	}

	function test_editor_is_created_immediately_on_not_detached_element_with_delayIfDetached_config_set_as_false( method, editorId ) {
		return function() {
			var editorElement = CKEDITOR.document.getById( editorId ),
				editor = CKEDITOR[ method ]( editorElement, {
					delayIfDetached: false
				} );

			assert.isNotNull( editor, 'Editor should be created immediately on not detached element, despite config delay option.' );
		};
	}

	function test_editor_without_config_is_created_immediately_on_not_detached_element( method, editorId ) {
		return function() {
			var editorElement = CKEDITOR.document.getById( editorId ),
				editor = CKEDITOR[ method ]( editorElement );

			assert.isNotNull( editor, 'Editor should be created immediately with default config options.' );
		};
	}

	function test_delay_editor_creation_if_target_element_is_detached( method, editorId ) {
		return function() {
			var editorElement = CKEDITOR.document.getById( editorId ),
			editorParent = editorElement.getParent();

			editorElement.remove();

			var editor = CKEDITOR[ method ]( editorElement, {
				delayIfDetached: true
			} );

			assert.isNull( editor, 'Editor should not be created on detached element, if config allows a delay.' );

			editorParent.append( editorElement );
		};
	}

	function test_delay_editor_creation_until_target_element_attach_to_DOM( method, editorId ) {
		return function() {
			var editorElement = CKEDITOR.document.getById( editorId ),
				editorParent = editorElement.getParent();

			editorElement.remove();

			CKEDITOR[ method ]( editorElement, {
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
		};
	}

	function test_editor_creation_from_provided_callback( method, editorId ) {
		return function() {
			var editorElement = CKEDITOR.document.getById( editorId ),
				editorParent = editorElement.getParent(),
				editorCreationCallback;

			editorElement.remove();

			CKEDITOR[ method ]( editorElement, {
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
		};
	}

	function test_editor_default_delay_creation_invokes_CKEDITOR_warn( method, editorId ) {
		return function() {
			var spyWarn = sinon.spy(),
				editorElement = CKEDITOR.document.getById( editorId ),
				editorParent = editorElement.getParent();

			editorElement.remove();

			CKEDITOR.on( 'log', spyWarn );

			CKEDITOR[ method ]( editorElement, {
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
		};
	}

	function test_editor_delay_creation_with_callback_invokes_CKEDITOR_warn( method, editorId ) {
		return function() {
			var spyWarn = sinon.spy(),
				editorElement = CKEDITOR.document.getById( editorId ),
				editorParent = editorElement.getParent(),
				resumeEditorCreation;

			editorElement.remove();

			CKEDITOR.on( 'log', spyWarn );

			function delayedCallback( createEditorFunction ) {
				resumeEditorCreation = createEditorFunction;
			}

			CKEDITOR[ method ]( editorElement, {
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
		};
	}

	function test_editor_interval_attempts_to_create_if_target_element_is_detached( method, editorId ) {
		return function() {
			var editorElement = CKEDITOR.document.getById( editorId ),
			editorElementParent = editorElement.getParent(),
			spyIsDetached = sinon.spy( editorElement, 'isDetached' );

			editorElement.remove();

			CKEDITOR[ method ]( editorElement, {
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
		};
	}

	createTest( test_editor_is_created_immediately_on_not_detached_element_even_with_delay_config, 'replace' );
	createTest( test_editor_is_created_immediately_on_not_detached_element_even_with_delay_config, 'inline' );

	createTest( test_editor_is_created_immediately_on_not_detached_element_with_delayIfDetached_config_set_as_false, 'replace' );
	createTest( test_editor_is_created_immediately_on_not_detached_element_with_delayIfDetached_config_set_as_false, 'inline' );

	createTest( test_editor_without_config_is_created_immediately_on_not_detached_element, 'replace' );
	createTest( test_editor_without_config_is_created_immediately_on_not_detached_element, 'inline' );

	createTest( test_delay_editor_creation_if_target_element_is_detached, 'replace' );
	createTest( test_delay_editor_creation_if_target_element_is_detached, 'inline' );

	createTest( test_delay_editor_creation_until_target_element_attach_to_DOM, 'replace' );
	createTest( test_delay_editor_creation_until_target_element_attach_to_DOM, 'inline' );

	createTest( test_editor_creation_from_provided_callback, 'replace' );
	createTest( test_editor_creation_from_provided_callback, 'inline' );

	createTest( test_editor_default_delay_creation_invokes_CKEDITOR_warn, 'replace' );
	createTest( test_editor_default_delay_creation_invokes_CKEDITOR_warn, 'inline' );

	createTest( test_editor_delay_creation_with_callback_invokes_CKEDITOR_warn, 'replace' );
	createTest( test_editor_delay_creation_with_callback_invokes_CKEDITOR_warn, 'inline' );

	createTest( test_editor_interval_attempts_to_create_if_target_element_is_detached, 'replace' );
	createTest( test_editor_interval_attempts_to_create_if_target_element_is_detached, 'inline' );

	function createTest( testFunction, method ) {
		var testCaseName =  testFunction.name.replace( /_/g, ' ' ) + ' ' + method;
		var	editorId = 'editor' + editorIdCounter++;

		createHtmlForEditor( editorId );

		tests[ testCaseName ] = testFunction( method, editorId );
	}

	function createHtmlForEditor( editorId ) {
		var editorSlot = CKEDITOR.dom.element.createFromHtml( '<div><div id="' + editorId + '"><p>Content!!</p></div></div>' );
		CKEDITOR.document.getBody().append( editorSlot );
	}

	bender.test( tests );
}() );
