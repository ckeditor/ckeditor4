( function() {
	'use strict';

	// Flag indicates if safety timout for promise should be enabled.
	var hasRejects = true;

	// Function extends dialog with a new event which executes a `focus:change` event, when tab or element on focusList gain a focus
	// This general approach helps to finish promises when focus is changed inside dialog.
	function onLoadHandler( evt ) {
		var dialog = evt.sender;

		// Apply listening to focus change on tabs in dialog
		CKEDITOR.tools.array.forEach( CKEDITOR.tools.object.values( dialog._.tabs ), function( item ) {
			item[ 0 ].on( 'focus', function() {
				dialog.fire( 'focus:change' );
			}, null, null, 100000 );
		} );

		// Applug listening tofocus change on elements in dialog
		CKEDITOR.tools.array.forEach( dialog._.focusList, function( item ) {
			item.on( 'focus', function() {
				dialog.fire( 'focus:change' );
			}, null, null, 100000 );
		} );
	}

	// Function generates specific event ( based on config ), which have to result with focus change in dialog.
	function focusChanger( dialog, config ) {
		var element;

		if ( config.direction === 'next' ) {
			dialog.changeFocus( 1 );
			return;
		}

		if ( config.direction === 'previous' ) {
			dialog.changeFocus( -1 );
			return;
		}

		if ( config.elementId && config.tab ) {
			element = dialog.getContentElement( config.tab, config.elementId ).getInputElement();
			element.focus();
			return;
		}

		if ( config.buttonName ) {
			element = dialog.getButton( config.buttonName ).getInputElement();
			element.focus();
			return;
		}

		if ( config.key ) {
			dialog._.element.fire( 'keydown', new CKEDITOR.dom.event( {
				keyCode: config.key,
				shiftKey: config.shiftKey ? true : false,
				altKey: config.altKey ? true : false
			} ) );
			return;
		}

		throw new Error( 'Invalid focus config: ' + JSON.stringify( config ) );
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
									type: 'text',
									id: 'sp-input2',
									label: 'input 2'
								},
								{
									type: 'text',
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
									type: 'text',
									id: 'mp-input11',
									label: 'input 11'
								},
								{
									type: 'text',
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
									type: 'text',
									id: 'mp-input21',
									label: 'input 21'
								}
							]
						},
						{
							id: 'mp-test3',
							label: 'MP 3',
							elements: [
								{
									type: 'text',
									id: 'mp-input31',
									label: 'input 31'
								},
								{
									type: 'text',
									id: 'mp-input32',
									label: 'input 32'
								},
								{
									type: 'text',
									id: 'mp-input33',
									label: 'input 33'
								},
								{
									type: 'text',
									id: 'mp-input34',
									label: 'input 34'
								},
								{
									type: 'text',
									id: 'mp-input35',
									label: 'input 35'
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
									type: 'text',
									id: 'hp-input12',
									label: 'input 12'
								},
								{
									type: 'text',
									id: 'hp-input13',
									label: 'input 13'
								}
							]
						},
						{
							id: 'hp-test2',
							label: 'HP 2',
							elements: [
								{
									type: 'text',
									id: 'hp-input21',
									label: 'input 21',
									requiredContent: 'fakeElement'
								},
								{
									type: 'text',
									id: 'hp-input22',
									label: 'input 22'
								},
								{
									type: 'text',
									id: 'hp-input23',
									label: 'input 23',
									requiredContent: 'fakeElement'
								}
							]
						},
						{
							id: 'hp-test3',
							label: 'HP 3',
							requiredContent: 'fakeElement',
							elements: [
								{
									type: 'text',
									id: 'hp-input31',
									label: 'input 31'
								},
								{
									type: 'text',
									id: 'hp-input32',
									label: 'input 32'
								},
								{
									type: 'text',
									id: 'hp-input33',
									label: 'input 33'
								},
								{
									type: 'text',
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
									type: 'text',
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
		// config.buttonName {String} 'ok' or 'cancel'
		// config.tab {String} ID of a tabe in dialog
		// config.elementId {String} ID of an element on a given tab page
		assertFocusedElement: function( config ) {
			return function( dialog ) {
				var actualFocusedElement = dialog._.focusList[ dialog._.currentFocusIndex ];
				var expectedFocusedElement;

				if ( config.buttonName ) {
					expectedFocusedElement = dialog.getButton( config.buttonName );
				} else {
					expectedFocusedElement = dialog.getContentElement( config.tab, config.elementId );
				}

				assert.areEqual( expectedFocusedElement, actualFocusedElement,
					'Element: "' + expectedFocusedElement.id + '" should be equal to currently focused element: "' + actualFocusedElement.id + '".' );
				return dialog;
			};
		},

		// Assert to check focus on tab elements in dialog
		// tabName {String} ID of a tab
		assertFocusedTab: function( tabName ) {
			return function( dialog ) {
				assert.areEqual( -1, dialog._.currentFocusIndex );
				assert.areEqual( tabName, dialog._.currentTabId );

				return dialog;
			};
		},

		// Provides a thenable function which preserved proper config in a closure.
		// The idea is to wrap function which change focus (focusChanger) with a promise. Then wait until dialog generate
		// a `focus:change` event which should exist because of execution of onLoadHandler.
		// There is additional safety mechanism which rejects promise after 5 seconds without focus change. It might be disabled with
		// `hasRejects` flag.
		focusElement: function( config ) {
			return function( dialog ) {
				return new CKEDITOR.tools.promise( function( resolve, reject ) {
					dialog.once( 'focus:change', function() {
						CKEDITOR.tools.setTimeout( function() {
							resolve( dialog );
						} );
					} );

					if ( hasRejects ) {
						CKEDITOR.tools.setTimeout( function() {
							reject( new Error( 'Focus hasn\'t change for last 5 seconds' ) );
						}, 5000 );
					}

					focusChanger( dialog, config );
				} );
			};
		}
	};

	window.dialogTools = dialogTools;
} )();
