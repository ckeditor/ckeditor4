/* bender-tags: editor */
/* bender-ckeditor-plugins: dialog */

( function() {
	function testBidiField( field, origValue, expectedDir ) {
		// Check the LTR/RTL marker is not present in the real input's value.
		var realValue = CKEDITOR.ui.dialog.uiElement.prototype.getValue.call( field );

		assert.areNotSame(
			( expectedDir == 'ltr' ? '\u202A' : expectedDir == 'rtl' ? '\u202B' : null ),
			realValue.charAt( 0 ),
			'input real value does not contain LTR/RTL marker'
		);

		if ( expectedDir ) {
			// Check that after getValue(), value contains the RTL/LTR marker.
			assert.areSame(
				( expectedDir == 'ltr' ? '\u202A' : '\u202B' ),
				field.getValue().charAt( 0 ),
				'after getValue() method is called, value contains ' + expectedDir + ' marker'
			);

			// Check getDirectionMarker() method.
			assert.areSame(
				expectedDir,
				field.getDirectionMarker(),
				'getDirectionMarker() indicates direction marker attribute is set to ' + expectedDir
			);
		} else {
			// Check that after getValue(), value DOES NOT contain the RTL/LTR marker.
			assert.isMatching( /^[^\u202A\u202B]/, field.getValue(), 'after getValue() method is activated, value does not contain RTL/LTR marker' );

			// Check getDirectionMarker() method.
			assert.isNull( field.getDirectionMarker(), 'getDirectionMarker() method indicates direction marker attribute does not exist' );
		}
	}

	function testNoValueOrNoneBidiField( field, origValue ) {
		// Check that real input's value equals to the value entered.
		var realValue = CKEDITOR.ui.dialog.uiElement.prototype.getValue.call( field );
		assert.areSame( realValue, origValue, 'input real value is equal to value entered' );

		// Check getValue().
		var msg;
		if ( origValue === '' )
			msg = 'after getValue() is called, value is empty';
		else
			msg = 'after getValue() is called, value is equal to the value entered';

		assert.areSame( origValue, field.getValue(), msg );

		// Check getDirectionMarker() method.
		assert.isNull( field.getDirectionMarker(), 'getDirectionMarker() method indicates direction marker attribute does not exist' );
	}

	bender.editor = true;

	bender.test( {
		setUp: function() {
			this.editor.addCommand( 'testDialog', new CKEDITOR.dialogCommand( 'testDialog' ) );

			CKEDITOR.dialog.add( 'testDialog', function() {
				return {
					title: 'Test Dialog',
					contents: [
						{
							id: 'info',
							elements: [
								{
									id: 'bidiField',
									type: 'text',
									bidi: true,
									label: 'label 1'
								},
								{
									id: 'nonBidiField',
									type: 'text',
									label: 'label 2'
								}
							]
						}
					]
				};
			} );
		},

		'test behavior of a field with bidi property': function() {
			var bot = this.editorBot,
				valueChecked = '';

			bot.dialog( 'testDialog', function( dialog ) {
				var field = dialog.getContentElement( 'info', 'bidiField' );

				// Call setValue() with value containing RTL marker.
				valueChecked = '\u202B' + 'hello!';
				field.setValue( valueChecked );
				testBidiField( field, valueChecked, 'rtl' );

				// Call setValue() with value containing LTR marker.
				valueChecked = '\u202A' + 'hello!';
				field.setValue( valueChecked );
				testBidiField( field, valueChecked, 'ltr' );

				// Call setValue() with value without any marker.
				valueChecked = 'hello!';
				field.setValue( valueChecked );
				testBidiField( field, valueChecked, '' );

				// Close dialog.
				dialog.getButton( 'ok' ).click();
			} );
		},

		'test behavior of a field that has no bidi property': function() {
			var bot = this.editorBot,
				valueChecked;

			bot.dialog( 'testDialog', function( dialog ) {
				var field = dialog.getContentElement( 'info', 'nonBidiField' );

				// Call setValue() with value containing RTL marker.
				valueChecked = '\u202B' + 'hello!';
				field.setValue( valueChecked );
				testNoValueOrNoneBidiField( field, valueChecked );

				// Call setValue() with value containing LTR marker.
				valueChecked = '\u202A' + 'hello!';
				field.setValue( valueChecked );
				testNoValueOrNoneBidiField( field, valueChecked );

				// Call setValue() with value without any marker.
				valueChecked = 'hello!';
				field.setValue( valueChecked );
				testNoValueOrNoneBidiField( field, valueChecked );

				// Close dialog.
				dialog.getButton( 'ok' ).click();
			} );
		},

		'test behavior of empty field with bidi property': function() {
			var bot = this.editorBot;

			bot.dialog( 'testDialog', function( dialog ) {
				var field = dialog.getContentElement( 'info', 'bidiField' );

				// Call setValue() with empty value.
				var valueChecked = '';
				field.setValue( valueChecked );
				testNoValueOrNoneBidiField( field, valueChecked );

				// Close dialog.
				dialog.getButton( 'ok' ).click();
			} );
		},

		'test behavior of empty field with no bidi property': function() {
			var bot = this.editorBot;

			bot.dialog( 'testDialog', function( dialog ) {
				var field = dialog.getContentElement( 'info', 'nonBidiField' );

				// Call setValue() with empty value.
				var valueChecked = '';
				field.setValue( valueChecked );
				testNoValueOrNoneBidiField( field, valueChecked );

				// Close dialog.
				dialog.getButton( 'ok' ).click();
			} );
		},

		'test behavior of a bidi field containing only the marker': function() {
			var bot = this.editorBot;

			bot.dialog( 'testDialog', function( dialog ) {
				var field = dialog.getContentElement( 'info', 'bidiField' );

				// Call setValue() with RTL marker only.
				field.setValue( '\u202B' );

				// Check the RTL marker is not present in the real input's value.
				var realValue = CKEDITOR.ui.dialog.uiElement.prototype.getValue.call( field );
				assert.areSame( '', realValue, 'input real value does not contain RTL marker' );

				// Check that after getValue() is called, value does not contain the RTL marker.
				assert.areSame( '', field.getValue(), 'after getValue() is called, value does not contain RTL marker' );

				// Close dialog.
				dialog.getButton( 'ok' ).click();
			} );
		},

		'test behavior of the setDirectionMarker() method': function() {
			var bot = this.editorBot,
				dir,
				msg;

			bot.dialog( 'testDialog', function( dialog ) {
				var field = dialog.getContentElement( 'info', 'bidiField' ),
					inputElement = field.getInputElement();

				// Check that direction attributes exist and set to rtl when setDirectionMarker is set to rtl.
				msg = 'when direction is set to rtl, direction attributes exist and contain rtl';
				dir = 'rtl';
				field.setDirectionMarker( dir );
				assert.areSame( dir, inputElement.getAttribute( 'data-cke-dir-marker' ), msg );
				assert.areSame( dir, inputElement.getAttribute( 'dir' ), msg );

				// Check that direction attributes exist and set to ltr when setDirectionMarker is set to ltr.
				msg = 'when direction is set to ltr, direction attributes exist and contain ltr';
				dir = 'ltr';
				field.setDirectionMarker( dir );
				assert.areSame( dir, inputElement.getAttribute( 'data-cke-dir-marker' ), msg );
				assert.areSame( dir, inputElement.getAttribute( 'dir' ), msg );

				// Check that null value resets direction attributes.
				msg = 'when direction is set to null, direction attributes are removed';
				dir = '';
				field.setDirectionMarker( dir );
				assert.isFalse( inputElement.hasAttribute( 'data-cke-dir-marker' ), msg );
				assert.isFalse( inputElement.hasAttribute( 'dir' ), msg );

				// Close dialog.
				dialog.getButton( 'ok' ).click();
			} );
		},

		'test behavior of the getDirectionMarker() method': function() {
			var bot = this.editorBot,
				dir = '',
				msg = '';

			bot.dialog( 'testDialog', function( dialog ) {
				var field = dialog.getContentElement( 'info', 'bidiField' );

				// Check getDirectionMarker() returns null value when direction is not set.
				msg = 'when direction is not set, getDirectionMarker() returns null';
				assert.isNull( field.getDirectionMarker(), msg );

				// Check getDirectionMarker() returns 'rtl' when direction is set to rtl.
				msg = 'when direction is set to rtl, getDirectionMarker() returns rtl';
				dir = 'rtl';
				field.setDirectionMarker( dir );
				assert.areSame( dir, field.getDirectionMarker(), msg );

				// Check getDirectionMarker() returns 'ltr' when direction is not set to ltr.
				msg = 'when direction is set to ltr, getDirectionMarker() returns ltr';
				dir = 'ltr';
				field.setDirectionMarker( dir );
				assert.areSame( dir, field.getDirectionMarker(), msg );

				// Close dialog.
				dialog.getButton( 'ok' ).click();
			} );
		}
	} );
} )();
