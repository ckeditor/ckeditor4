/* bender-tags: editor,clipboard,468,962 */
/* bender-ckeditor-plugins: toolbar,clipboard */
/* bender-include: _helpers/pasting.js */

'use strict';

var isEdge16 = CKEDITOR.env.ie && CKEDITOR.env.version >= 16,
	nativeDataTransferAvailableOnPaste;

bender.test( {
	init: function() {
		if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
			assert.ignore();
		}

		// Browsers which does not support custom copy cut (CKEDITOR.plugins.clipboard.isCustomCopyCutSupported),
		// does not have native data transfer object passed to our wrapper (CKEDITOR.plugins.clipboard.dataTransfer),
		// because it is not available on paste. Checking values directly from native dataTransfer without cache
		// object (`getDataNoCache`) will simply not work returning empty values (#1296).
		nativeDataTransferAvailableOnPaste = CKEDITOR.plugins.clipboard.isCustomCopyCutSupported;
	},

	setUp: function() {
		CKEDITOR.plugins.clipboard.fallbackDataTransfer._customTypes = [];
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
			dataTransferFallback = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData )._.fallbackDataTransfer;

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
			dataTransferFallback = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData )._.fallbackDataTransfer;

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
			dataTransferFallback = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData )._.fallbackDataTransfer;

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
			dataTransferFallback = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData )._.fallbackDataTransfer;

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
			dataTransferFallback = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData )._.fallbackDataTransfer;

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
			dataTransferFallback = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData )._.fallbackDataTransfer;

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

	'test setData returns value which was set - fallbackDataTransfer': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransferFallback = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData )._.fallbackDataTransfer,
			setValue;

		setValue = dataTransferFallback.setData( 'cke/custom', 'custom data' );
		assert.areSame( dataTransferFallback.getData( 'cke/custom' ), 'custom data', 'cke/custom 1' );
		assert.areSame( setValue, isEdge16 ? getHtmlWithCustomData( '', { 'cke/custom': 'custom data' } ) : 'custom data', 'return val 1' );

		setValue = dataTransferFallback.setData( 'text/html', '<h1>Header1</h1>' );
		assert.areSame( dataTransferFallback.getData( 'text/html' ), '<h1>Header1</h1>', 'text/html 2' );
		assert.areSame( dataTransferFallback.getData( 'cke/custom' ), 'custom data', 'cke/custom 2' );
		assert.areSame( setValue, getHtmlWithCustomData( '<h1>Header1</h1>', isEdge16 ? { 'cke/custom': 'custom data' } : null ), 'return val 2' );

		setValue = dataTransferFallback.setData( 'text/html', '<h2>Header2</h2>' );
		assert.areSame( dataTransferFallback.getData( 'text/html' ), '<h2>Header2</h2>', 'text/html 3' );
		assert.areSame( dataTransferFallback.getData( 'cke/custom' ), 'custom data', 'cke/custom 3' );
		assert.areSame( setValue, getHtmlWithCustomData( '<h2>Header2</h2>', isEdge16 ? { 'cke/custom': 'custom data' } : null ), 'return val 3' );
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
		var dataTransferFallback = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( { _: { data: {} } } ),
			expected = document.querySelector( '#case1' ).innerHTML;

		this.assertApplyDataComment( '<h1>Header1</h1><p>Test1</p>', { test: 1 }, dataTransferFallback, expected );
	},

	'test _applyDataComment case2': function() {
		var dataTransferFallback = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( { _: { data: {} } } ),
			expected = document.querySelector( '#case2' ).innerHTML;

		this.assertApplyDataComment( '<h1>Header1</h1><p>Test1</p>', { test: 1, comment: '<!-- comment -->' }, dataTransferFallback, expected );
	},

	'test _applyDataComment case3': function() {
		var dataTransferFallback = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( { _: { data: {} } } ),
			expected = CKEDITOR.tools.trim( document.querySelector( '#case3' ).innerHTML );

		this.assertApplyDataComment( '<!-- Start Comment --><h1>Header1</h1><p>Test1</p>', { test: 1 }, dataTransferFallback, expected );
	},

	'test _applyDataComment case4': function() {
		var dataTransferFallback = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( { _: { data: {} } } ),
			expected = CKEDITOR.tools.trim( document.querySelector( '#case4' ).innerHTML );

		this.assertApplyDataComment( '<h1>Header1</h1><p>Test1</p><!-- End Comment -->', { test: 123 }, dataTransferFallback, expected );
	},

	'test _applyDataComment with empty content': function() {
		var dataTransferFallback = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( { _: { data: {} } } ),
			expected = CKEDITOR.tools.trim( document.querySelector( '#empty-content' ).innerHTML );

		this.assertApplyDataComment( undefined, { test: 1 }, dataTransferFallback, expected );
		this.assertApplyDataComment( null, { test: 1 }, dataTransferFallback, expected );
		this.assertApplyDataComment( '', { test: 1 }, dataTransferFallback, expected );
	},

	'test _applyDataComment with empty data': function() {
		var dataTransferFallback = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( { _: { data: {} } } ),
			expected = CKEDITOR.tools.trim( document.querySelector( '#empty-data' ).innerHTML );

		this.assertApplyDataComment( '<p>foobar</p>', '', dataTransferFallback, expected );
		this.assertApplyDataComment( '<p>foobar</p>', null, dataTransferFallback, expected );
		this.assertApplyDataComment( '<p>foobar</p>', {}, dataTransferFallback, expected );
	},

	'test _applyDataComment with empty content and data': function() {
		var dataTransferFallback = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( { _: { data: {} } } ),
			expected = '';

		this.assertApplyDataComment( undefined, null, dataTransferFallback, expected );
		this.assertApplyDataComment( null, undefined, dataTransferFallback, expected );
		this.assertApplyDataComment( '', {}, dataTransferFallback, expected );
	},

	'test _extractDataComment case1': function() {
		var fallbackDataTransfer = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( { _: { data: {} } } ),
			content = document.querySelector( '#case1' ).innerHTML,
			extracted = fallbackDataTransfer._extractDataComment( content );

		objectAssert.areEqual( extracted.data, { test: 1 } );
		assert.isInnerHtmlMatching( '<h1>Header1</h1><p>Test1</p>', extracted.content );
	},

	'test _extractDataComment case2': function() {
		var fallbackDataTransfer = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( { _: { data: {} } } ),
			content = document.querySelector( '#case2' ).innerHTML,
			extracted = fallbackDataTransfer._extractDataComment( content );

		objectAssert.areEqual( extracted.data, { test: 1, comment: '<!-- comment -->' } );
		assert.isInnerHtmlMatching( '<h1>Header1</h1><p>Test1</p>', extracted.content );
	},

	'test _extractDataComment case3': function() {
		var fallbackDataTransfer = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( { _: { data: {} } } ),
			content = document.querySelector( '#case3' ).innerHTML,
			extracted = fallbackDataTransfer._extractDataComment( content );

		objectAssert.areEqual( extracted.data, { test: 1 } );
		assert.isInnerHtmlMatching( '<!-- Start Comment --><h1>Header1</h1><p>Test1</p>', extracted.content );
	},

	'test _extractDataComment case4': function() {
		var fallbackDataTransfer = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( { _: { data: {} } } ),
			content = document.querySelector( '#case4' ).innerHTML,
			extracted = fallbackDataTransfer._extractDataComment( content );

		objectAssert.areEqual( extracted.data, { test: 123 } );
		assert.isInnerHtmlMatching( '<h1>Header1</h1><p>Test1</p><!-- End Comment -->', extracted.content );
	},

	'test _extractDataComment with empty content': function() {
		var fallbackDataTransfer = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( { _: { data: {} } } ),
			content = CKEDITOR.tools.trim( document.querySelector( '#empty-content' ).innerHTML ),
			extracted = fallbackDataTransfer._extractDataComment( content );

		objectAssert.areEqual( extracted.data, { test: 1 } );
		assert.areSame( '', extracted.content );
	},

	'test _extractDataComment with empty data': function() {
		var fallbackDataTransfer = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( { _: { data: {} } } ),
			content = CKEDITOR.tools.trim( document.querySelector( '#empty-data' ).innerHTML ),
			extracted = fallbackDataTransfer._extractDataComment( content );

		assert.isNull( extracted.data );
		assert.isInnerHtmlMatching( '<p>foobar</p>', extracted.content );
	},

	'test _extractDataComment with empty data and content': function() {
		var fallbackDataTransfer = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( { _: { data: {} } } ),
			extracted = fallbackDataTransfer._extractDataComment( '' );

		assert.isNull( extracted.data );
		assert.areSame( '', extracted.content );
	},

	'test _extractDataComment with falsy value': function() {
		var fallbackDataTransfer = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( { _: { data: {} } } );

		assert.areSame( '', fallbackDataTransfer._extractDataComment( '' ).content );
		assert.areSame( '', fallbackDataTransfer._extractDataComment( null ).content );
		assert.areSame( '', fallbackDataTransfer._extractDataComment( undefined ).content );
		assert.areSame( '', fallbackDataTransfer._extractDataComment( false ).content );
	},

	'test if isRequired sets _isCustomMimeTypeSupported flag on the first run': function() {
		var fallbackDataTransfer = new CKEDITOR.plugins.clipboard.fallbackDataTransfer(
			{ $: bender.tools.mockNativeDataTransfer(), _: { data: {} } } );

		CKEDITOR.plugins.clipboard.fallbackDataTransfer._isCustomMimeTypeSupported = null;

		var isRequiredValue = fallbackDataTransfer.isRequired(),
			flagValue = CKEDITOR.plugins.clipboard.fallbackDataTransfer._isCustomMimeTypeSupported;

		assert.isTrue( flagValue !== null, '_isCustomMimeTypeSupported should be set' );
		assert.isTrue( flagValue === false || flagValue === true, '_isCustomMimeTypeSupported should be only true or false' );
		assert.isTrue( flagValue !== isRequiredValue, 'isRequired should return value equal to !_isCustomMimeTypeSupported' );
	},

	'test if isRequired clears test MIME type': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			fallbackDataTransfer = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( { $: nativeData, _: { data: {} } } );

		CKEDITOR.plugins.clipboard.fallbackDataTransfer._isCustomMimeTypeSupported = null;

		fallbackDataTransfer.isRequired();

		assert.isTrue( nativeData.types.length === 0, 'dataTransfer.types should be empty' );
		assert.isTrue( CKEDITOR.tools.object.keys( nativeData._data ).length === 0, 'dataTransfer should be empty' );
	},

	'test if isRequired does not remove other MIME types': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			fallbackDataTransfer = new CKEDITOR.plugins.clipboard.fallbackDataTransfer( { $: nativeData, _: { data: {} } } );

		CKEDITOR.plugins.clipboard.fallbackDataTransfer._isCustomMimeTypeSupported = null;

		nativeData.setData( 'text/html', 'foobar' );

		fallbackDataTransfer.isRequired();

		assert.areSame( 1, nativeData.types.length, 'dataTransfer.types should only contain one type' );
		assert.areSame( 1, CKEDITOR.tools.object.keys( nativeData._data ).length, 'dataTransfer should only contain one type' );
		arrayAssert.itemsAreEqual( CKEDITOR.tools.object.keys( nativeData._data ), [ 'text/html' ], 'dataTransfer should only contain text/html' );
	},

	'test getFallbackTypeContent prioritize cache': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData ),
			dataTransferFallback = dataTransfer._.fallbackDataTransfer;

		dataTransfer._.data[ dataTransferFallback._customDataFallbackType ] = 'cache value';
		nativeData.setData( dataTransferFallback._customDataFallbackType, 'native value' );

		assert.areEqual( 'cache value', dataTransferFallback._getFallbackTypeContent() );
	},

	'test getFallbackTypeContent fallbacks to native data': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransferFallback = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData )._.fallbackDataTransfer;

		nativeData.setData( dataTransferFallback._customDataFallbackType, 'native value' );

		assert.areEqual( 'native value', dataTransferFallback._getFallbackTypeContent() );
	},

	'test getFallbackTypeContent for empty content in both cache and native data': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransferFallback = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData )._.fallbackDataTransfer;

		assert.areEqual( '', dataTransferFallback._getFallbackTypeContent() );
	},

	'test getFallbackTypeData prioritize cache': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData ),
			dataTransferFallback = dataTransfer._.fallbackDataTransfer;

		dataTransfer._.data[ 'cke/id' ] = 'cache value';
		CKEDITOR.plugins.clipboard.fallbackDataTransfer._customTypes.push( 'cke/id' );
		nativeData.setData( dataTransferFallback._customDataFallbackType,
			dataTransferFallback._applyDataComment( 'html', { 'cke/id': 'native value' } ) );

		objectAssert.areEqual( {
			'cke/id': 'cache value'
		}, dataTransferFallback._getFallbackTypeData() );
	},

	'test getFallbackTypeData fallbacks to native data': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransferFallback = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData )._.fallbackDataTransfer;

		nativeData.setData( dataTransferFallback._customDataFallbackType,
			dataTransferFallback._applyDataComment( 'html', { 'cke/id': 'native value' } ) );

		objectAssert.areEqual( {
			'cke/id': 'native value'
		}, dataTransferFallback._getFallbackTypeData() );
	},

	'test getFallbackTypeData for empty content in both cache and native data': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransferFallback = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData )._.fallbackDataTransfer;

		objectAssert.areEqual( {}, dataTransferFallback._getFallbackTypeData() );
	},

	'test getFallbackTypeData for empty content in both cache and native data with `_customTypes` set': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransferFallback = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData )._.fallbackDataTransfer,
			data;

		CKEDITOR.plugins.clipboard.fallbackDataTransfer._customTypes = [ 'cke/id', 'cke/data' ];
		data = dataTransferFallback._getFallbackTypeData();
		CKEDITOR.plugins.clipboard.fallbackDataTransfer._customTypes = [];

		objectAssert.areEqual( {}, data );
	},

	'test getData with getNative with custom type': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			eventMock = { data: { $: { clipboardData: nativeData } }, name: 'copy' },
			dataTransfer = CKEDITOR.plugins.clipboard.initPasteDataTransfer( eventMock ),
			html = '<s>html</s>';

		dataTransfer.setData( 'cke/custom', 'cke-custom data' );
		dataTransfer.setData( 'custom/tag', '<p>custom html tag</p>' );
		dataTransfer.setData( 'text/html', html );

		assert.areSame( 'cke-custom data', dataTransfer.getData( 'cke/custom', true ), 'cke/custom value' );
		assert.areSame( '<p>custom html tag</p>', dataTransfer.getData( 'custom/tag', true ), 'custom/tag value' );

		if ( isEdge16 ) {
			html = getHtmlWithCustomData( html, {
				'cke/id': dataTransfer.id,
				'cke/custom': 'cke-custom data',
				'custom/tag': '<p>custom html tag</p>'
			} );
		}
		assert.areSame( html, dataTransfer.getData( 'text/html', true ), 'text/html value' );
	},

	'test getData with getNative with custom type other sequence': function() {
		// This test has a different setData sequence than the "test getData with getNative with custom type" test.
		var nativeData = bender.tools.mockNativeDataTransfer(),
			eventMock = { data: { $: { clipboardData: nativeData } }, name: 'copy' },
			dataTransfer = CKEDITOR.plugins.clipboard.initPasteDataTransfer( eventMock ),
			html = '<s>html</s>';

		dataTransfer.setData( 'cke/custom', 'cke-custom data' );
		dataTransfer.setData( 'text/html', html );
		dataTransfer.setData( 'custom/tag', '<p>custom html tag</p>' );

		assert.areSame( 'cke-custom data', dataTransfer.getData( 'cke/custom', true ), 'cke/custom value' );
		assert.areSame( '<p>custom html tag</p>', dataTransfer.getData( 'custom/tag', true ), 'custom/tag value' );

		if ( isEdge16 ) {
			html = getHtmlWithCustomData( html, {
				'cke/id': dataTransfer.id,
				'cke/custom': 'cke-custom data',
				'custom/tag': '<p>custom html tag</p>'
			} );
		}
		assert.areSame( html, dataTransfer.getData( 'text/html', true ), 'text/html value' );
	},

	assertDataTransferType: function( dataTransfer, type, value, customValue ) {
		if ( isEdge16 && customValue ) {
			value = getHtmlWithCustomData( value, customValue );
		}

		var useDataTransfer = dataTransfer;
		if ( nativeDataTransferAvailableOnPaste ) {
			// If native data transfer is available, we use it.
			useDataTransfer = dataTransfer.$ || dataTransfer._dataTransfer.$;
		}
		assert.areSame( value, useDataTransfer.getData( type ) );
	},

	assertApplyDataComment: function( content, data, dataTransferFallback, expected ) {
		assert.isInnerHtmlMatching( expected.replace( /[\n\r\t]*/g, '' ), dataTransferFallback._applyDataComment( content, data ) );
	}
} );

// Gets data with omitting the cache.
function getDataNoCache( dataTransfer, type ) {
	// For browsers where `nativeDataTransferAvailableOnPaste` is false, there is no native dataTransfer so we must read from cache.
	return nativeDataTransferAvailableOnPaste ? dataTransfer._.fallbackDataTransfer.getData( type ) : dataTransfer.getData( type );
}

function getHtmlWithCustomData( htmlValue, customValue ) {
	if ( customValue ) {
		return '<!--cke-data:' + encodeURIComponent( JSON.stringify( customValue ) ) + '-->' + htmlValue;
	}
	return htmlValue;
}
