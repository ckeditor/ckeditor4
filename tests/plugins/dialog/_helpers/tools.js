( function() {
	'use strict';

	// Function extends dialog with a new event (`focusChange`) which is executed, when tab or element on `focusList` gains focus.
	// This generic approach helps to resolve promises, when focus was changed internally by the dialog.
	function onLoadHandler( evt ) {
		var dialog = evt.sender;

		// Apply listening to focus change on tabs in dialog.
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

	// Function changes focused element or fires event which triggers focus change in the dialog, based on provided options.
	//
	// It supports few possibilities to interact with a dialog in a different way:
	// 1. Passing `options.direction` moves focus with dialog method `changeFocus`.
	// 2. Passing `options.elementId` and `options.tab` moves focus with `CKEDITOR.dom.element.focus()` method to found element.
	// 3. Passing `options.buttonName` moves focus to "OK" or "Cancel" buttons with `CKEDITOR.dom.element.focus()` method.
	// 4. Passing `options.key` fires `keydown` event on `dialog._.element` with a specified `keyCode`. It simulates moving focus
	// with a keyboard. It also supports key modifiers: `shift` or `alt`.
	//
	// Function returns true if it triggered focus change. In case of passing invalid options argument, function throws a descriptive error.
	function changeFocus( dialog, options ) {
		if ( !( dialog instanceof CKEDITOR.dialog ) ) {
			throw new Error( 'Passed "dialog" argument is not an instance of `CKEDITOR.dialog`.' );
		}

		// Case 1 - Move focus forward/backward.
		if ( options.direction ) {
			if ( options.direction === 'next' ) {
				dialog.changeFocus( 1 );
			} else if ( options.direction === 'previous' ) {
				dialog.changeFocus( -1 );
			} else {
				throw new Error( 'Invalid `options.direction`: ' + JSON.stringify( options ) );
			}

			return true;
		}

		// Case 2 and 3 - Focus element.
		if ( options.buttonName || options.elementId && options.tab ) {
			var element;

			if ( options.elementId && options.tab ) {
				element = dialog.getContentElement( options.tab, options.elementId ).getInputElement();
			} else if ( options.buttonName ) {
				element = dialog.getButton( options.buttonName ).getInputElement();
			}

			if ( element ) {
				element.focus();
			} else {
				throw new Error( 'Invalid focus options. DOM element cannot be found based on the provided options: ' + JSON.stringify( options ) );
			}

			return true;
		}

		// Case 4 - Fire key event.
		if ( options.key ) {
			dialog._.element.fire( 'keydown', new CKEDITOR.dom.event( {
				keyCode: parseInt( options.key, 10 ),
				shiftKey: options.shiftKey ? true : false,
				altKey: options.altKey ? true : false
			} ) );

			return true;
		}

		throw new Error( 'Invalid focus options: ' + JSON.stringify( options ) );
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

		// Asserts dialog focused element or button.
		// It requires either `buttonName` or combination of `tab` and `elementId` input options.
		//
		// @param options
		// @param {String} [options.buttonName] Button name from dialog footer, usually 'ok' or 'cancel'.
		// @param {String} [options.tab] Dialog tab ID.
		// @param {String} [options.elementId] Dialog element ID on any given tab page.
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

		// Asserts dialog focused tab.
		//
		// @param {String} tab The tab ID.
		assertFocusedTab: function( tab ) {
			return function( dialog ) {
				assert.areEqual( -1, dialog._.currentFocusIndex );
				assert.areEqual( tab, dialog._.currentTabId );

				return dialog;
			};
		},

		// Asserts there is just one aria-selected tab and that it's the one with 'cke_dialog_tab_selected' class.
		//
		// @param {String} tab The tab ID.
		assertTabsAriaAttribute: function() {
			return function( dialog ) {
				var selectedTab = dialog.getElement().findOne( '.cke_dialog_tab_selected' ),
					ariaSelectedTabsCount = dialog.getElement().find( '[aria-selected]' ).count();

				assert.areEqual( 1, ariaSelectedTabsCount );
				assert.isTrue( !!selectedTab.getAttribute( 'aria-selected' ) );

				return dialog;
			};
		},

		// Provides a thenable/chainable function which returns "dialog changing focus" promise when called.
		//
		// The idea is to wrap a function which changes focus into a promise. The promise resolves when dialog generates
		// a `focusChange` event. There is an additional safety switch which rejects promise after 5 seconds without focus change.
		//
		// @param {Object} options See private `changeFocus` function for available options.
		// @returns {Function} Function which accepts dialog parameter and returns promise object. The returned promise
		// changes dialog focused based on provided initial options. When focus change fails, the Promise is rejected after 5 seconds.
		focusElement: function( options ) {
			return function( dialog ) {
				return new CKEDITOR.tools.promise( function( resolve, reject ) {
					var resolveTimeout,
						rejectTimeout;

					dialog.once( 'focusChange', function() {
						// Keep the event asynchronous to make sure that all changes related to focus change
						// on a given element or tab were already processed.
						resolveTimeout = CKEDITOR.tools.setTimeout( function() {
							if ( rejectTimeout !== undefined ) {
								window.clearTimeout( rejectTimeout );
							}
							resolve( dialog );
						} );
					} );

					// Safety switch to reject a promise in case of lack of focus change in the dialog.
					rejectTimeout = CKEDITOR.tools.setTimeout( function() {
						if ( resolveTimeout !== undefined ) {
							window.clearTimeout( resolveTimeout );
						}
						reject( new Error( 'Focus hasn\'t change for at least 5 seconds' ) );
					}, 5000 );

					changeFocus( dialog, options );
				} );
			};
		},

		// Setups test dialogs on a given editor instance.
		//
		// @param {CKEDITOR.editor} editor
		addPredefinedDialogsToEditor: function( editor ) {
			CKEDITOR.dialog.add( 'singlePageDialog', this.definitions.singlePage );
			CKEDITOR.dialog.add( 'multiPageDialog', this.definitions.multiPage );
			CKEDITOR.dialog.add( 'hiddenPageDialog', this.definitions.hiddenPage );

			editor.addCommand( 'singlePageDialog', new CKEDITOR.dialogCommand( 'singlePageDialog' ) );
			editor.addCommand( 'multiPageDialog', new CKEDITOR.dialogCommand( 'multiPageDialog' ) );
			editor.addCommand( 'hiddenPageDialog', new CKEDITOR.dialogCommand( 'hiddenPageDialog' ) );
		}

	};

	window.dialogTools = dialogTools;
} )();
