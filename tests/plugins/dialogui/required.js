/* bender-tags: editor */
/* bender-ckeditor-plugins: dialog,dialogui */

( function() {
	'use strict';

	var dialogDefinitions = {
		dialogRequired: {
			title: 'Dialog 1',
			contents: [
				{
					id: 'dialog',
					label: 'Test',
					elements: [
						{
							type: 'text',
							id: 'foo',
							label: 'bar',
							required: true
						}
					]
				}
			]
		},

		dialogNotRequired: {
			title: 'Dialog 2',
			contents: [
				{
					id: 'dialog',
					label: 'Test',
					elements: [
						{
							type: 'text',
							id: 'foo2',
							label: 'bar2',
							required: false
						}
					]
				}
			]
		}
	};

	CKEDITOR.on( 'instanceLoaded', function( evt ) {
		CKEDITOR.dialog.add( 'dialog1', function() {
			return dialogDefinitions.dialogRequired;
		} );

		CKEDITOR.dialog.add( 'dialog2', function() {
			return dialogDefinitions.dialogNotRequired;
		} );

		evt.editor.addCommand( 'dialog1', new CKEDITOR.dialogCommand( 'dialog1' ) );
		evt.editor.addCommand( 'dialog2', new CKEDITOR.dialogCommand( 'dialog2' ) );
	} );

	bender.editor = {};

	bender.test( {
		'test create dialog with the required property should add an asterisk': function() {
			var editor = this.editor;

			editor.openDialog( 'dialog1', function( dialog ) {
				resume( function() {
					wait( function() {
						var domId = dialog.getContentElement( 'dialog', 'foo' ).domId,
							label = document.getElementById( domId ).firstChild.innerHTML,
							expected = 'bar<span aria-hidden="true" class=\"cke_dialog_ui_labeled_required\">*</span>';

						assert.areSame( bender.tools.fixHtml( label ), expected );
						dialog.getButton( 'cancel' ).click();
					}, 100 );
				} );
			} );
			wait();
		},

		'test create dialog without the required property shouldn\'t add asterisk': function() {
			var editor = this.editor;

			editor.openDialog( 'dialog2', function( dialog ) {
				resume( function() {
					wait( function() {
						var domId = dialog.getContentElement( 'dialog', 'foo2' ).domId,
							label = document.getElementById( domId ).firstChild.innerHTML;

						assert.areSame( label, 'bar2' );
						dialog.getButton( 'cancel' ).click();
					}, 100 );
				} );
			} );
			wait();
		}
	} );
} )();
