/* bender-tags: editor, dialog */
/* bender-ckeditor-plugins: dialog */

( function() {
	'use strict';

	var hasRejects = false; // true;

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


	function assertFocus( dialog, element ) {
		var currentlyFocusedElement = dialog._.focusList[ dialog._.currentFocusIndex ];
		assert.areEqual( element, currentlyFocusedElement,
			'Element: "' + element.id + '" should be equal to currently focused element: "' + currentlyFocusedElement.id + '".' );
	}

	function _focus( dialog, direction ) {
		return new CKEDITOR.tools.promise( function( resolve, reject ) {
			dialog.once( 'focus:change', function() {
				CKEDITOR.tools.setTimeout( function() {
					resolve( dialog );
				} );
			} );

			if ( hasRejects ) {
				CKEDITOR.tools.setTimeout( reject, 5000 );
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


	bender.editor = true;

	var tests = {
		'test single page async': function() {
			var bot = this.editorBot;

			return bot.asyncDialog( 'singlePageDialog' )
				.then( function( dialog ) {
					assertFocus( dialog, dialog.getContentElement( 'test1', 'sp-input1' ) );
					return dialog;
				} )
				.then( focusNext )
				.then( function( dialog ) {
					assertFocus( dialog, dialog.getContentElement( 'test1', 'sp-input2' ) );
					return dialog;
				} )
				.then( focusNext )
				.then( focusNext )
				.then( function( dialog ) {
					assertFocus( dialog, dialog.getButton( 'cancel' ) );
					return dialog;
				} )
				.then( focusPrevious )
				.then( function( dialog ) {
					assertFocus( dialog, dialog.getContentElement( 'test1', 'sp-input3' ) );
					return dialog;
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
