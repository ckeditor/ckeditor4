/* bender-tags: editor, dialog */
/* bender-ckeditor-plugins: dialog */
/* bender-include: _helpers/tools.js */

( function() {
	'use strict';

	var KEYS = {
			TAB: 9,
			ENTER: 13,
			SPACE: 32,
			F10: 121,
			ARROW_RIGHT: 39,
			ARROW_LEFT: 37,
			ARROW_UP: 38,
			ARROW_DOWN: 40
		},

		assertFocusedElement = window.dialogTools.assertFocusedElement,
		assertFocusedTab = window.dialogTools.assertFocusedTab,
		focusElement = window.dialogTools.focusElement,
		assertTabsAriaAttribute = window.dialogTools.assertTabsAriaAttribute,
		checkRadioGroupElement = window.dialogTools.checkRadioGroupElement;

	bender.editor = {
		config: {
			dialog_buttonsOrder: 'rtl'
		}
	};

	// Tests doesn't contain cases where focus is preserved on an element, as such cases doesn't trigger a focus event.
	// Detection of such situation would be really time consuming and might give a false positive results.
	var tests = {
		'test single page dialog should focus elements in a correct order': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'singlePageDialog' )
				.then( assertFocusedElement( {
					tab: 'sp-test1',
					elementId: 'sp-input1'
				} ) )
				.then( focusElement( {
					direction: 'next'
				} ) )
				.then( assertFocusedElement( {
					tab: 'sp-test1',
					elementId: 'sp-input2'
				} ) )
				.then( focusElement( {
					direction: 'next'
				} ) )
				.then( focusElement( {
					direction: 'next'
				} ) )
				.then( assertFocusedElement( {
					buttonName: 'cancel'
				} ) )
				.then( focusElement( {
					direction: 'previous'
				} ) )
				.then( assertFocusedElement( {
					tab: 'sp-test1',
					elementId: 'sp-input3'
				} ) );
		},

		// Test simulate focusing with "click" / "touch" by focusing specific element.
		// Direct call of `click()` method on the html element doesn't trigger focus change.
		'test single page dialog should change the focused element after executing the focus function': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'singlePageDialog' )
				.then( assertFocusedElement( {
					tab: 'sp-test1',
					elementId: 'sp-input1'
				} ) )
				.then( focusElement( {
					tab: 'sp-test1',
					elementId: 'sp-input2'
				} ) )
				.then( assertFocusedElement( {
					tab: 'sp-test1',
					elementId: 'sp-input2'
				} ) )
				.then( focusElement( {
					buttonName: 'ok'
				} ) )
				.then( assertFocusedElement( {
					buttonName: 'ok'
				} ) )
				.then( focusElement( {
					tab: 'sp-test1',
					elementId: 'sp-input1'
				} ) )
				.then( assertFocusedElement( {
					tab: 'sp-test1',
					elementId: 'sp-input1'
				} ) );
		},

		'test simple page dialog should change focus after pressing the TAB key': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'singlePageDialog' )
				.then( assertFocusedElement( {
					tab: 'sp-test1',
					elementId: 'sp-input1'
				} ) )
				.then( focusElement( {
					key: KEYS.TAB
				} ) )
				.then( assertFocusedElement( {
					tab: 'sp-test1',
					elementId: 'sp-input2'
				} ) )
				.then( focusElement( {
					key: KEYS.TAB,
					shiftKey: true
				} ) )
				.then( focusElement( {
					key: KEYS.TAB,
					shiftKey: true
				} ) )
				.then( assertFocusedElement( {
					buttonName: 'ok'
				} ) );
		},

		'test multi page dialog should focus elements in a tab list': function() {
			var bot = this.editorBot;
			return bot.asyncDialog( 'multiPageDialog' )
				.then( assertFocusedElement( {
					tab: 'mp-test1',
					elementId: 'mp-input11'
				} ) )
				.then( focusElement( { direction: 'previous' } ) )
				.then( assertFocusedTab( 'mp-test1' ) );
		},

		'test multi page dialog should move the focus to the panel with the TAB key': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'multiPageDialog' )
				.then( assertFocusedElement( {
					tab: 'mp-test1',
					elementId: 'mp-input11'
				} ) )
				.then( focusElement( { key: KEYS.TAB, shiftKey: true } ) )
				.then( assertFocusedTab( 'mp-test1' ) )
				.then( focusElement( { key: KEYS.TAB } ) )
				.then( assertFocusedElement( {
					tab: 'mp-test1',
					elementId: 'mp-input11'
				} ) );
		},

		'test multi page dialog should move the focus to the panel with the SPACE key': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'multiPageDialog' )
				.then( assertFocusedElement( {
					tab: 'mp-test1',
					elementId: 'mp-input11'
				} ) )
				.then( focusElement( { direction: 'previous' } ) )
				.then( assertFocusedTab( 'mp-test1' ) )
				.then( focusElement( { key: KEYS.SPACE } ) )
				.then( assertFocusedElement( {
					tab: 'mp-test1',
					elementId: 'mp-input11'
				} ) );
		},

		'test multi page dialog should move the focus to the panel with the ENTER key': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'multiPageDialog' )
				.then( assertFocusedElement( {
					tab: 'mp-test1',
					elementId: 'mp-input11'
				} ) )
				.then( focusElement( { direction: 'previous' } ) )
				.then( assertFocusedTab( 'mp-test1' ) )
				.then( focusElement( { key: KEYS.ENTER } ) )
				.then( assertFocusedElement( {
					tab: 'mp-test1',
					elementId: 'mp-input11'
				} ) );
		},

		'test multi page dialog should move the focus inside the tab navigation of a dialog with ARROW keys': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'multiPageDialog' )
				.then( assertFocusedElement( {
					tab: 'mp-test1',
					elementId: 'mp-input11'
				} ) )
				.then( focusElement( { direction: 'previous' } ) )
				.then( assertFocusedTab( 'mp-test1' ) )
				.then( focusElement( { key: KEYS.ARROW_RIGHT } ) )
				.then( assertFocusedTab( 'mp-test2' ) )
				.then( focusElement( { key: KEYS.ARROW_UP } ) )
				.then( assertFocusedTab( 'mp-test1' ) )
				.then( focusElement( { key: KEYS.ARROW_DOWN } ) )
				.then( focusElement( { key: KEYS.ARROW_DOWN } ) )
				.then( assertFocusedTab( 'mp-test3' ) )
				.then( focusElement( { key: KEYS.ARROW_LEFT } ) )
				.then( assertFocusedTab( 'mp-test2' ) );
		},

		// (#3547)
		'test multi page dialog should move the aria-selected attribute when navigating with ARROW keys': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'multiPageDialog' )
				.then( assertFocusedElement( {
					tab: 'mp-test1',
					elementId: 'mp-input11'
				} ) )
				.then( focusElement( { direction: 'previous' } ) )
				.then( assertTabsAriaAttribute() )
				.then( focusElement( { key: KEYS.ARROW_RIGHT } ) )
				.then( assertTabsAriaAttribute() )
				.then( focusElement( { key: KEYS.ARROW_UP } ) )
				.then( assertTabsAriaAttribute() )
				.then( focusElement( { key: KEYS.ARROW_DOWN } ) )
				.then( focusElement( { key: KEYS.ARROW_DOWN } ) )
				.then( assertTabsAriaAttribute() )
				.then( focusElement( { key: KEYS.ARROW_LEFT } ) )
				.then( assertTabsAriaAttribute() );
		},

		'test multi page dialog should bring the focus to the tab with the ALT+F10 keys': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'multiPageDialog' )
				.then( assertFocusedElement( {
					tab: 'mp-test1',
					elementId: 'mp-input11'
				} ) )
				.then( focusElement( { direction: 'next' } ) )
				.then( focusElement( { direction: 'next' } ) )
				.then( assertFocusedElement( {
					tab: 'mp-test1',
					elementId: 'mp-input13'
				} ) )
				.then( focusElement( { key: KEYS.F10, altKey: true } ) )
				.then( assertFocusedTab( 'mp-test1' ) )
				.then( focusElement( { direction: 'previous' } ) )
				.then( focusElement( { direction: 'previous' } ) )
				.then( assertFocusedElement( {
					buttonName: 'cancel'
				} ) )
				.then( focusElement( { key: KEYS.F10, altKey: true } ) )
				.then( assertFocusedTab( 'mp-test1' ) );
		},

		'test hidden page dialog should skip the focus of the hidden element on the page': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'hiddenPageDialog' )
				.then( assertFocusedElement( {
					tab: 'hp-test1',
					elementId: 'hp-input11'
				} ) )
				.then( focusElement( { direction: 'previous' } ) )
				.then( focusElement( { key: KEYS.ARROW_RIGHT } ) )
				.then( assertFocusedTab( 'hp-test2' ) )
				.then( focusElement( { direction: 'next' } ) )
				.then( assertFocusedElement( {
					tab: 'hp-test2',
					elementId: 'hp-input22'
				} ) )
				.then( focusElement( { direction: 'next' } ) )
				.then( assertFocusedElement( {
					buttonName: 'cancel'
				} ) );
		},

		'test hidden page dialog should skip the focus from the hidden tab on the page': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'hiddenPageDialog' )
				.then( assertFocusedElement( {
					tab: 'hp-test1',
					elementId: 'hp-input11'
				} ) )
				.then( focusElement( { direction: 'previous' } ) )
				.then( focusElement( { key: KEYS.ARROW_RIGHT } ) )
				.then( assertFocusedTab( 'hp-test2' ) )
				.then( focusElement( { key: KEYS.ARROW_RIGHT } ) )
				.then( assertFocusedTab( 'hp-test4' ) );
		},

		'test moving the focus from the input field to the first element of the radio group by pressing the TAB key when no elements from the radio group were selected': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'singleRadioGroupDialog' )
				.then( assertFocusedElement( {
					tab: 'srg-test1',
					elementId: 'srg-input1'
				} ) )
				.then( focusElement( { key: KEYS.TAB } ) )
				.then( assertFocusedElement( {
					tab: 'srg-test1',
					radioGroupId: 'srg-radio1',
					radioElementIndex: 0
				} ) );
		},

		'test moving the focus to the last element of the radio group by pressing SHIFT + TAB key': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'singleRadioGroupDialog' )
				.then( assertFocusedElement( {
					tab: 'srg-test1',
					elementId: 'srg-input1'
				} ) )
				.then( focusElement( { key: KEYS.TAB, shiftKey: true } ) )
				.then( focusElement( { key: KEYS.TAB, shiftKey: true } ) )
				.then( focusElement( { key: KEYS.TAB, shiftKey: true } ) )
				.then( focusElement( { key: KEYS.TAB, shiftKey: true } ) )
				.then( assertFocusedElement( {
					tab: 'srg-test1',
					radioGroupId: 'srg-radio1',
					radioElementIndex: 3
				} ) );
		},

		'test moving the focus from input field to previously checked radio group element by pressing TAB key': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'singleRadioGroupDialog' )
				.then( assertFocusedElement( {
					tab: 'srg-test1',
					elementId: 'srg-input1'
				} ) )
				.then( checkRadioGroupElement( {
					tab: 'srg-test1',
					radioGroupId: 'srg-radio1',
					radioElementIndex: 2
				} ) )
				.then( focusElement( { key: KEYS.TAB } ) )
				.then( assertFocusedElement( {
					tab: 'srg-test1',
					radioGroupId: 'srg-radio1',
					radioElementIndex: 2
				} ) );
		},

		'test moving the focus from the last radio group item to the next dialog element by pressing the TAB key': function() {
			var bot = this.editorBot;

			if ( CKEDITOR.env.ie ) {
				assert.ignore();
			}

			return bot.asyncDialog( 'singleRadioGroupDialog' )
				.then( assertFocusedElement( {
					tab: 'srg-test1',
					elementId: 'srg-input1'
				} ) )
				.then( checkRadioGroupElement( {
					tab: 'srg-test1',
					radioGroupId: 'srg-radio1',
					radioElementIndex: 3,
					focusElement: true
				} ) )
				.then( focusElement( { key: KEYS.TAB } ) )
				.then( assertFocusedElement( {
					tab: 'srg-test1',
					elementId: 'srg-input3'
				} ) );
		},

		'test moving the focus from the first focused radio group element to the first element from the next radio group by pressing the TAB key': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'multipleRadioGroupDialog' )
				.then( assertFocusedElement( {
					tab: 'mrg-test1',
					elementId: 'mrg-input1'
				} ) )
				.then( focusElement( { key: KEYS.TAB } ) )
				.then( assertFocusedElement( {
					tab: 'mrg-test1',
					radioGroupId: 'mrg-radio1',
					radioElementIndex: 0
				} ) )
				.then( focusElement( { key: KEYS.TAB } ) )
				.then( assertFocusedElement( {
					tab: 'mrg-test1',
					radioGroupId: 'mrg-radio2',
					radioElementIndex: 0
				} ) );
		},

		'test moving the focus from the first element of the second radio group to the last element from the previous radio group by pressing SHIFT + TAB key': function() {
			var bot = this.editorBot;

			if ( CKEDITOR.env.ie ) {
				assert.ignore();
			}

			return bot.asyncDialog( 'multipleRadioGroupDialog' )
				.then( assertFocusedElement( {
					tab: 'mrg-test1',
					elementId: 'mrg-input1'
				} ) )
				.then( checkRadioGroupElement( {
					tab: 'mrg-test1',
					radioGroupId: 'mrg-radio2',
					radioElementIndex: 0,
					focusElement: true
				} ) )
				.then( focusElement( { key: KEYS.TAB, shiftKey: true } ) )
				.then( assertFocusedElement( {
					tab: 'mrg-test1',
					radioGroupId: 'mrg-radio1',
					radioElementIndex: 2
				} ) );
		},

		'test moving the focus from the previously checked radio group element to the next checked element from the next radio group by pressing TAB key': function() {
			var bot = this.editorBot;

			if ( CKEDITOR.env.ie ) {
				assert.ignore();
			}

			return bot.asyncDialog( 'multipleRadioGroupDialog' )
				.then( assertFocusedElement( {
					tab: 'mrg-test1',
					elementId: 'mrg-input1'
				} ) )
				.then( checkRadioGroupElement( {
					tab: 'mrg-test1',
					radioGroupId: 'mrg-radio2',
					radioElementIndex: 2
				} ) )
				.then( checkRadioGroupElement( {
					tab: 'mrg-test1',
					radioGroupId: 'mrg-radio1',
					radioElementIndex: 1,
					focusElement: true
				} ) )
				.then( focusElement( { key: KEYS.TAB } ) )
				.then( assertFocusedElement( {
					tab: 'mrg-test1',
					radioGroupId: 'mrg-radio2',
					radioElementIndex: 2
				} ) );
		},

		'test moving the focus from the checked radio group element to the previous checked element from the previously radio group by pressing SHIFT + TAB key': function() {
			var bot = this.editorBot;

			if ( CKEDITOR.env.ie ) {
				assert.ignore();
			}

			return bot.asyncDialog( 'multipleRadioGroupDialog' )
				.then( assertFocusedElement( {
					tab: 'mrg-test1',
					elementId: 'mrg-input1'
				} ) )
				.then( checkRadioGroupElement( {
					tab: 'mrg-test1',
					radioGroupId: 'mrg-radio1',
					radioElementIndex: 2
				} ) )
				.then( checkRadioGroupElement( {
					tab: 'mrg-test1',
					radioGroupId: 'mrg-radio2',
					radioElementIndex: 1,
					focusElement: true
				} ) )
				.then( focusElement( { key: KEYS.TAB, shiftKey: true } ) )
				.then( assertFocusedElement( {
					tab: 'mrg-test1',
					radioGroupId: 'mrg-radio1',
					radioElementIndex: 2
				} ) );
		}
	};

	tests = bender.tools.createAsyncTests( tests );

	CKEDITOR.tools.extend( tests, {
		init: function() {
			window.dialogTools.addPredefinedDialogsToEditor( this.editor );
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