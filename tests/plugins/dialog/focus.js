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
		definitions = window.dialogTools.definitions,
		assertFocusedElement = window.dialogTools.assertFocusedElement,
		assertFocusedTab = window.dialogTools.assertFocusedTab,
		focusElement = window.dialogTools.focusElement;

	bender.editor = true;

	var tests = {
		'test single page dialog should focus elements in correct order': function() {
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

		// Test simulate focusing with "click" / "touch", as direct calling `click()` method on html element doesn't trigger focus change.
		'test single page dialog should set focused element after calling focus function': function() {
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

		'test simple page dialog should set focus after keyboard operations': function() {
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

		'test multi page dialog should focus elements in tab list': function() {
			var bot = this.editorBot;
			return bot.asyncDialog( 'multiPageDialog' )
				.then( assertFocusedElement( {
					tab: 'mp-test1',
					elementId: 'mp-input11'
				} ) )
				.then( focusElement( { direction: 'previous' } ) )
				.then( assertFocusedTab( 'mp-test1' ) );
		},

		'test multi page dialog should move focus to panel with TAB key': function() {
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

		'test multi page dialog should move focus to panel with SPACE key': function() {
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

		'test multi page dialog should move focus to panel with ENTER key': function() {
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

		'test multi page dialog should move focus to between tabs with ARROW keys': function() {
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

		'test multi page dialog should bring focus to tab with ALT+F10 keys': function() {
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

		'test hidden page dialog should skip focus from hidden element on page': function() {
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

		'test hidden page dialog should skip focus from hidden tab on page': function() {
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
		}
	};

	tests = bender.tools.createAsyncTests( tests );

	CKEDITOR.tools.extend( tests, {
		init: function() {
			CKEDITOR.dialog.add( 'singlePageDialog', definitions.singlePage );
			CKEDITOR.dialog.add( 'multiPageDialog', definitions.multiPage );
			CKEDITOR.dialog.add( 'hiddenPageDialog', definitions.hiddenPage );

			this.editor.addCommand( 'singlePageDialog', new CKEDITOR.dialogCommand( 'singlePageDialog' ) );
			this.editor.addCommand( 'multiPageDialog', new CKEDITOR.dialogCommand( 'multiPageDialog' ) );
			this.editor.addCommand( 'hiddenPageDialog', new CKEDITOR.dialogCommand( 'hiddenPageDialog' ) );
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
