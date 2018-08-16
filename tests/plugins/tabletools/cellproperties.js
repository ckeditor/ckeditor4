/* bender-tags: editor */
/* bender-ckeditor-plugins: entities,dialog,tabletools,toolbar */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		doTest: function( name, dialogCallback ) {
			var bot = this.editorBot;

			bender.tools.testInputOut( name, function( source, expected ) {
				bot.setHtmlWithSelection( source );

				bot.dialog( 'cellProperties', function( dialog ) {
					try {
						if ( dialogCallback )
							dialogCallback( dialog );

						dialog.getButton( 'ok' ).click();
					} catch ( e ) {
						throw e;
					} finally {
						dialog.hide();
					}

					assert.areSame( bender.tools.compatHtml( expected ), bot.getData( true ) );
				} );
			} );
		},

		'test cell properties dialog (text selection)': function() {
			this.doTest( 'table-1', function( dialog ) {
				dialog.setValueOf( 'info', 'width', 100 );
				dialog.setValueOf( 'info', 'height', 50 );
			} );
		},

		// https://dev.ckeditor.com/ticket/11439
		'test load and update field values (#1)': function() {
			this.doTest( 'table-2', function( dialog ) {
				assert.areSame( '', dialog.getValueOf( 'info', 'rowSpan' ) );
			} );
		},

		// https://dev.ckeditor.com/ticket/11439
		'test load and update field values (#2)': function() {
			this.doTest( 'table-3', function( dialog ) {
				assert.areSame( '', dialog.getValueOf( 'info', 'rowSpan' ) );
			} );
		},

		// https://dev.ckeditor.com/ticket/11439
		'test load and update field values (#3)': function() {
			this.doTest( 'table-4', function( dialog ) {
				assert.areSame( '', dialog.getValueOf( 'info', 'colSpan' ) );
			} );
		},

		// https://dev.ckeditor.com/ticket/11439
		'test load and update field values (#4)': function() {
			this.doTest( 'table-5', function( dialog ) {
				assert.areSame( '', dialog.getValueOf( 'info', 'colSpan' ) );
			} );
		},

		// https://dev.ckeditor.com/ticket/11439
		'test load and update field values (#5)': function() {
			this.doTest( 'table-6', function( dialog ) {
				assert.areSame( '', dialog.getValueOf( 'info', 'height' ) );
				assert.areSame( 'px', dialog.getValueOf( 'info', 'widthType' ) );
				assert.areSame( '', dialog.getValueOf( 'info', 'wordWrap' ) );
				assert.areSame( '', dialog.getValueOf( 'info', 'rowSpan' ) );

				dialog.setValueOf( 'info', 'width', 100 );
				dialog.setValueOf( 'info', 'bgColor', 'red' );
				dialog.setValueOf( 'info', 'hAlign', 'right' );
			} );
		},

		// https://dev.ckeditor.com/ticket/11439
		'test load and update field values (#6)': function() {
			this.doTest( 'table-7', function( dialog ) {
				assert.areSame( '50', dialog.getValueOf( 'info', 'width' ) );
				assert.areSame( 'px', dialog.getValueOf( 'info', 'widthType' ) );

				dialog.setValueOf( 'info', 'width', 20 );
			} );
		},

		// https://dev.ckeditor.com/ticket/11439
		'test load and update field values (#7)': function() {
			this.doTest( 'table-8', function( dialog ) {
				assert.areSame( '50', dialog.getValueOf( 'info', 'width' ) );
				assert.areSame( '', dialog.getValueOf( 'info', 'widthType' ) );

				dialog.setValueOf( 'info', 'width', 20 );
			} );
		},

		// https://dev.ckeditor.com/ticket/11439
		'test load and update field values (#8)': function() {
			this.doTest( 'table-9', function( dialog ) {
				assert.areSame( '', dialog.getValueOf( 'info', 'cellType' ) );
				assert.areSame( 'red', dialog.getValueOf( 'info', 'bgColor' ) );

				dialog.setValueOf( 'info', 'cellType', 'td' );
				dialog.setValueOf( 'info', 'bgColor', 'green' );
			} );
		},

		// https://dev.ckeditor.com/ticket/11439
		'test load and update field values (#9)': function() {
			this.doTest( 'table-10', function( dialog ) {
				assert.areSame( '', dialog.getValueOf( 'info', 'width' ) );
				assert.areSame( '', dialog.getValueOf( 'info', 'widthType' ) );

				dialog.setValueOf( 'info', 'width', 10 );
			} );
		},

		// https://dev.ckeditor.com/ticket/11439
		'test load and update field values (#10)': function() {
			this.doTest( 'table-11', function( dialog ) {
				assert.areSame( '', dialog.getValueOf( 'info', 'width' ) );
				assert.areSame( '', dialog.getValueOf( 'info', 'widthType' ) );

				dialog.setValueOf( 'info', 'width', 10 );
				dialog.setValueOf( 'info', 'widthType', 'px' );
			} );
		},

		// https://dev.ckeditor.com/ticket/16893
		'test allowedContent rule': function() {
			bender.editorBot.create( {
				name: 'required',
				config: {
					allowedContent: '*[lang,dir]; table tbody thead tr th td tfoot'
				}
			}, function( bot ) {
				bot.setHtmlWithSelection( '<table><tr><td>Te^st</td></tr></table>' );
				bot.dialog( 'cellProperties', function( dialog ) {
					assert.isFalse( dialog.getContentElement( 'info', 'width' ).isVisible() );
					assert.isFalse( dialog.getContentElement( 'info', 'height' ).isVisible() );
					assert.isFalse( dialog.getContentElement( 'info', 'htmlHeightType' ).isVisible() );
					assert.isFalse( dialog.getContentElement( 'info', 'hiddenSpacer' ).isVisible() );
				} );
			} );
		},

		// https://dev.ckeditor.com/ticket/16893
		'test disallowedContent rule': function() {
			bender.editorBot.create( {
				name: 'editor'
			}, function( bot ) {
				bot.setHtmlWithSelection( '<table><tr><td>Te^st</td></tr></table>' );
				bot.dialog( 'cellProperties', function( dialog ) {
					assert.isTrue( dialog.getContentElement( 'info', 'width' ).isVisible() );
					assert.isTrue( dialog.getContentElement( 'info', 'height' ).isVisible() );
					assert.isTrue( dialog.getContentElement( 'info', 'htmlHeightType' ).isVisible() );
					assert.isTrue( dialog.getContentElement( 'info', 'hiddenSpacer' ).isVisible() );
				} );
			} );
		}
	} );
} )();
