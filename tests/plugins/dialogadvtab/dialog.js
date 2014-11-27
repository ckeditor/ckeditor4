/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: dialogadvtab,entities */

( function() {
	bender.editor = true;
	bender.test( {
		setUp: function() {
			var ed = this.editor;
			var adv = ed.plugins.dialogadvtab;
			ed.addCommand( 'testAdvTab', new CKEDITOR.dialogCommand( 'testAdvTab' ) );
			CKEDITOR.dialog.add( 'testAdvTab', function() {
				return {
					title: 'Test Adv Tab',
					contents: [ adv.createAdvancedTab( ed ) ]
				};
			} );
			// Force result data un-formatted.
			ed.dataProcessor.writer._.rules = {};
			ed.focus();
		},

		// #9553
		'test getStyle': function() {
			var bot = this.editorBot;

			bot.dialog( 'testAdvTab', function( dialog ) {
				var field = dialog.getContentElement( 'advanced', 'advStyles' );
				field.setValue( 'border-width: 2px; width: 200px;' );

				assert.areSame( '200px', field.getStyle( 'width' ) );
				assert.areSame( '2px', field.getStyle( 'border-width' ) );

				field.setValue( '  width: 300px; border-width: 5px;' );

				assert.areSame( '300px', field.getStyle( 'width' ) );
				assert.areSame( '5px', field.getStyle( 'border-width' ) );
			} );
		},

		// #9281
		'test dialog field updateStyle': function() {
			var bot = this.editorBot;
			bot.dialog( 'testAdvTab', function( dialog ) {
				var field = dialog.getContentElement( 'advanced', 'advStyles' );
				field.setValue( 'border-width: 2px; width: 200px;' );
				field.updateStyle( 'width', '300px' );

				var style = field.getValue();
				assert.isTrue(
					style == 'border-width:2px;width:300px;' ||
					style == 'border-bottom-width:2px;border-left-width:2px;border-right-width:2px;border-top-width:2px;width:300px;',
					style );

				field.updateStyle( 'border', '1px solid red' );

				style = field.getValue();
				assert.isTrue(
					style == 'border:1px solid red;width:300px;' ||
					// IE >= 11.
					style == 'border-image:none;border:1px solid red;width:300px;' ||
					style == 'border-bottom:red 1px;border-left:red 1px;border-right:red 1px;border-top:red 1px;width:300px;' ||
					style == 'border-bottom:red 1px solid;border-left:red 1px solid;border-right:red 1px solid;border-top:red 1px solid;width:300px;' ||
					style == 'border-bottom-color:red;border-bottom-width:1px;border-left-color:red;border-left-width:1px;border-right-color:red;border-right-width:1px;' +
						'border-style:initial;border-top-color:red;border-top-width:1px;width:300px;' ||
					style == 'border-bottom-color:red;border-bottom-style:solid;border-bottom-width:1px;border-left-color:red;border-left-style:solid;' +
						'border-left-width:1px;border-right-color:red;border-right-style:solid;border-right-width:1px;border-top-color:red;border-top-style:solid;border-top-width:1px;width:300px;',
					style );

				dialog.hide();
			} );
		}
	} );
} )();
	//]]>