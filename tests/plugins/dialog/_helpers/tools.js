( function() {
	'use strict';

	// Function extends dialog with a new event (`focusChange`) which is executed, when tab or element on focusList gain a focus
	// This general approach helps to finish promises, when focus was changed inside the dialog.
	function onLoadHandler( evt ) {
		var dialog = evt.sender;

		// Apply listening to focus change on tabs in dialog
		CKEDITOR.tools.array.forEach( CKEDITOR.tools.object.values( dialog._.tabs ), function( item ) {
			item[ 0 ].on( 'focus', function() {
				dialog.fire( 'focusChange' );
			}, null, null, 100000 );
		} );

		// Apply listening to focus change on elements in dialog.
		CKEDITOR.tools.array.forEach( dialog._.focusList, function( item ) {
			item.on( 'focus', function() {
				dialog.fire( 'focusChange' );
			}, null, null, 100000 );
		} );
	}

	// Function generates event, based on passed config, which changes focus in the dialog.
	// It supports few possibilities, which interact with dialog in a different way.
	// 1. passing `config.direction` moves focus with dialog method `changeFocus`
	// 2. passing `config.elementId` and `config.tab` moves focus with `CKEDITOR.dom.element.focus()` on element found with config values
	// 3. passing `config.buttonName` moves focus to "OK" or "Cancel" buttons by execution of `CKEDITOR.dom.element.focus()` on this element
	// 4. passing `config.key` fires "keydown" event on dialog._.element with a specified keyCode. It simulates moving focus with a keyboard.
	//   There might be also added key modifiers "shift" or "alt"
	//
	// In case of passing invalid config option, function throws a descriptive error.
	function changeFocus( dialog, config ) {
		var element;

		if ( !( dialog instanceof CKEDITOR.dialog ) ) {
			throw new Error( 'Passed "dialog" argument is not an instance of the CKEDITOR.dialog.' );
		}

		if ( config.direction === 'next' ) {
			// 1.
			dialog.changeFocus( 1 );
		} else if ( config.direction === 'previous' ) {
			// 1.
			dialog.changeFocus( -1 );
		} else if ( config.key ) {
			if ( typeof config.key !== 'number' ) {
				throw new Error( 'Invalid focus config. "config.key" should be a number: ' + JSON.stringify( config ) );
			}
			// 4.
			dialog._.element.fire( 'keydown', new CKEDITOR.dom.event( {
				keyCode: config.key,
				shiftKey: config.shiftKey ? true : false,
				altKey: config.altKey ? true : false
			} ) );
		} else {
			if ( config.elementId && config.tab ) {
				// 2.
				element = dialog.getContentElement( config.tab, config.elementId ).getInputElement();
			} else if ( config.buttonName ) {
				// 3.
				element = dialog.getButton( config.buttonName ).getInputElement();
			} else {
				throw new Error( 'Invalid focus config. There is no valid "Object.key": ' + JSON.stringify( config ) );
			}

			if ( element ) {
				element.focus();
			} else {
				throw new Error( 'Invalid focus config. DOM element cannot be found based on the config: ' + JSON.stringify( config ) );
			}
		}
	}


	var dialogTools = {
		// Dialog definitions used in test cases.
		definitions: {
			singlePage: function() {
				return {
					title: 'Single page dialog',
					contents: [
						{
							id: 'sp-test1',
							elements: [
								{
									type: 'text',
									id: 'sp-input1',
									label: 'input 1'
								},
								{
									type: 'select',
									id: 'sp-input2',
									label: 'input 2',
									items: [ [ 'A' ], [ 'B' ], [ 'C' ], [ 'D' ] ],
									'default': 'C'
								},
								{
									type: 'checkbox',
									id: 'sp-input3',
									label: 'input 3'
								}
							]
						}
					],
					onLoad: onLoadHandler
				};
			},
			multiPage: function() {
				return {
					title: 'Mult page dialog',
					contents: [
						{
							id: 'mp-test1',
							label: 'MP 1',
							elements: [
								{
									type: 'select',
									id: 'mp-input11',
									label: 'input 11',
									items: [ [ 'A' ], [ 'B' ], [ 'C' ], [ 'D' ] ],
									'default': 'C'
								},
								{
									type: 'button',
									id: 'mp-input12',
									label: 'input 12'
								},
								{
									type: 'text',
									id: 'mp-input13',
									label: 'input 13'
								}
							]
						},
						{
							id: 'mp-test2',
							label: 'MP 2',
							elements: [
								{
									type: 'select',
									id: 'mp-input21',
									label: 'input 21',
									items: [ [ 'X' ], [ 'Y' ], [ 'Z' ] ],
									'default': 'Y'
								}
							]
						},
						{
							id: 'mp-test3',
							label: 'MP 3',
							elements: [
								{
									type: 'checkbox',
									id: 'mp-input31',
									label: 'input 31'
								},
								{
									type: 'button',
									id: 'mp-input32',
									label: 'input 32'
								},
								{
									type: 'text',
									id: 'mp-input33',
									label: 'input 33'
								},
								{
									type: 'textarea',
									id: 'mp-input34',
									label: 'input 34'
								},
								{
									type: 'select',
									id: 'mp-input35',
									label: 'input 35',
									items: [ [ '111' ], [ '222' ], [ '333' ] ],
									'default': '111'
								}
							]
						}
					],
					onLoad: onLoadHandler
				};
			},
			hiddenPage: function() {
				return {
					title: 'Hidden page dialog',
					contents: [
						{
							id: 'hp-test1',
							label: 'HP 1',
							elements: [
								{
									type: 'text',
									id: 'hp-input11',
									label: 'input 11'
								},
								{
									type: 'textarea',
									id: 'hp-input12',
									label: 'input 12'
								},
								{
									type: 'select',
									id: 'hp-input13',
									label: 'input 13',
									items: [ [ 'A' ], [ 'B' ], [ 'C' ] ],
									'default': 'C'
								}
							]
						},
						{
							id: 'hp-test2',
							label: 'HP 2',
							elements: [
								{
									type: 'button',
									id: 'hp-input21',
									label: 'input 21',
									requiredContent: 'fakeElement' // This input element should be hidden.
								},
								{
									type: 'select',
									id: 'hp-input22',
									label: 'input 22',
									items: [ [ 'A' ], [ 'B' ], [ 'C' ] ],
									'default': 'C'
								},
								{
									type: 'textarea',
									id: 'hp-input23',
									label: 'input 23',
									requiredContent: 'fakeElement' // This input element should be hidden.
								}
							]
						},
						{
							id: 'hp-test3',
							label: 'HP 3',
							requiredContent: 'fakeElement', // Entire tab should be hidden.
							elements: [
								{
									type: 'button',
									id: 'hp-input31',
									label: 'input 31'
								},
								{
									type: 'checkbox',
									id: 'hp-input32',
									label: 'input 32'
								},
								{
									type: 'select',
									id: 'hp-input33',
									label: 'input 33',
									items: [ [ '111' ], [ '222' ], [ '333' ] ],
									'default': '111'
								},
								{
									type: 'textarea',
									id: 'hp-input34',
									label: 'input 34'
								},
								{
									type: 'text',
									id: 'hp-input35',
									label: 'input 35'
								}
							]
						},
						{
							id: 'hp-test4',
							label: 'HP 4',
							elements: [
								{
									type: 'button',
									id: 'hp-input41',
									label: 'input 41'
								}
							]
						}
					],
					onLoad: onLoadHandler
				};
			}
		},

		// Assert for checking dialog elements and buttons.
		// Requires either `buttonName` or combintation of `tab` and `elementId` input options.
		//
		// @param options
		// @param {String} [options.buttonName] represent name of the button from dialog footer, usually 'ok' or 'cancel'
		// @param {String} [options.tab] the ID of a tab in the dialog
		// @param {String} [options.elementId] the ID of an element on a given tab page
		assertFocusedElement: function( options ) {
			return function( dialog ) {
				var actualFocusedElement = dialog._.focusList[ dialog._.currentFocusIndex ];
				var expectedFocusedElement;

				if ( options.buttonName ) {
					expectedFocusedElement = dialog.getButton( options.buttonName );
				} else {
					expectedFocusedElement = dialog.getContentElement( options.tab, options.elementId );
				}

				if ( !expectedFocusedElement ) {
					assert.fail( 'Expected focused element cannot be found in the dialog.' );
				}

				assert.areEqual( expectedFocusedElement, actualFocusedElement,
					'Element: "' + expectedFocusedElement.id + '" should be equal to currently focused element: "' + actualFocusedElement.id + '".' );

				return dialog;
			};
		},

		// Assert checkign focus on tab elements in dialog
		//
		// @param {String} tabName ID of a tab
		assertFocusedTab: function( tabName ) {
			return function( dialog ) {
				assert.areEqual( -1, dialog._.currentFocusIndex );
				assert.areEqual( tabName, dialog._.currentTabId );

				return dialog;
			};
		},

		// Provides a thenable function which preserved proper config in a closure.
		// The idea is to wrap function which change focus with a promise. Then wait until dialog generate
		// a `focusChange` event which should be fired because of execution of onLoadHandler.
		// There is additional safety switch which rejects promise after 5 seconds without focus change.
		focusElement: function( config ) {
			return function( dialog ) {
				return new CKEDITOR.tools.promise( function( resolve, reject ) {
					dialog.once( 'focusChange', function() {
						// Keep the event asynchronous to have sure that all changes related to focus change on a given element or tab
						// was already prcoessed.
						CKEDITOR.tools.setTimeout( function() {
							resolve( dialog );
						} );
					} );

					// Safety switch to finish promise in case of focusing not tracked element, or not changing a focus in a dialog.
					CKEDITOR.tools.setTimeout( function() {
						reject( new Error( 'Focus hasn\'t change for last 5 seconds' ) );
					}, 5000 );

					changeFocus( dialog, config );
				} );
			};
		}
	};

	window.dialogTools = dialogTools;
} )();
