/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: dialog */
( function() {
	function testBidiField( field, origValue, dir ) {
		var value = '',
			directionMarker = '',
			firstChar = '',
			msg = '';
		// Check the LTR/RTL marker is not present in the real input's value.
		msg = 'input real value does not contain LTR/RTL marker';
		var realValue = CKEDITOR.ui.dialog.uiElement.prototype.getValue.call( field );
		var realValueFirstChr = realValue.charAt( 0 );
		assert.areNotSame( realValueFirstChr, ( dir == 'ltr' ? '\u202A' : dir == 'rtl' ? '\u202B' : null ), msg );
		if ( dir ) {
			// Check that after getValue(), value contains the RTL/LTR marker.
			msg = 'after getValue() method is called, value contains ' + dir + ' marker';
			value = field.getValue();
			firstChar = value.charAt( 0 );
			assert.isTrue( firstChar == ( dir == 'ltr' ? '\u202A' : '\u202B' ), msg );
			//Check getDirectionMarker() method.
			msg = 'getDirectionMarker() indicates direction marker attribute is set to ' + dir;
			directionMarker = field.getDirectionMarker();
			assert.areSame( dir, directionMarker, msg );
		}
		else {
			// Check that after getValue(), value DOES NOT contain the RTL/LTR marker.
			msg = 'after getValue() method is activated, value does not contains RTL/LTR marker';
			value = field.getValue();
			firstChar = value.charAt( 0 );
			assert.areNotSame ( firstChar, '\u202A', msg );
			assert.areNotSame ( firstChar, '\u202B', msg );
			//Check getDirectionMarker() method.
			msg = 'getDirectionMarker() method indicates direction marker attribute does not exist';
			directionMarker = field.getDirectionMarker();
			assert.isNull( directionMarker, msg );
		}
	}
	function testNoValueOrNoneBidiField( field, origValue ) {
		var msg = '';
		// Check that real input's value equals to the value entered.
		msg = 'input real value is equal to value entered';
		var realValue = CKEDITOR.ui.dialog.uiElement.prototype.getValue.call( field );
		assert.areSame( realValue, origValue, msg );
		// Check getValue().
		if ( origValue === '' )
			msg = 'after getValue() is called, value is empty';
		else
			msg = 'after getValue() is called, value is equal to the value entered';
		var value = field.getValue();
		assert.areSame( value, origValue, msg );
		//Check getDirectionMarker() method.
		msg = 'getDirectionMarker() method indicates direction marker attribute does not exist';
		var directionMarker = field.getDirectionMarker();
		assert.isNull( directionMarker, msg );
	}
	bender.editor = true;
	bender.test(
	{
		setUp: function() {
			var ed = this.editor;
			ed.addCommand( 'testDialog', new CKEDITOR.dialogCommand( 'testDialog' ) );
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
		'test behaviour of a field with bidi property':function() {
			var bot = this.editorBot,
				valueChecked = '';
			bot.dialog( 'testDialog', function( dialog ) {
				var field = dialog.getContentElement( 'info', 'bidiField' );
				//Call setValue() with value containing RTL marker.
				valueChecked = '\u202B' + 'hello!';
				field.setValue( valueChecked );
				testBidiField( field, valueChecked, 'rtl' );
				//Call setValue() with value containing LTR marker.
				valueChecked = '\u202A' + 'hello!';
				field.setValue( valueChecked );
				testBidiField( field, valueChecked, 'ltr' );
				//Call setValue() with value without any marker.
				valueChecked = 'hello!';
				field.setValue( valueChecked );
				testBidiField( field, valueChecked, '' );
				// Close dialog
				dialog.getButton( 'ok' ).click();
			} );
		},
		'test behaviour of a field that has no bidi property':function() {
			var bot = this.editorBot;
			var valueChecked = '';
			bot.dialog( 'testDialog', function( dialog ) {
				var field = dialog.getContentElement( 'info', 'nonBidiField' );
				//Call setValue() with value containing RTL marker.
				valueChecked = '\u202B' + 'hello!';
				field.setValue( valueChecked );
				testNoValueOrNoneBidiField( field, valueChecked );
				//Call setValue() with value containing LTR marker.
				valueChecked = '\u202A' + 'hello!';
				field.setValue( valueChecked );
				testNoValueOrNoneBidiField( field, valueChecked );
				//Call setValue() with value without any marker.
				valueChecked = 'hello!';
				field.setValue( valueChecked );
				testNoValueOrNoneBidiField( field, valueChecked );
				// Close dialog
				dialog.getButton( 'ok' ).click();
			} );
		},
		'test behaviour of empty field with bidi property':function() {
			var bot = this.editorBot;
			bot.dialog( 'testDialog', function( dialog ) {
				var field = dialog.getContentElement( 'info', 'bidiField' );
				//Call setValue() with empty value.
				var valueChecked = '';
				field.setValue( valueChecked );
				testNoValueOrNoneBidiField( field, valueChecked );
				// Close dialog
				dialog.getButton( 'ok' ).click();
			} );
		},
		'test behaviour of empty field with no bidi property':function() {
			var bot = this.editorBot;
			bot.dialog( 'testDialog', function( dialog ) {
				var field = dialog.getContentElement( 'info', 'nonBidiField' );
				//Call setValue() with empty value.
				var valueChecked = '';
				field.setValue( valueChecked );
				testNoValueOrNoneBidiField( field, valueChecked );
				// Close dialog
				dialog.getButton( 'ok' ).click();
			} );
		},
		'test behaviour of a bidi field containing only the marker':function() {
			var bot = this.editorBot,
				msg = '';
			bot.dialog( 'testDialog', function( dialog ) {
				var field = dialog.getContentElement( 'info', 'bidiField' );
				//Call setValue() with RTL marker only.
				var valueChecked = '\u202B';
				field.setValue( valueChecked );
				// Check the RTL marker is not present in the real input's value.
				msg = 'input real value does not contain RTL marker';
				var realValue = CKEDITOR.ui.dialog.uiElement.prototype.getValue.call( field );
				assert.areSame( realValue, '', msg );
				// Check that after getValue() is called, value does not contain the RTL marker.
				msg = 'after getValue() is called, value does not contain RTL marker';
				var value = field.getValue();
				assert.areSame( value, '', msg );
				// Close dialog
				dialog.getButton( 'ok' ).click();
			} );
		},
		'test behaviour of the setDirectionMarker() method':function() {
			var bot = this.editorBot,
				dir = '',
				msg = '';
			bot.dialog( 'testDialog', function( dialog ) {
				var field = dialog.getContentElement( 'info', 'bidiField' );
				var inputElement = field.getInputElement();
				// check that direction attributes exist and set to rtl when setDirectionMarker is set to rtl
				msg = 'when direction is set to rtl, direction attributes exist and contain rtl';
				dir = 'rtl';
				field.setDirectionMarker( dir );
				assert.isTrue( inputElement.hasAttribute( 'data-cke-dir-marker' ), msg );
				assert.areSame( inputElement.getAttribute( 'data-cke-dir-marker' ), dir, msg );
				assert.isTrue( inputElement.hasAttribute( 'dir' ), msg );
				assert.areSame( inputElement.getAttribute( 'dir' ), dir, msg );
				// check that direction attributes exist and set to ltr when setDirectionMarker is set to ltr
				msg = 'when direction is set to ltr, direction attributes exist and contain ltr';
				dir = 'ltr';
				field.setDirectionMarker( dir );
				assert.isTrue( inputElement.hasAttribute( 'data-cke-dir-marker' ), msg );
				assert.areSame( inputElement.getAttribute( 'data-cke-dir-marker' ), dir, msg );
				assert.isTrue( inputElement.hasAttribute( 'dir' ), msg );
				assert.areSame( inputElement.getAttribute( 'dir' ), dir, msg );
				// check that null value resets direction attributes
				msg = 'when direction is set to null, direction attributes are removed';
				dir = '';
				field.setDirectionMarker( dir );
				assert.isFalse( inputElement.hasAttribute( 'data-cke-dir-marker' ), msg );
				assert.isFalse( inputElement.hasAttribute( 'dir' ), msg );
				// Close dialog
				dialog.getButton( 'ok' ).click();
			} );
		},
		'test behaviour of the getDirectionMarker() method':function() {
			var bot = this.editorBot,
				dir = '',
				directionMarker = '',
				msg = '';
			bot.dialog( 'testDialog', function( dialog ) {
				var field = dialog.getContentElement( 'info', 'bidiField' );
				// check getDirectionMarker() returns null value when direction is not set
				msg = 'when direction is not set, getDirectionMarker() returns null';
				directionMarker = field.getDirectionMarker();
				assert.isNull( directionMarker, msg );
				// check getDirectionMarker() returns 'rtl' when direction is set to rtl
				msg = 'when direction is set to rtl, getDirectionMarker() returns rtl';
				dir = 'rtl';
				field.setDirectionMarker( dir );
				directionMarker = field.getDirectionMarker();
				assert.areSame( directionMarker, dir, msg );
				// check getDirectionMarker() returns 'ltr' when direction is not set to ltr
				msg = 'when direction is set to ltr, getDirectionMarker() returns ltr';
				dir = 'ltr';
				field.setDirectionMarker( dir );
				directionMarker = field.getDirectionMarker();
				assert.areSame( directionMarker, dir, msg );
				// Close dialog
				dialog.getButton( 'ok' ).click();
			} );
		}
	} );
} )();