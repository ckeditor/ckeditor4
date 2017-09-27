/* bender-tags: editor,clipboard,468,962 */
/* bender-ckeditor-plugins: toolbar,clipboard */
/* bender-include: _helpers/pasting.js */

'use strict';

bender.test( {
	init: function() {
		if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
			assert.ignore();
		}
	},

	'test setData/getData with predefined type': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		dataTransfer.setData( 'text/plain', 'plain text' );
		dataTransfer.setData( 'text/html', '<p>html text</p>' );

		assert.areSame( 'plain text', getDataNoCache( dataTransfer, 'text/plain' ) );
		assert.areSame( '<p>html text</p>', getDataNoCache( dataTransfer, 'text/html' ) );

		this.assertDataTransferType( dataTransfer, 'text/plain', 'plain text' );
		this.assertDataTransferType( dataTransfer, 'text/html', '<p>html text</p>', { 'cke/id': dataTransfer.id } );
	},

	'test setData/getData with custom type': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		dataTransfer.setData( 'cke/custom', 'cke-custom data' );
		dataTransfer.setData( 'custom/tag', '<p>custom html tag</p>' );

		assert.areSame( 'cke-custom data', getDataNoCache( dataTransfer, 'cke/custom' ) );
		assert.areSame( '<p>custom html tag</p>', getDataNoCache( dataTransfer, 'custom/tag' ) );

		this.assertDataTransferType( dataTransfer, 'text/html', '', {
			'cke/id': dataTransfer.id,
			'cke/custom': 'cke-custom data',
			'custom/tag': '<p>custom html tag</p>'
		} );
	},

	'test setData with custom type does not affect getData( "text/html" )': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		dataTransfer.setData( 'text/html', '<h1>Header1</h1>' );

		assert.areSame( getDataNoCache( dataTransfer, 'text/html' ), '<h1>Header1</h1>' );
		this.assertDataTransferType( dataTransfer, 'text/html', '<h1>Header1</h1>', { 'cke/id': dataTransfer.id } );

		dataTransfer.setData( 'cke/custom', 'custom data' );

		assert.areSame( getDataNoCache( dataTransfer, 'text/html' ), '<h1>Header1</h1>' );
		assert.areSame( getDataNoCache( dataTransfer, 'cke/custom' ), 'custom data' );
		this.assertDataTransferType( dataTransfer, 'text/html', '<h1>Header1</h1>', {
			'cke/id': dataTransfer.id,
			'cke/custom': 'custom data'
		} );
	},

	'test setData( "text/html" ) does not overwrite custom data': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		dataTransfer.setData( 'cke/custom', 'custom data' );

		assert.areSame( getDataNoCache( dataTransfer, 'cke/custom' ), 'custom data' );
		this.assertDataTransferType( dataTransfer, 'text/html', '', {
			'cke/id': dataTransfer.id,
			'cke/custom': 'custom data'
		} );

		dataTransfer.setData( 'text/html', '<h1>Header1</h1>' );

		assert.areSame( getDataNoCache( dataTransfer, 'text/html' ), '<h1>Header1</h1>' );
		assert.areSame( getDataNoCache( dataTransfer, 'cke/custom' ), 'custom data' );
		this.assertDataTransferType( dataTransfer, 'text/html', '<h1>Header1</h1>', {
			'cke/id': dataTransfer.id,
			'cke/custom': 'custom data'
		} );
	},

	'test setData( "text/html" ) called a few times does not overwrite custom data': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		dataTransfer.setData( 'cke/custom', 'custom data' );

		assert.areSame( getDataNoCache( dataTransfer, 'cke/custom' ), 'custom data' );

		dataTransfer.setData( 'text/html', '<h1>Header1</h1>' );

		assert.areSame( getDataNoCache( dataTransfer, 'text/html' ), '<h1>Header1</h1>' );
		assert.areSame( getDataNoCache( dataTransfer, 'cke/custom' ), 'custom data' );

		dataTransfer.setData( 'text/html', '<h2>Header2</h2>' );

		assert.areSame( getDataNoCache( dataTransfer, 'text/html' ), '<h2>Header2</h2>' );
		assert.areSame( getDataNoCache( dataTransfer, 'cke/custom' ), 'custom data' );
		this.assertDataTransferType( dataTransfer, 'text/html', '<h2>Header2</h2>', {
			'cke/id': dataTransfer.id,
			'cke/custom': 'custom data'
		} );
	},

	'test setting same custom type overwrites the previous value and does not affect other types': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		dataTransfer.setData( 'cke/custom', 'cke-custom data' );
		dataTransfer.setData( 'custom/tag', '<p>custom html tag</p>' );

		assert.areSame( getDataNoCache( dataTransfer, 'cke/custom' ), 'cke-custom data' );
		assert.areSame( getDataNoCache( dataTransfer, 'custom/tag' ), '<p>custom html tag</p>' );
		this.assertDataTransferType( dataTransfer, 'text/html', '', {
			'cke/id': dataTransfer.id,
			'cke/custom': 'cke-custom data',
			'custom/tag': '<p>custom html tag</p>'
		} );

		dataTransfer.setData( 'cke/custom', 'cke-custom' );

		assert.areSame( getDataNoCache( dataTransfer, 'cke/custom' ), 'cke-custom' );
		assert.areSame( getDataNoCache( dataTransfer, 'custom/tag' ), '<p>custom html tag</p>' );
		this.assertDataTransferType( dataTransfer, 'text/html', '', {
			'cke/id': dataTransfer.id,
			'cke/custom': 'cke-custom',
			'custom/tag': '<p>custom html tag</p>'
		} );
	},

	'test _applyDataComment case1': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( {} ),
			expected = document.querySelector( '#case1' ).innerHTML;

		this.assertApplyDataComment( '<h1>Header1</h1><p>Test1</p>', { test: 1 }, dataTransfer, expected );
	},

	'test _applyDataComment case2': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( {} ),
			expected = document.querySelector( '#case2' ).innerHTML;

		this.assertApplyDataComment( '<h1>Header1</h1><p>Test1</p>', { test: 1, comment: '<!-- comment -->' }, dataTransfer, expected );
	},

	'test _applyDataComment case3': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( {} ),
			expected = CKEDITOR.tools.trim( document.querySelector( '#case3' ).innerHTML );

		this.assertApplyDataComment( '<!-- Start Comment --><h1>Header1</h1><p>Test1</p>', { test: 1 }, dataTransfer, expected );
	},

	'test _applyDataComment case4': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( {} ),
			expected = CKEDITOR.tools.trim( document.querySelector( '#case4' ).innerHTML );

		this.assertApplyDataComment( '<h1>Header1</h1><p>Test1</p><!-- End Comment -->', { test: 123 }, dataTransfer, expected );
	},

	'test _applyDataComment with empty content': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( {} ),
			expected = CKEDITOR.tools.trim( document.querySelector( '#empty-content' ).innerHTML );

		this.assertApplyDataComment( undefined, { test: 1 }, dataTransfer, expected );
		this.assertApplyDataComment( null, { test: 1 }, dataTransfer, expected );
		this.assertApplyDataComment( '', { test: 1 }, dataTransfer, expected );
	},

	'test _applyDataComment with empty data': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( {} ),
			expected = CKEDITOR.tools.trim( document.querySelector( '#empty-data' ).innerHTML );

		this.assertApplyDataComment( '<p>foobar</p>', '', dataTransfer, expected );
		this.assertApplyDataComment( '<p>foobar</p>', null, dataTransfer, expected );
		this.assertApplyDataComment( '<p>foobar</p>', {}, dataTransfer, expected );
	},

	'test _applyDataComment with empty content and data': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( {} ),
			expected = '';

		this.assertApplyDataComment( undefined, null, dataTransfer, expected );
		this.assertApplyDataComment( null, undefined, dataTransfer, expected );
		this.assertApplyDataComment( '', {}, dataTransfer, expected );
	},

	'test _extractDataComment case1': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( {} ),
			content = document.querySelector( '#case1' ).innerHTML,
			extracted = dataTransfer._extractDataComment( content );

		objectAssert.areEqual( extracted.data, { test: 1 } );
		assert.isInnerHtmlMatching( '<h1>Header1</h1><p>Test1</p>', extracted.content );
	},

	'test _extractDataComment case2': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( {} ),
			content = document.querySelector( '#case2' ).innerHTML,
			extracted = dataTransfer._extractDataComment( content );

		objectAssert.areEqual( extracted.data, { test: 1, comment: '<!-- comment -->' } );
		assert.isInnerHtmlMatching( '<h1>Header1</h1><p>Test1</p>', extracted.content );
	},

	'test _extractDataComment case3': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( {} ),
			content = document.querySelector( '#case3' ).innerHTML,
			extracted = dataTransfer._extractDataComment( content );

		objectAssert.areEqual( extracted.data, { test: 1 } );
		assert.isInnerHtmlMatching( '<!-- Start Comment --><h1>Header1</h1><p>Test1</p>', extracted.content );
	},

	'test _extractDataComment case4': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( {} ),
			content = document.querySelector( '#case4' ).innerHTML,
			extracted = dataTransfer._extractDataComment( content );

		objectAssert.areEqual( extracted.data, { test: 123 } );
		assert.isInnerHtmlMatching( '<h1>Header1</h1><p>Test1</p><!-- End Comment -->', extracted.content );
	},

	'test _extractDataComment with empty content': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( {} ),
			content = CKEDITOR.tools.trim( document.querySelector( '#empty-content' ).innerHTML ),
			extracted = dataTransfer._extractDataComment( content );

		objectAssert.areEqual( extracted.data, { test: 1 } );
		assert.areSame( '', extracted.content );
	},

	'test _extractDataComment with empty data': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( {} ),
			content = CKEDITOR.tools.trim( document.querySelector( '#empty-data' ).innerHTML ),
			extracted = dataTransfer._extractDataComment( content );

		assert.isNull( extracted.data );
		assert.isInnerHtmlMatching( '<p>foobar</p>', extracted.content );
	},

	'test _extractDataComment with empty data and content': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( {} ),
			extracted = dataTransfer._extractDataComment( '' );

		assert.isNull( extracted.data );
		assert.areSame( '', extracted.content );
	},

	'test _extractDataComment with falsy value': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( {} );

		assert.areSame( '', dataTransfer._extractDataComment( '' ).content );
		assert.areSame( '', dataTransfer._extractDataComment( null ).content );
		assert.areSame( '', dataTransfer._extractDataComment( undefined ).content );
		assert.areSame( '', dataTransfer._extractDataComment( false ).content );
	},

	assertDataTransferType: function( dataTransfer, type, value, customValue ) {
		if ( CKEDITOR.env.ie && CKEDITOR.env.version >= 16 && customValue ) {
			value = '<!--cke-data:' + encodeURIComponent( JSON.stringify( customValue ) ) + '-->' + value;
		}
		assert.areSame( value, dataTransfer.$.getData( type ) );
	},

	assertApplyDataComment: function( content, data, dataTransfer, expected ) {
		assert.isInnerHtmlMatching( expected.replace( /[\n\r\t]*/g, '' ), dataTransfer._applyDataComment( content, data ) );
	}
} );

// Gets data but clears the cache first, so data is extracted from saved types not from cache object.
function getDataNoCache( dataTransfer, type ) {
	dataTransfer._.data = {};
	return dataTransfer.getData( type );
}
