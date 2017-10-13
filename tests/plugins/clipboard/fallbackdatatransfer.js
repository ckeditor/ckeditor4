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

	'test setData/getData with predefined type - dataTransfer': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			eventMock = { data: { $: { clipboardData: nativeData } }, name: 'copy' },
			dataTransfer = CKEDITOR.plugins.clipboard.initPasteDataTransfer( eventMock );

		dataTransfer.setData( 'text/plain', 'plain text' );
		dataTransfer.setData( 'text/html', '<p>html text</p>' );

		assert.areSame( 'plain text', getDataNoCache( dataTransfer, 'text/plain' ) );
		assert.areSame( '<p>html text</p>', getDataNoCache( dataTransfer, 'text/html' ) );

		this.assertDataTransferType( dataTransfer, 'text/plain', 'plain text' );
		this.assertDataTransferType( dataTransfer, 'text/html', '<p>html text</p>', { 'cke/id': dataTransfer.id } );
	},

	'test setData/getData with predefined type - fallbackDataTransfer': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransferFallback = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( nativeData );

		dataTransferFallback.setData( 'text/plain', 'plain text' );
		dataTransferFallback.setData( 'text/html', '<p>html text</p>' );

		assert.areSame( 'plain text', dataTransferFallback.getData( 'text/plain' ) );
		assert.areSame( '<p>html text</p>', dataTransferFallback.getData( 'text/html' ) );
	},

	'test setData/getData with custom type - dataTransfer': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			eventMock = { data: { $: { clipboardData: nativeData } }, name: 'copy' },
			dataTransfer = CKEDITOR.plugins.clipboard.initPasteDataTransfer( eventMock );

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

	'test setData/getData with custom type - fallbackDataTransfer': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransferFallback = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( nativeData );

		dataTransferFallback.setData( 'cke/custom', 'cke-custom data' );
		dataTransferFallback.setData( 'custom/tag', '<p>custom html tag</p>' );

		assert.areSame( 'cke-custom data', dataTransferFallback.getData( 'cke/custom' ) );
		assert.areSame( '<p>custom html tag</p>', dataTransferFallback.getData( 'custom/tag' ) );

		this.assertDataTransferType( dataTransferFallback, 'text/html', '', {
			'cke/custom': 'cke-custom data',
			'custom/tag': '<p>custom html tag</p>'
		} );
	},

	'test setData with custom type does not affect getData( "text/html" ) - dataTransfer': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			eventMock = { data: { $: { clipboardData: nativeData } }, name: 'copy' },
			dataTransfer = CKEDITOR.plugins.clipboard.initPasteDataTransfer( eventMock );

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

	'test setData with custom type does not affect getData( "text/html" ) - fallbackDataTransfer': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransferFallback = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( nativeData );

		dataTransferFallback.setData( 'text/html', '<h1>Header1</h1>' );

		assert.areSame( dataTransferFallback.getData( 'text/html' ), '<h1>Header1</h1>' );

		dataTransferFallback.setData( 'cke/custom', 'custom data' );

		assert.areSame( dataTransferFallback.getData( 'text/html' ), '<h1>Header1</h1>' );
		assert.areSame( dataTransferFallback.getData( 'cke/custom' ), 'custom data' );
		this.assertDataTransferType( dataTransferFallback, 'text/html', '<h1>Header1</h1>', {
			'cke/custom': 'custom data'
		} );
	},

	'test setData( "text/html" ) does not overwrite custom data - dataTransfer': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			eventMock = { data: { $: { clipboardData: nativeData } }, name: 'copy' },
			dataTransfer = CKEDITOR.plugins.clipboard.initPasteDataTransfer( eventMock );

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

	'test setData( "text/html" ) does not overwrite custom data - fallbackDataTransfer': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransferFallback = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( nativeData );

		dataTransferFallback.setData( 'cke/custom', 'custom data' );

		assert.areSame( dataTransferFallback.getData( 'cke/custom' ), 'custom data' );
		this.assertDataTransferType( dataTransferFallback, 'text/html', '', {
			'cke/custom': 'custom data'
		} );

		dataTransferFallback.setData( 'text/html', '<h1>Header1</h1>' );

		assert.areSame( dataTransferFallback.getData( 'text/html' ), '<h1>Header1</h1>' );
		assert.areSame( dataTransferFallback.getData( 'cke/custom' ), 'custom data' );
		this.assertDataTransferType( dataTransferFallback, 'text/html', '<h1>Header1</h1>', {
			'cke/custom': 'custom data'
		} );
	},

	'test setData( "text/html" ) called a few times does not overwrite custom data - dataTransfer': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			eventMock = { data: { $: { clipboardData: nativeData } }, name: 'copy' },
			dataTransfer = CKEDITOR.plugins.clipboard.initPasteDataTransfer( eventMock );

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

	'test setData( "text/html" ) called a few times does not overwrite custom data - fallbackDataTransfer': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransferFallback = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( nativeData );

		dataTransferFallback.setData( 'cke/custom', 'custom data' );

		assert.areSame( dataTransferFallback.getData( 'cke/custom' ), 'custom data' );

		dataTransferFallback.setData( 'text/html', '<h1>Header1</h1>' );

		assert.areSame( dataTransferFallback.getData( 'text/html' ), '<h1>Header1</h1>' );
		assert.areSame( dataTransferFallback.getData( 'cke/custom' ), 'custom data' );

		dataTransferFallback.setData( 'text/html', '<h2>Header2</h2>' );

		assert.areSame( dataTransferFallback.getData( 'text/html' ), '<h2>Header2</h2>' );
		assert.areSame( dataTransferFallback.getData( 'cke/custom' ), 'custom data' );
		this.assertDataTransferType( dataTransferFallback, 'text/html', '<h2>Header2</h2>', {
			'cke/custom': 'custom data'
		} );
	},

	'test setting same custom type overwrites the previous value and does not affect other types - dataTransfer': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			eventMock = { data: { $: { clipboardData: nativeData } }, name: 'copy' },
			dataTransfer = CKEDITOR.plugins.clipboard.initPasteDataTransfer( eventMock );

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

	'test setting same custom type overwrites the previous value and does not affect other types - fallbackDataTransfer': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransferFallback = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( nativeData );

		dataTransferFallback.setData( 'cke/custom', 'cke-custom data' );
		dataTransferFallback.setData( 'custom/tag', '<p>custom html tag</p>' );

		assert.areSame( dataTransferFallback.getData( 'cke/custom' ), 'cke-custom data' );
		assert.areSame( dataTransferFallback.getData( 'custom/tag' ), '<p>custom html tag</p>' );
		this.assertDataTransferType( dataTransferFallback, 'text/html', '', {
			'cke/custom': 'cke-custom data',
			'custom/tag': '<p>custom html tag</p>'
		} );

		dataTransferFallback.setData( 'cke/custom', 'cke-custom' );

		assert.areSame( dataTransferFallback.getData( 'cke/custom' ), 'cke-custom' );
		assert.areSame( dataTransferFallback.getData( 'custom/tag' ), '<p>custom html tag</p>' );
		this.assertDataTransferType( dataTransferFallback, 'text/html', '', {
			'cke/custom': 'cke-custom',
			'custom/tag': '<p>custom html tag</p>'
		} );
	},

	'test getting "text/html" and "cke/test" from cache': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			eventMock = { data: { $: { clipboardData: nativeData } }, name: 'copy' },
			dataTransfer = CKEDITOR.plugins.clipboard.initPasteDataTransfer( eventMock );

		dataTransfer.setData( 'text/html', '<p>html text</p>' );
		dataTransfer.setData( 'cke/test', 'cke_test' );

		assert.areSame( '<p>html text</p>', dataTransfer.getData( 'text/html' ) );
		assert.areSame( 'cke_test', dataTransfer.getData( 'cke/test' ) );
	},

	'test _applyDataComment case1': function() {
		var dataTransferFallback = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( {} ),
			expected = document.querySelector( '#case1' ).innerHTML;

		this.assertApplyDataComment( '<h1>Header1</h1><p>Test1</p>', { test: 1 }, dataTransferFallback, expected );
	},

	'test _applyDataComment case2': function() {
		var dataTransferFallback = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( {} ),
			expected = document.querySelector( '#case2' ).innerHTML;

		this.assertApplyDataComment( '<h1>Header1</h1><p>Test1</p>', { test: 1, comment: '<!-- comment -->' }, dataTransferFallback, expected );
	},

	'test _applyDataComment case3': function() {
		var dataTransferFallback = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( {} ),
			expected = CKEDITOR.tools.trim( document.querySelector( '#case3' ).innerHTML );

		this.assertApplyDataComment( '<!-- Start Comment --><h1>Header1</h1><p>Test1</p>', { test: 1 }, dataTransferFallback, expected );
	},

	'test _applyDataComment case4': function() {
		var dataTransferFallback = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( {} ),
			expected = CKEDITOR.tools.trim( document.querySelector( '#case4' ).innerHTML );

		this.assertApplyDataComment( '<h1>Header1</h1><p>Test1</p><!-- End Comment -->', { test: 123 }, dataTransferFallback, expected );
	},

	'test _applyDataComment with empty content': function() {
		var dataTransferFallback = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( {} ),
			expected = CKEDITOR.tools.trim( document.querySelector( '#empty-content' ).innerHTML );

		this.assertApplyDataComment( undefined, { test: 1 }, dataTransferFallback, expected );
		this.assertApplyDataComment( null, { test: 1 }, dataTransferFallback, expected );
		this.assertApplyDataComment( '', { test: 1 }, dataTransferFallback, expected );
	},

	'test _applyDataComment with empty data': function() {
		var dataTransferFallback = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( {} ),
			expected = CKEDITOR.tools.trim( document.querySelector( '#empty-data' ).innerHTML );

		this.assertApplyDataComment( '<p>foobar</p>', '', dataTransferFallback, expected );
		this.assertApplyDataComment( '<p>foobar</p>', null, dataTransferFallback, expected );
		this.assertApplyDataComment( '<p>foobar</p>', {}, dataTransferFallback, expected );
	},

	'test _applyDataComment with empty content and data': function() {
		var dataTransferFallback = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( {} ),
			expected = '';

		this.assertApplyDataComment( undefined, null, dataTransferFallback, expected );
		this.assertApplyDataComment( null, undefined, dataTransferFallback, expected );
		this.assertApplyDataComment( '', {}, dataTransferFallback, expected );
	},

	'test _extractDataComment case1': function() {
		var fallbackDataTransfer = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( {} ),
			content = document.querySelector( '#case1' ).innerHTML,
			extracted = fallbackDataTransfer._extractDataComment( content );

		objectAssert.areEqual( extracted.data, { test: 1 } );
		assert.isInnerHtmlMatching( '<h1>Header1</h1><p>Test1</p>', extracted.content );
	},

	'test _extractDataComment case2': function() {
		var fallbackDataTransfer = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( {} ),
			content = document.querySelector( '#case2' ).innerHTML,
			extracted = fallbackDataTransfer._extractDataComment( content );

		objectAssert.areEqual( extracted.data, { test: 1, comment: '<!-- comment -->' } );
		assert.isInnerHtmlMatching( '<h1>Header1</h1><p>Test1</p>', extracted.content );
	},

	'test _extractDataComment case3': function() {
		var fallbackDataTransfer = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( {} ),
			content = document.querySelector( '#case3' ).innerHTML,
			extracted = fallbackDataTransfer._extractDataComment( content );

		objectAssert.areEqual( extracted.data, { test: 1 } );
		assert.isInnerHtmlMatching( '<!-- Start Comment --><h1>Header1</h1><p>Test1</p>', extracted.content );
	},

	'test _extractDataComment case4': function() {
		var fallbackDataTransfer = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( {} ),
			content = document.querySelector( '#case4' ).innerHTML,
			extracted = fallbackDataTransfer._extractDataComment( content );

		objectAssert.areEqual( extracted.data, { test: 123 } );
		assert.isInnerHtmlMatching( '<h1>Header1</h1><p>Test1</p><!-- End Comment -->', extracted.content );
	},

	'test _extractDataComment with empty content': function() {
		var fallbackDataTransfer = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( {} ),
			content = CKEDITOR.tools.trim( document.querySelector( '#empty-content' ).innerHTML ),
			extracted = fallbackDataTransfer._extractDataComment( content );

		objectAssert.areEqual( extracted.data, { test: 1 } );
		assert.areSame( '', extracted.content );
	},

	'test _extractDataComment with empty data': function() {
		var fallbackDataTransfer = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( {} ),
			content = CKEDITOR.tools.trim( document.querySelector( '#empty-data' ).innerHTML ),
			extracted = fallbackDataTransfer._extractDataComment( content );

		assert.isNull( extracted.data );
		assert.isInnerHtmlMatching( '<p>foobar</p>', extracted.content );
	},

	'test _extractDataComment with empty data and content': function() {
		var fallbackDataTransfer = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( {} ),
			extracted = fallbackDataTransfer._extractDataComment( '' );

		assert.isNull( extracted.data );
		assert.areSame( '', extracted.content );
	},

	'test _extractDataComment with falsy value': function() {
		var fallbackDataTransfer = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( {} );

		assert.areSame( '', fallbackDataTransfer._extractDataComment( '' ).content );
		assert.areSame( '', fallbackDataTransfer._extractDataComment( null ).content );
		assert.areSame( '', fallbackDataTransfer._extractDataComment( undefined ).content );
		assert.areSame( '', fallbackDataTransfer._extractDataComment( false ).content );
	},

	assertDataTransferType: function( dataTransfer, type, value, customValue ) {
		if ( CKEDITOR.env.ie && CKEDITOR.env.version >= 16 && customValue ) {
			value = '<!--cke-data:' + encodeURIComponent( JSON.stringify( customValue ) ) + '-->' + value;
		}

		var nativeDataTransfer = dataTransfer.$ || dataTransfer._nativeDataTransfer;
		assert.areSame( value, nativeDataTransfer.getData( type ) );
	},

	assertApplyDataComment: function( content, data, dataTransferFallback, expected ) {
		assert.isInnerHtmlMatching( expected.replace( /[\n\r\t]*/g, '' ), dataTransferFallback._applyDataComment( content, data ) );
	}
} );

// Gets data but clears the cache first, so data is extracted from saved types not from cache object.
function getDataNoCache( dataTransfer, type ) {
	dataTransfer._.data = {};
	return dataTransfer.getData( type );
}
