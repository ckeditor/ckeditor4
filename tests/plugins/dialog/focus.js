/* bender-tags: editor, dialog */
/* bender-ckeditor-plugins: dialog */

( function() {
	'use strict';
	// Test suite indicates if tests should have 5 second safety switch timeout for rejecting promises.
	// var hasRejects = false;
	var hasRejects = true,
		KEYS = {
			TAB: 9,
			ENTER: 13,
			SPACE: 32,
			F10: 121,
			RIGHT: 39,
			LEFT: 37,
			UP: 38,
			DOWN: 40
		};

	var singlePageDialogDefinition = function() {
		return {
			title: 'Single page dialog',
			contents: [
				{
					id: 'test1',
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
			onLoad: function( evt ) {
				// This funciton should be called once per dialog, regardless of number of tests.
				var dialog = evt.sender;

				// attach focus listener in dialog;
				CKEDITOR.tools.array.forEach( dialog._.focusList, function( item ) {
					item.on( 'focus', function() {
						dialog.fire( 'focus:change' );
					}, null, null, 100000 );
				} );

			}
		};
	};


	function assertFocus( dialog, config ) {
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
	}

	function _focus( dialog, direction ) {
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

			if ( direction === 'next' ) {
				dialog.changeFocus( 1 );
			} else {
				dialog.changeFocus( -1 );
			}
		} );
	}

	function focusNext( dialog ) {
		return _focus( dialog, 'next' );
	}

	function focusPrevious( dialog ) {
		return _focus( dialog, 'previous' );
	}

	function focusElement( dialog, config ) {
		var tab = config.tab,
			elementId = config.elementId,
			buttonName = config.buttonName,
			element;

		if ( buttonName )
			element = dialog.getButton( buttonName ).getInputElement();
		else {
			element = dialog.getContentElement( tab, elementId ).getInputElement();
		}

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

			element.focus();
		} );
	}

	function pressKey( dialog, config ) {
		var key = config.key,
			shiftKey = config.shiftKey || false,
			altKey = config.altKey || false;

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

			dialog._.element.fire( 'keydown', new CKEDITOR.dom.event( {
				keyCode: key,
				shiftKey: shiftKey,
				altKey: altKey
			} ) );
		} );

	}

	bender.editor = true;

	var tests = {
		'test single page dialog should focus elements in correct order': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'singlePageDialog' )
				.then( function( dialog ) {
					assertFocus( dialog, {
						tab: 'test1',
						elementId: 'sp-input1'
					} );
					return dialog;
				} )
				.then( focusNext )
				.then( function( dialog ) {
					return assertFocus( dialog, {
						tab: 'test1',
						elementId: 'sp-input2'
					} );
				} )
				.then( focusNext )
				.then( focusNext )
				.then( function( dialog ) {
					return assertFocus( dialog, {
							buttonName: 'cancel'
						} );
				} )
				.then( focusPrevious )
				.then( function( dialog ) {
					return assertFocus( dialog, {
							tab: 'test1',
							elementId: 'sp-input3'
						} );
				} );
		},

		// Test simulate focusing with "click" / "touch", as direct calling `click()` method on html element doesn't trigger focus change.
		'test single page dialog should set focused element after calling focus function': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'singlePageDialog' )
				.then( function( dialog ) {
					return assertFocus( dialog, {
							tab: 'test1',
							elementId: 'sp-input1'
						} );
				} )
				.then( function( dialog ) {
					return focusElement( dialog, {
							tab: 'test1',
							elementId: 'sp-input2'
						} );
				} )
				.then( function( dialog ) {
					return assertFocus( dialog, {
							tab: 'test1',
							elementId: 'sp-input2'
						} );
				} )
				.then( function( dialog ) {
					return focusElement( dialog, {
						buttonName: 'ok'
					} );
				} )
				.then( function( dialog ) {
					return assertFocus( dialog, {
							buttonName: 'ok'
						} );
				} );
		},

		'test simple page dialog should set focus after keyboard operations': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'singlePageDialog' )
				.then( function( dialog ) {
					return assertFocus( dialog, {
							tab: 'test1',
							elementId: 'sp-input1'
						} );
				} )
				.then( function( dialog ) {
					return pressKey( dialog, {
						key: KEYS.TAB
					} );
				} )
				.then( function( dialog ) {
					return assertFocus( dialog, {
							tab: 'test1',
							elementId: 'sp-input2'
						} );
				} )
				.then( function( dialog ) {
					return pressKey( dialog, {
						key: KEYS.TAB,
						shiftKey: true
					} );
				} )
				.then( function( dialog ) {
					return pressKey( dialog, {
						key: KEYS.TAB,
						shiftKey: true
					} );
				} )
				.then( function( dialog ) {
					return assertFocus( dialog, {
							buttonName: 'ok'
						} );
				} );
		}
	};

	tests = bender.tools.createAsyncTests( tests );

	CKEDITOR.tools.extend( tests, {
		init: function() {
			CKEDITOR.dialog.add( 'singlePageDialogDefinition', singlePageDialogDefinition );

			this.editor.addCommand( 'singlePageDialog', new CKEDITOR.dialogCommand( 'singlePageDialogDefinition' ) );
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
