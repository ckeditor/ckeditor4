/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea, table, tabletools, tableselection */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		doTest: function( name, command ) {
			var bot = this.editorBot;
			bender.tools.testInputOut( name, function( source, expected ) {
				bot.setHtmlWithSelection( source );
				bot.execCommand( command );

				var output = bot.getData( true );
				output = output.replace( /\u00a0/g, '&nbsp;' );
				assert.areSame( bender.tools.compatHtml( expected ), output );
			} );
		},

		// #577
		'test remove first column': function() {
			if ( ( CKEDITOR.env.ie && CKEDITOR.env.version < 11 ) || bender.tools.env.mobile ) {
				assert.ignore();
			}
			this.doTest( 'table-1', 'columnDelete' );
		},

		// #577
		'test remove 2 last columns by single row selection': function() {
			if ( ( CKEDITOR.env.ie && CKEDITOR.env.version < 11 ) || bender.tools.env.mobile ) {
				assert.ignore();
			}
			this.doTest( 'table-2', 'columnDelete' );
		},

		// #577
		'test remove selection colspan': function() {
			if ( ( CKEDITOR.env.ie && CKEDITOR.env.version < 11 ) || bender.tools.env.mobile ) {
				assert.ignore();
			}
			this.doTest( 'table-3', 'columnDelete' );
		},

		// #577
		'test remove single column under colspan': function() {
			if ( ( CKEDITOR.env.ie && CKEDITOR.env.version < 11 ) || bender.tools.env.mobile ) {
				assert.ignore();
			}
			this.doTest( 'table-4', 'columnDelete' );
		},

		// #577
		'test remove middle columns half with 2 colspans': function() {
			if ( ( CKEDITOR.env.ie && CKEDITOR.env.version < 11 ) || bender.tools.env.mobile ) {
				assert.ignore();
			}
			this.doTest( 'table-5', 'columnDelete' );
		},

		// #577
		'test remove multirange selection under colspan': function() {
			if ( ( CKEDITOR.env.ie && CKEDITOR.env.version < 11 ) || bender.tools.env.mobile ) {
				assert.ignore();
			}
			this.doTest( 'table-6', 'columnDelete' );
		},

		// #577
		'test remove entire table by column delete': function() {
			if ( ( CKEDITOR.env.ie && CKEDITOR.env.version < 11 ) || bender.tools.env.mobile ) {
				assert.ignore();
			}
			this.doTest( 'table-7', 'columnDelete' );
		}

	} );
} )();
