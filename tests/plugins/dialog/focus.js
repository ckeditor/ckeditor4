/* bender-tags: editor, dialog */
/* bender-ckeditor-plugins: dialog */

( function() {
	'use strict';

	var currentFocusCallback;
	var dialogItemFocusListener = function( evt ) {
		if ( currentFocusCallback ) {
			currentFocusCallback( evt.sender );
		}
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
					item.on( 'focus', dialogItemFocusListener, null, null, 100000 );
				} );

			}
		};
	};


	function assertFocus( dialog, element ) {
		var currentlyFocusedElement = dialog._.focusList[ dialog._.currentFocusIndex ];
		assert.areEqual( element, currentlyFocusedElement,
			'Element: "' + element.id + '" should be equal to currently focused element: "' + currentlyFocusedElement.id + '".'  );
	}

	function focusNext( dialog ) {
		dialog.changeFocus( 1 );
	}

	bender.editor = true;

	var tests = {
		init: function() {
			CKEDITOR.dialog.add( 'singlePageDialogDefinition', singlePageDialogDefinition );

			this.editor.addCommand( 'singlePageDialog', new CKEDITOR.dialogCommand( 'singlePageDialogDefinition' ) );
		},

		tearDown: function() {
			var dialog;

			currentFocusCallback = null;
			while ( ( dialog = CKEDITOR.dialog.getCurrent() ) ) {
				dialog.hide();
			}
		},

		'test single page test': function() {
			var bot = this.editorBot;

			bot.dialog( 'singlePageDialog', function( dialog ) {
				currentFocusCallback = function() {
					resume( function() {
						assertFocus( dialog, dialog.getContentElement( 'test1', 'sp-input2' ) );
					} );
				};

				assertFocus( dialog, dialog.getContentElement( 'test1', 'sp-input1' ) );

				focusNext( dialog );
				wait();
			} );
		}
	};

	bender.test( tests );
} )();
