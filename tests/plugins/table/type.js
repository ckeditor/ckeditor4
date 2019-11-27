/* bender-tags: editor */
/* bender-ckeditor-plugins: toolbar,table */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		setUp: function() {
			// Ignored due to (#3688).
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
				assert.ignore();
			}
		},

		tearDown: function() {
			this.editor.editable().setHtml( '' );
		},

		'test inherits element API': function() {
			assert.isTrue( CKEDITOR.plugins.table.prototype instanceof CKEDITOR.dom.element );
		},

		'test argumentless construction': function() {
			assert.beautified.html( getExpectedHtml( 'initial' ), new CKEDITOR.plugins.table().getOuterHtml() );
		},

		'test element construction': function() {
			var element = getExpectedElement( 'headerless' );
			assert.beautified.html( element.getOuterHtml(), new CKEDITOR.plugins.table( element ).getOuterHtml() );
		},

		'test rows count': function() {
			var element = getExpectedElement( 'header-row' );
			assert.areEqual( 3, new CKEDITOR.plugins.table( element ).countRows() );
		},

		'test columns count': function() {
			var element = getExpectedElement( 'header-row' );
			assert.areEqual( 3, new CKEDITOR.plugins.table( element ).countColumns() );
		},

		'test columns count with colspan': function() {
			var element = getExpectedElement( 'colspan' );
			assert.areEqual( 3, new CKEDITOR.plugins.table( element ).countColumns() );
		},

		'test table has column headers': function() {
			var element = getExpectedElement( 'header-column' );
			assert.isTrue( new CKEDITOR.plugins.table( element ).hasColumnHeaders() );

			element = getExpectedElement( 'header-row' );
			assert.isFalse( new CKEDITOR.plugins.table( element ).hasColumnHeaders() );
		},

		'test table has row headers': function() {
			var element = getExpectedElement( 'header-column' );
			assert.isFalse( new CKEDITOR.plugins.table( element ).hasRowHeaders() );

			element = getExpectedElement( 'header-row' );
			assert.isTrue( new CKEDITOR.plugins.table( element ).hasRowHeaders() );
		},

		'test append empty': function() {
			var table = new CKEDITOR.plugins.table();
			table.appendEmpty( 2, 3 );
			assert.beautified.html( getExpectedHtml( 'empty' ), table.getOuterHtml() );
		},

		'test move row to header': function() {
			var table = new CKEDITOR.plugins.table( getExpectedElement( 'headerless' ) );
			table.moveRowToHeader();
			assert.beautified.html( getExpectedHtml( 'header-row' ), table.getOuterHtml() );
		},

		'test move header to body': function() {
			var table = new CKEDITOR.plugins.table( getExpectedElement( 'header-row' ) );
			table.moveHeaderToBody();
			assert.beautified.html( getExpectedHtml( 'headerless' ), table.getOuterHtml() );
		},

		'test convert column to header': function() {
			var table = new CKEDITOR.plugins.table( getExpectedElement( 'headerless' ) );
			table.convertColumnToHeader();
			assert.beautified.html( getExpectedHtml( 'header-column' ), table.getOuterHtml() );
		},

		'test convert column header to cells': function() {
			var table = new CKEDITOR.plugins.table( getExpectedElement( 'header-column' ) );
			table.convertColumnHeaderToCells();
			assert.beautified.html( getExpectedHtml( 'headerless' ), table.getOuterHtml() );
		},

		'test insert to editor': function() {
			var table = new CKEDITOR.plugins.table( getExpectedElement( 'headerless' ) ),
				editor = this.editor;

			table.insertToEditor( editor );

			assert.beautified.html( getExpectedHtml( 'headerless' ),
				editor.editable().findOne( 'table' ).getOuterHtml(), 'Table should be inserted into editor' );

			wait( function() {
				var range = editor.getSelection().getRanges()[ 0 ];

				assert.isTrue( range.collapsed, 'Range should be collapsed' );
				assert.areEqual( '1.1', range.startContainer.getText(), 'Range should point into correct cell' );
				assert.areEqual( 0, range.startOffset, 'Range should have correct start offset' );
				assert.areEqual( 0, range.endOffset, 'Range should have correct end offset' );
			}, 0 );
		},

		'test insert': function() {
			CKEDITOR.plugins.table.insert( this.editor, 2, 3 );

			assert.beautified.html( getExpectedHtml( 'insert' ),
				this.editor.editable().findOne( 'table' ).getOuterHtml() );
		}
	} );

	function getExpectedElement( id ) {
		var html = CKEDITOR.document.getById( id ).clone( true ).getOuterHtml();

		// Test HTML may contain some unexpected garbage like empty text nodes,
		// make sure to remove them or test may fail.
		html = bender.tools.compatHtml( html );

		var element = CKEDITOR.dom.element.createFromHtml( html );

		if ( !CKEDITOR.env.needsBrFiller ) {
			CKEDITOR.tools.array.forEach( element.find( 'br' ).toArray(), function( br ) {
				br.remove();
			} );
		}

		return element;
	}

	function getExpectedHtml( id ) {
		return getExpectedElement( id ).getOuterHtml();
	}

} )();
