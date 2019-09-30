/* bender-tags: editor, dialog */
/* bender-ckeditor-plugins: dialog */

( function() {
	'use strict';
	// Test suite indicates if tests should have 5 second safety switch timeout for rejecting promises.
	var hasRejects = true,
		KEYS = {
			TAB: 9,
			ENTER: 13,
			SPACE: 32,
			F10: 121,
			ARROW_RIGHT: 39,
			ARROW_LEFT: 37,
			ARROW_UP: 38,
			ARROW_DOWN: 40
		};

	var singlePageDialogDefinition = function() {
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
		multiPageDialogDefinition = function() {
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
		hiddenPageDialogDefinition = function() {
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
		};

	function onLoadHandler( evt ) {
		// This funciton should be called once per dialog, regardless of number of tests.
		var dialog = evt.sender;

		CKEDITOR.tools.array.forEach( CKEDITOR.tools.object.values( dialog._.tabs ), function( item ) {
			item[ 0 ].on( 'focus', function() {
				dialog.fire( 'focus:change' );
			}, null, null, 100000 );
		} );

		CKEDITOR.tools.array.forEach( dialog._.focusList, function( item ) {
			item.on( 'focus', function() {
				dialog.fire( 'focus:change' );
			}, null, null, 100000 );
		} );
	}

	function assertFocusedElement( config ) {
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
	}

	function assertFocusedTab( tabName ) {
		return function( dialog ) {
			assert.areEqual( -1, dialog._.currentFocusIndex );
			assert.areEqual( tabName, dialog._.currentTabId );

			return dialog;
		};
	}

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

	function focus( config ) {
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

	bender.editor = true;

	var tests = {
		'test single page dialog should focus elements in correct order': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'singlePageDialog' )
				.then( assertFocusedElement( {
					tab: 'sp-test1',
					elementId: 'sp-input1'
				} ) )
				.then( focus( {
					direction: 'next'
				} ) )
				.then( assertFocusedElement( {
					tab: 'sp-test1',
					elementId: 'sp-input2'
				} ) )
				.then( focus( {
					direction: 'next'
				} ) )
				.then( focus( {
					direction: 'next'
				} ) )
				.then( assertFocusedElement( {
					buttonName: 'cancel'
				} ) )
				.then( focus( {
					direction: 'previous'
				} ) )
				.then( assertFocusedElement( {
					tab: 'sp-test1',
					elementId: 'sp-input3'
				} ) );
		},

		// Test simulate focusing with "click" / "touch", as direct calling `click()` method on html element doesn't trigger focus change.
		'test single page dialog should set focused element after calling focus function': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'singlePageDialog' )
				.then( assertFocusedElement( {
					tab: 'sp-test1',
					elementId: 'sp-input1'
				} ) )
				.then( focus( {
					tab: 'sp-test1',
					elementId: 'sp-input2'
				} ) )
				.then( assertFocusedElement( {
					tab: 'sp-test1',
					elementId: 'sp-input2'
				} ) )
				.then( focus( {
					buttonName: 'ok'
				} ) )
				.then( assertFocusedElement( {
					buttonName: 'ok'
				} ) )
				.then( focus( {
					tab: 'sp-test1',
					elementId: 'sp-input1'
				} ) )
				.then( assertFocusedElement( {
					tab: 'sp-test1',
					elementId: 'sp-input1'
				} ) );
		},

		'test simple page dialog should set focus after keyboard operations': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'singlePageDialog' )
				.then( assertFocusedElement( {
					tab: 'sp-test1',
					elementId: 'sp-input1'
				} ) )
				.then( focus( {
					key: KEYS.TAB
				} ) )
				.then( assertFocusedElement( {
					tab: 'sp-test1',
					elementId: 'sp-input2'
				} ) )
				.then( focus( {
					key: KEYS.TAB,
					shiftKey: true
				} ) )
				.then( focus( {
					key: KEYS.TAB,
					shiftKey: true
				} ) )
				.then( assertFocusedElement( {
					buttonName: 'ok'
				} ) );
		},

		'test multi page dialog should focus elements in tab list': function() {
			var bot = this.editorBot;
			return bot.asyncDialog( 'multiPageDialog' )
				.then( assertFocusedElement( {
					tab: 'mp-test1',
					elementId: 'mp-input11'
				} ) )
				.then( focus( { direction: 'previous' } ) )
				.then( assertFocusedTab( 'mp-test1' ) );
		},

		'test multi page dialog should move focus to panel with TAB key': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'multiPageDialog' )
				.then( assertFocusedElement( {
					tab: 'mp-test1',
					elementId: 'mp-input11'
				} ) )
				.then( focus( { key: KEYS.TAB, shiftKey: true } ) )
				.then( assertFocusedTab( 'mp-test1' ) )
				.then( focus( { key: KEYS.TAB } ) )
				.then( assertFocusedElement( {
					tab: 'mp-test1',
					elementId: 'mp-input11'
				} ) );
		},

		'test multi page dialog should move focus to panel with SPACE key': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'multiPageDialog' )
				.then( assertFocusedElement( {
					tab: 'mp-test1',
					elementId: 'mp-input11'
				} ) )
				.then( focus( { direction: 'previous' } ) )
				.then( assertFocusedTab( 'mp-test1' ) )
				.then( focus( { key: KEYS.SPACE } ) )
				.then( assertFocusedElement( {
					tab: 'mp-test1',
					elementId: 'mp-input11'
				} ) );
		},

		'test multi page dialog should move focus to panel with ENTER key': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'multiPageDialog' )
				.then( assertFocusedElement( {
					tab: 'mp-test1',
					elementId: 'mp-input11'
				} ) )
				.then( focus( { direction: 'previous' } ) )
				.then( assertFocusedTab( 'mp-test1' ) )
				.then( focus( { key: KEYS.ENTER } ) )
				.then( assertFocusedElement( {
					tab: 'mp-test1',
					elementId: 'mp-input11'
				} ) );
		},

		'test multi page dialog should move focus to between tabs with ARROW keys': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'multiPageDialog' )
				.then( assertFocusedElement( {
					tab: 'mp-test1',
					elementId: 'mp-input11'
				} ) )
				.then( focus( { direction: 'previous' } ) )
				.then( assertFocusedTab( 'mp-test1' ) )
				.then( focus( { key: KEYS.ARROW_RIGHT } ) )
				.then( assertFocusedTab( 'mp-test2' ) )
				.then( focus( { key: KEYS.ARROW_UP } ) )
				.then( assertFocusedTab( 'mp-test1' ) )
				.then( focus( { key: KEYS.ARROW_DOWN } ) )
				.then( focus( { key: KEYS.ARROW_DOWN } ) )
				.then( assertFocusedTab( 'mp-test3' ) )
				.then( focus( { key: KEYS.ARROW_LEFT } ) )
				.then( assertFocusedTab( 'mp-test2' ) );
		},

		'test multi page dialog should bring focus to tab with ALT+F10 keys': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'multiPageDialog' )
				.then( assertFocusedElement( {
					tab: 'mp-test1',
					elementId: 'mp-input11'
				} ) )
				.then( focus( { direction: 'next' } ) )
				.then( focus( { direction: 'next' } ) )
				.then( assertFocusedElement( {
					tab: 'mp-test1',
					elementId: 'mp-input13'
				} ) )
				.then( focus( { key: KEYS.F10, altKey: true } ) )
				.then( assertFocusedTab( 'mp-test1' ) )
				.then( focus( { direction: 'previous' } ) )
				.then( focus( { direction: 'previous' } ) )
				.then( assertFocusedElement( {
					buttonName: 'cancel'
				} ) )
				.then( focus( { key: KEYS.F10, altKey: true } ) )
				.then( assertFocusedTab( 'mp-test1' ) );
		},

		'test hidden page dialog should skip focus from hidden element on page': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'hiddenPageDialog' )
				.then( assertFocusedElement( {
					tab: 'hp-test1',
					elementId: 'hp-input11'
				} ) )
				.then( focus( { direction: 'previous' } ) )
				.then( focus( { key: KEYS.ARROW_RIGHT } ) )
				.then( assertFocusedTab( 'hp-test2' ) )
				.then( focus( { direction: 'next' } ) )
				.then( assertFocusedElement( {
					tab: 'hp-test2',
					elementId: 'hp-input22'
				} ) )
				.then( focus( { direction: 'next' } ) )
				.then( assertFocusedElement( {
					buttonName: 'cancel'
				} ) );
		},

		'test hidden page dialog should skip focus from hidden tab on page': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'hiddenPageDialog' )
				.then( assertFocusedElement( {
					tab: 'hp-test1',
					elementId: 'hp-input11'
				} ) )
				.then( focus( { direction: 'previous' } ) )
				.then( focus( { key: KEYS.ARROW_RIGHT } ) )
				.then( assertFocusedTab( 'hp-test2' ) )
				.then( focus( { key: KEYS.ARROW_RIGHT } ) )
				.then( assertFocusedTab( 'hp-test4' ) );
		}
	};

	tests = bender.tools.createAsyncTests( tests );

	CKEDITOR.tools.extend( tests, {
		init: function() {
			CKEDITOR.dialog.add( 'singlePageDialogDefinition', singlePageDialogDefinition );
			CKEDITOR.dialog.add( 'multiPageDialogDefinition', multiPageDialogDefinition );
			CKEDITOR.dialog.add( 'hiddenPageDialogDefinition', hiddenPageDialogDefinition );

			this.editor.addCommand( 'singlePageDialog', new CKEDITOR.dialogCommand( 'singlePageDialogDefinition' ) );
			this.editor.addCommand( 'multiPageDialog', new CKEDITOR.dialogCommand( 'multiPageDialogDefinition' ) );
			this.editor.addCommand( 'hiddenPageDialog', new CKEDITOR.dialogCommand( 'hiddenPageDialogDefinition' ) );
		},

		tearDown: function() {
			var dialog;

			while ( ( dialog = CKEDITOR.dialog.getCurrent() ) ) {
				dialog.hide();
			}
		}
	} );

	bender.test( tests );
} )();
