/* bender-tags: editor,clipboard,13690 */
/* bender-ckeditor-plugins: toolbar,clipboard */
/* bender-include: _helpers/pasting.js */

'use strict';

var htmlMatchOpts = {
		fixStyles: true
	},
	/* jshint -W100, -W113 */
	// An example of garbage string sometimes appended to Chrome.
	garbage = ';\��VN�';
	/* jshint +W100, +W113 */

bender.editors = {
	editor1: {
		name: 'editor1'
	},
	editor2: {
		name: 'editor2'
	}
};

bender.test( {
	setUp: function() {
		CKEDITOR.plugins.clipboard.resetDragDataTransfer();
	},

	assertDataTransfer: function( expected, dataTransfer ) {
		assert.areSame( expected.transferType, dataTransfer.getTransferType( expected.targetEditor ), 'transferType' );
		assert.areSame( expected.sourceEditor, dataTransfer.sourceEditor, 'sourceEditor' );
		assert.areSame( expected.text, dataTransfer.getData( 'text/plain' ), 'getData( \'text/plain\' )' );
		assert.isInnerHtmlMatching( expected.html,  dataTransfer.getData( 'text/html' ), htmlMatchOpts, 'getData( \'text/html\' )' );
	},

	'test id': function() {
		var nativeData1 = bender.tools.mockNativeDataTransfer(),
			nativeData2 = bender.tools.mockNativeDataTransfer(),
			dataTransfer1a,
			dataTransfer1b,
			dataTransfer2;

		// Setting id was moved from dataTransfer constructor to functions which initialize dataTransfer object
		// only on specific events so we need to simulate these behaviour here too (#962).
		dataTransfer1a = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData1 );
		dataTransfer1a.storeId();

		dataTransfer1b = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData1 );
		dataTransfer1b.storeId();

		dataTransfer2 = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData2 );
		dataTransfer2.storeId();

		assert.areSame( dataTransfer1a.id, dataTransfer1b.id, 'Ids for object based on the same event should be the same.' );

		// In IE we can not use any data type besides text, so id is fixed.
		if ( CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
			assert.areNotSame( dataTransfer1a.id, dataTransfer2.id, 'Ids for object based on different events should be different.' );
		}
	},

	'test internal drag drop': function() {
		var bot = this.editorBots.editor1,
			editor = this.editors.editor1,
			nativeData,
			dataTransfer;

		bot.setHtmlWithSelection( '<p>x[x<b>foo</b>x]x</p>' );

		nativeData = bender.tools.mockNativeDataTransfer();
		nativeData.setData( 'Text', 'bar' );

		dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData, editor );

		this.assertDataTransfer( {
				transferType: CKEDITOR.DATA_TRANSFER_INTERNAL,
				sourceEditor: editor,
				targetEditor: editor,
				text: 'bar',
				html: 'x<b>foo</b>x' },
			dataTransfer );
	},

	'test internal drag drop, no event': function() {
		var isCustomDataTypesSupported = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported,
			bot = this.editorBots.editor1,
			editor = this.editors.editor1,
			dataTransfer;

		bot.setHtmlWithSelection( '<p>x[x<b>foo</b>x]x</p>' );

		dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( null, editor );

		this.assertDataTransfer( {
				transferType: CKEDITOR.DATA_TRANSFER_INTERNAL,
				sourceEditor: editor,
				targetEditor: editor,
				text: isCustomDataTypesSupported ? 'xfoox' : '',
				html: 'x<b>foo</b>x' },
			dataTransfer );
	},

	'test drop text from external source': function() {
		var editor = this.editors.editor1,
			nativeData,
			dataTransfer;

		nativeData = bender.tools.mockNativeDataTransfer();
		nativeData.setData( 'Text', 'x<b>foo</b>x' );

		dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		this.assertDataTransfer( {
				transferType: CKEDITOR.DATA_TRANSFER_EXTERNAL,
				sourceEditor: undefined,
				targetEditor: editor,
				text: 'x<b>foo</b>x',
				html: '' },
			dataTransfer );
	},

	'test drop html from external source': function() {
		var isCustomDataTypesSupported = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported,
			editor = this.editors.editor1,
			nativeData,
			dataTransfer;

		nativeData = bender.tools.mockNativeDataTransfer();
		nativeData.setData( 'Text', 'bar' );
		if ( isCustomDataTypesSupported ) {
			nativeData.setData( 'text/html', 'x<b>foo</b>x' );
		}

		dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		this.assertDataTransfer( {
				transferType: CKEDITOR.DATA_TRANSFER_EXTERNAL,
				sourceEditor: undefined,
				targetEditor: editor,
				text: 'bar',
				html: isCustomDataTypesSupported ? 'x<b>foo</b>x' : '' },
			dataTransfer );
	},

	'test drag drop between editors': function() {
		var bot1 = this.editorBots.editor1,
			editor1 = this.editors.editor1,
			editor2 = this.editors.editor2,
			nativeData,
			dataTransfer;

		bot1.setHtmlWithSelection( '<p>x[x<b>foo</b>x]x</p>' );

		nativeData = bender.tools.mockNativeDataTransfer();
		nativeData.setData( 'Text', 'bar' );

		dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData, editor1 );

		this.assertDataTransfer( {
				transferType: CKEDITOR.DATA_TRANSFER_CROSS_EDITORS,
				sourceEditor: editor1,
				targetEditor: editor2,
				text: 'bar',
				html: 'x<b>foo</b>x' },
			dataTransfer );
	},

	'test drag drop between editors, no event': function() {
		var isCustomDataTypesSupported = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported,
			bot1 = this.editorBots.editor1,
			editor1 = this.editors.editor1,
			editor2 = this.editors.editor2,
			dataTransfer;

		bot1.setHtmlWithSelection( '<p>x[x<b>foo</b>x]x</p>' );
		dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( null, editor1 );

		this.assertDataTransfer( {
				transferType: CKEDITOR.DATA_TRANSFER_CROSS_EDITORS,
				sourceEditor: editor1,
				targetEditor: editor2,
				text: isCustomDataTypesSupported ? 'xfoox' : '',
				html: 'x<b>foo</b>x' },
			dataTransfer );
	},

	'test set-get data, data type: Text, dataTransfer with event': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		dataTransfer.setData( 'Text', 'foo' );
		assert.areSame( 'foo', dataTransfer.getData( 'Text' ), 'Text - Text' );
		assert.areSame( 'foo', dataTransfer.getData( 'text/plain' ), 'Text - text/plain' );
		assert.areSame( 'foo', dataTransfer.getData( 'text' ), 'Text - text' );
	},

	'test set-get data, data type: text/plain, dataTransfer with event': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		dataTransfer.setData( 'text/plain', 'foo2' );
		assert.areSame( 'foo2', dataTransfer.getData( 'Text' ), 'text/plain - text' );
		assert.areSame( 'foo2', dataTransfer.getData( 'text/plain' ), 'text/plain - text/plain' );
		assert.areSame( 'foo2', dataTransfer.getData( 'text' ), 'text/plain - text' );
	},

	'test set-get data, data type: text, dataTransfer with event': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		dataTransfer.setData( 'text', 'foo3' );
		assert.areSame( 'foo3', dataTransfer.getData( 'Text' ), 'text - Text' );
		assert.areSame( 'foo3', dataTransfer.getData( 'text/plain' ), 'text - text/plain' );
		assert.areSame( 'foo3', dataTransfer.getData( 'text' ), 'text - text' );
	},

	'test set-get data, data type: CKE/custom, dataTransfer with event': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		dataTransfer.setData( 'CKE/custom', 'bar' );
		assert.areSame( 'bar', dataTransfer.getData( 'cke/custom' ), 'CKE/custom - cke/custom' );
		assert.areSame( 'bar', dataTransfer.getData( 'CKE/Custom' ), 'CKE/custom - CKE/Custom' );
	},

	'test set-get data, data type: text/html, dataTransfer with event': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		dataTransfer.setData( 'text/html', 'html' );
		assert.areSame( 'html', dataTransfer.getData( 'text/html' ), 'text/html - text/html' );
	},

	'test set-get data, undefined data, dataTransfer with event': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		assert.areSame( '', dataTransfer.getData( 'cke/undefined' ), 'undefined' );
	},

	'test set-get data, data type: Text, dataTransfer without event': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer();

		dataTransfer.setData( 'Text', 'foo' );
		assert.areSame( 'foo', dataTransfer.getData( 'Text' ), 'Text - Text' );
		assert.areSame( 'foo', dataTransfer.getData( 'text/plain' ), 'Text - text/plain' );
		assert.areSame( 'foo', dataTransfer.getData( 'text' ), 'Text - text' );
	},

	'test set-get data, data type: text/plain, dataTransfer without event': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer();

		dataTransfer.setData( 'text/plain', 'foo2' );
		assert.areSame( 'foo2', dataTransfer.getData( 'Text' ), 'text/plain - text' );
		assert.areSame( 'foo2', dataTransfer.getData( 'text/plain' ), 'text/plain - text/plain' );
		assert.areSame( 'foo2', dataTransfer.getData( 'text' ), 'text/plain - text' );
	},

	'test set-get data, data type: text, dataTransfer without event': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer();

		dataTransfer.setData( 'text', 'foo3' );
		assert.areSame( 'foo3', dataTransfer.getData( 'Text' ), 'text - Text' );
		assert.areSame( 'foo3', dataTransfer.getData( 'text/plain' ), 'text - text/plain' );
		assert.areSame( 'foo3', dataTransfer.getData( 'text' ), 'text - text' );
	},

	'test set-get data, data type: CKE/custom, dataTransfer without event': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer();

		dataTransfer.setData( 'CKE/custom', 'bar' );
		assert.areSame( 'bar', dataTransfer.getData( 'cke/custom' ), 'CKE/custom - cke/custom' );
		assert.areSame( 'bar', dataTransfer.getData( 'CKE/Custom' ), 'CKE/custom - CKE/Custom' );
	},

	'test set-get data, data type: text/html, dataTransfer without event': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer();

		dataTransfer.setData( 'text/html', 'html' );
		assert.areSame( 'html', dataTransfer.getData( 'text/html' ), 'text/html - text/html' );
	},

	'test set-get data, data type: undefined data, dataTransfer without event': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer();

		assert.areSame( '', dataTransfer.getData( 'cke/undefined' ), 'undefined' );
	},

	'test getData meta filter': function() {
		if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
			assert.ignore();
		}

		var nativeData = bender.tools.mockNativeDataTransfer();
		nativeData.setData( 'text/html', '<meta http-equiv="content-type" content="text/html; charset=utf-8">foo<b>bom</b>x\nbar' );

		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		assert.areSame( 'foo<b>bom</b>x\nbar', dataTransfer.getData( 'text/html' ) );
	},

	'test getData body filter': function() {
		if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
			assert.ignore();
		}

		var nativeData = bender.tools.mockNativeDataTransfer();
		nativeData.setData( 'text/html',
			'<html>' +
			'<body foo="bar" bar=foo bom=\'bim\'>' +
			'<!--StartFragment-->foo<b>bom</b>x' +
			'bar<!--EndFragment-->' +
			'</body>' +
			'</html>' );

		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		assert.areSame( 'foo<b>bom</b>xbar', dataTransfer.getData( 'text/html' ) );
	},

	'test getData body filter uppercase tags': function() {
		if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
			assert.ignore();
		}

		var nativeData = bender.tools.mockNativeDataTransfer();
		nativeData.setData( 'text/html',
			'<HTML>' +
			'<BODY foo="bar" bar=foo bom=\'bim\'>' +
			'<!--StartFragment-->foo<B>bom</B>x' +
			'bar<!--EndFragment-->' +
			'</BODY>' +
			'</HTML>' );

		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		assert.areSame( 'foo<B>bom</B>xbar', dataTransfer.getData( 'text/html' ) );
	},

	'test getData body filter for tables': function() {
		if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
			assert.ignore();
		}

		var nativeData = bender.tools.mockNativeDataTransfer();
		nativeData.setData( 'text/html',
			'<html>' +
			'<body>' +
			'<table>' +
			'<!--StartFragment-->' +
			'<tr><td>foo</td><td>bar</td></tr>' +
			'<!--EndFragment-->' +
			'</table>' +
			'</body>' +
			'</html>' );

		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		assert.areSame(
			'<table>' +
			'<tr><td>foo</td><td>bar</td></tr>' +
			'</table>',
			dataTransfer.getData( 'text/html' ) );
	},

	'test getData Firefox fix': function() {
		if ( !CKEDITOR.env.gecko ) {
			assert.ignore();
		}

		var nativeData = bender.tools.mockNativeDataTransfer();
		nativeData.setData( 'text/plain', 'file://foo/bar.txt' );
		nativeData.files = [ 'bar.txt' ];

		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		assert.areSame( '', dataTransfer.getData( 'Text' ) );
	},

	// https://dev.ckeditor.com/ticket/16847
	'test getData with getNative flag': function() {
		if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
			return assert.ignore();
		}

		var html = '<html>' +
				'<head>' +
					'<meta charset="UTF-8">' +
					'<meta name="foo" content=bar>' +
					'<STYLE>h1 { color: red; }</style>' +
				'</head>' +
				'<BODY>' +
					'<!--StartFragment--><p>Foo</p>' +
					'<p>Bar</p><!--EndFragment-->' +
				'</body>' +
			'</html>',
			nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		nativeData.setData( 'text/html', html );

		assert.areSame( html, dataTransfer.getData( 'text/html', true ) );
	},

	// https://dev.ckeditor.com/ticket/16847
	'test getData with getNative flag after caching': function() {
		if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
			return assert.ignore();
		}

		var html = '<html>' +
				'<head>' +
					'<meta charset="UTF-8">' +
					'<meta name="foo" content=bar>' +
					'<STYLE>h1 { color: red; }</style>' +
				'</head>' +
				'<BODY>' +
					'<!--StartFragment--><p>Foo</p>' +
					'<p>Bar</p><!--EndFragment-->' +
				'</body>' +
			'</html>',
			nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		nativeData.setData( 'text/html', html );
		dataTransfer.cacheData();

		assert.areSame( html, dataTransfer.getData( 'text/html', true ) );
	},

	// (#1223)
	'test asynchronous getData after caching': function() {
		if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
			return assert.ignore();
		}

		var html = '<html>' +
			'<head>' +
			'<meta charset="UTF-8">' +
			'<meta name="foo" content=bar>' +
			'<STYLE>h1 { color: red; }</style>' +
			'</head>' +
			'<BODY>' +
			'<!--StartFragment--><p>Foo</p>' +
			'<p>Bar</p><!--EndFragment-->' +
			'</body>' +
			'</html>',
			nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		nativeData.setData( 'text/html', html );
		dataTransfer.cacheData();

		// When asynchronously accessing native data transfer it is unavailable. Here we simulate it by removing stored data.
		nativeData.clearData( 'text/html' );

		assert.areSame( html, dataTransfer.getData( 'text/html', true ) );
		assert.areSame( '<p>Foo</p><p>Bar</p>', dataTransfer.getData( 'text/html' ) );
	},

	// (#1223)
	'test asynchronous HTML getData with change': function() {
		if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
			return assert.ignore();
		}

		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		nativeData.setData( 'text/html', '<p>foo bar baz</p>' );
		dataTransfer.setData( 'text/html', '<h1>foobar</h1>' );

		// When asynchronously accessing native data transfer it is unavailable. Here we simulate it by removing stored data.
		nativeData.clearData( 'text/html' );

		assert.areSame( '<h1>foobar</h1>', dataTransfer.getData( 'text/html', true ) );
	},

	// (#1223)
	'test asynchronous HTML getData with change after cache': function() {
		if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
			return assert.ignore();
		}

		var html = '<html>' +
			'<head>' +
			'<meta charset="UTF-8">' +
			'<meta name="foo" content=bar>' +
			'<STYLE>h1 { color: red; }</style>' +
			'</head>' +
			'<BODY>' +
			'<!--StartFragment--><p>Foo</p>' +
			'<p>Bar</p><!--EndFragment-->' +
			'</body>' +
			'</html>',
			nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		nativeData.setData( 'text/html', '<h1>foobar</h1>' );
		dataTransfer.cacheData();
		dataTransfer.setData( 'text/html', html );

		// When asynchronously accessing native data transfer it is unavailable. Here we simulate it by removing stored data.
		nativeData.clearData( 'text/html' );

		assert.areSame( html, dataTransfer.getData( 'text/html', true ) );
	},

	'test asynchronous full HTML overwrite (with cached data)': function() {
		if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
			return assert.ignore();
		}

		var html = '<html>' +
			'<head></head>' +
			'<BODY>' +
			'<!--StartFragment--><p>Foo</p>' +
			'<p>Bar</p><!--EndFragment-->' +
			'</body>' +
			'</html>',
			nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		nativeData.setData( 'text/html', '<h1>foobar</h1>' );
		dataTransfer.cacheData();
		// When asynchronously accessing native data transfer it is unavailable. Here we simulate it by removing stored data.
		nativeData.clearData( 'text/html' );

		// Change HTML value after original data transfer is no longer available.
		dataTransfer.setData( 'text/html', html );

		assert.areSame( html, dataTransfer.getData( 'text/html', true ), 'Native HTML' );
		assert.areSame( '<p>Foo</p><p>Bar</p>', dataTransfer.getData( 'text/html' ), 'Inner HTML' );
	},

	'test asynchronous simple HTML overwrite (with cached data)': function() {
		if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
			return assert.ignore();
		}

		var html = '<p>Foo</p><p>Bar</p>',
			nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		nativeData.setData( 'text/html', '<h1>foobar</h1>' );
		dataTransfer.cacheData();
		// When asynchronously accessing native data transfer it is unavailable. Here we simulate it by removing stored data.
		nativeData.clearData( 'text/html' );

		// Change HTML value after original data transfer is no longer available.
		dataTransfer.setData( 'text/html', html );

		assert.areSame( html, dataTransfer.getData( 'text/html', true ), 'Native HTML' );
		assert.areSame( html, dataTransfer.getData( 'text/html' ), 'Inner HTML' );
	},

	// https://dev.ckeditor.com/ticket/16847
	'test getData with filter after caching': function() {
		if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
			return assert.ignore();
		}

		var html = '<html>' +
				'<head>' +
					'<meta charset="UTF-8">' +
					'<meta name="foo" content=bar>' +
					'<STYLE>h1 { color: red; }</style>' +
				'</head>' +
				'<BODY>' +
					'<!--StartFragment--><p>Foo</p>' +
					'<p>Bar</p><!--EndFragment-->' +
				'</body>' +
			'</html>',
			nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		nativeData.setData( 'text/html', html );
		dataTransfer.cacheData();

		assert.areSame( '<p>Foo</p><p>Bar</p>', dataTransfer.getData( 'text/html' ) );
	},

	// https://dev.ckeditor.com/ticket/16847
	'test filtering unwanted content with getNative': function() {
		// Chrome tends to put unwanted artifacts at the end of data transfer, see
		// https://bugs.chromium.org/p/chromium/issues/detail?id=696978
		if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
			return assert.ignore();
		}

		var html = '<html>' +
				'<body>Foo</body>' +
			'</html>',
			nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		nativeData.setData( 'text/html', html + garbage );

		assert.areSame( html, dataTransfer.getData( 'text/html', true ) );
	},

	// https://dev.ckeditor.com/ticket/16847
	'test filtering unwanted content with getNative and cacheData': function() {
		if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
			return assert.ignore();
		}

		var html = '<html>' +
				'<body>Foo</body>' +
			'</html>',
			nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer;

		nativeData.setData( 'text/html', html + garbage );

		dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );
		dataTransfer.cacheData();

		assert.areSame( html, dataTransfer.getData( 'text/html', true ) );
	},

	'test cacheData': function() {
		var isCustomDataTypesSupported = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported,
			// Emulate native clipboard.
			nativeData = bender.tools.mockNativeDataTransfer();

		// This test uses mocked `setData` which does not apply fallback
		// for Edge >= 16 (because it skips `CKEDITOR.plugins.clipboard.dataTransfer` wrapper)
		// so it works as if `isCustomDataTypesSupported` flag was turned off for Edge (#962).
		if ( isCustomDataTypesSupported && !CKEDITOR.env.edge ) {
			nativeData.setData( 'text/html', 'foo' );
			nativeData.setData( 'text/plain', 'bom' );
			nativeData.setData( 'cke/custom', 'bar' );
		} else {
			nativeData.setData( 'Text', 'foo' );
		}

		// CacheData.
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );
		dataTransfer.cacheData();

		// Emulate permission denied to native clipboard.
		var throwPermissionDenied = function() {
			throw 'Permission denied.';
		};
		nativeData.setData = throwPermissionDenied;
		nativeData.getData = throwPermissionDenied;

		// Assert. Edge browser case same as above (#962).
		if ( isCustomDataTypesSupported && !CKEDITOR.env.edge ) {
			assert.areSame( 'foo', dataTransfer.getData( 'text/html' ) );
			assert.areSame( 'bom', dataTransfer.getData( 'text/plain' ) );
			assert.areSame( 'bar', dataTransfer.getData( 'cke/custom' ) );
			assert.areSame( '', dataTransfer.getData( 'cke/undefined' ) );
		} else {
			assert.areSame( 'foo', dataTransfer.getData( 'Text' ) );
			assert.areSame( '', dataTransfer.getData( 'cke/undefined' ) );
		}

	},

	'test cacheData with no native event should not crash': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer();

		dataTransfer.setData( 'cke/custom', 'foo' );
		dataTransfer.cacheData();

		assert.areSame( 'foo', dataTransfer.getData( 'cke/custom' ) );
		assert.areSame( '', dataTransfer.getData( 'cke/undefined' ) );
	},

	'test files empty': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		dataTransfer.cacheData();

		assert.areSame( 0, dataTransfer.getFilesCount() );
		assert.isFalse( !!dataTransfer.getFile( 0 ) );
	},

	'test files': function() {
		if ( CKEDITOR.env.ie && CKEDITOR.env.version < 10 ) {
			assert.ignore();
		}

		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		nativeData.files.push( 'foo' );
		nativeData.files.push( 'bar' );

		assert.areSame( 2, dataTransfer.getFilesCount() );
		assert.areSame( 'foo', dataTransfer.getFile( 0 ) );
		assert.areSame( 'bar', dataTransfer.getFile( 1 ) );
		assert.isUndefined( dataTransfer.getFile( 2 ) );
	},

	// https://dev.ckeditor.com/ticket/12961
	'test file in items': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData ),
			file = { type: 'type' };

		nativeData.items = [ {
			getAsFile: function() {
				return file;
			}
		} ];

		assert.areSame( 1, dataTransfer.getFilesCount() );
		assert.areSame( file, dataTransfer.getFile( 0 ) );
		assert.isUndefined( dataTransfer.getFile( 1 ) );
	},

	// https://dev.ckeditor.com/ticket/12961
	'test file in items with error': function() {
		if ( CKEDITOR.env.ie && CKEDITOR.env.version < 10 ) {
			assert.ignore();
		}

		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		nativeData.items = [ {
			getAsFile: function() {
				return {}; // no 'type', so not file.
			}
		} ];

		assert.areSame( 0, dataTransfer.getFilesCount() );
		assert.isUndefined( dataTransfer.getFile( 0 ) );
	},

	// https://dev.ckeditor.com/ticket/12961
	'test file in items and files': function() {
		if ( CKEDITOR.env.ie && CKEDITOR.env.version < 10 ) {
			assert.ignore();
		}

		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData ),
			file = { type: 'type' };

		nativeData.items = [ {
			getAsFile: function() {
				return file;
			}
		} ];

		nativeData.files.push( 'foo' );

		assert.areSame( 1, dataTransfer.getFilesCount() );
		assert.areSame( 'foo', dataTransfer.getFile( 0 ) );
		assert.isUndefined( dataTransfer.getFile( 1 ) );
	},

	'test files with cache': function() {
		if ( CKEDITOR.env.ie && CKEDITOR.env.version < 10 ) {
			assert.ignore();
		}

		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		nativeData.files.push( 'foo' );
		nativeData.files.push( 'bar' );

		dataTransfer.cacheData();

		assert.areSame( 2, dataTransfer.getFilesCount() );
		assert.areSame( 'foo', dataTransfer.getFile( 0 ) );
		assert.areSame( 'bar', dataTransfer.getFile( 1 ) );
		assert.isFalse( !!dataTransfer.getFile( 2 ) );

		nativeData.files = [];

		assert.areSame( 2, dataTransfer.getFilesCount() );
		assert.areSame( 'foo', dataTransfer.getFile( 0 ) );
		assert.areSame( 'bar', dataTransfer.getFile( 1 ) );
		assert.isFalse( !!dataTransfer.getFile( 2 ) );
	},

	// https://dev.ckeditor.com/ticket/12961
	'test file in items with cache': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData ),
			file = { type: 'type' };

		nativeData.items = [ {
			getAsFile: function() {
				return file;
			}
		} ];

		dataTransfer.cacheData();

		assert.areSame( 1, dataTransfer.getFilesCount() );
		assert.areSame( file, dataTransfer.getFile( 0 ) );
		assert.isUndefined( dataTransfer.getFile( 1 ) );

		nativeData.files = [];
		nativeData.items = [];

		assert.areSame( 1, dataTransfer.getFilesCount() );
		assert.areSame( file, dataTransfer.getFile( 0 ) );
		assert.isUndefined( dataTransfer.getFile( 1 ) );
	},

	// https://dev.ckeditor.com/ticket/12961
	'test file in items and files with cache': function() {
		if ( CKEDITOR.env.ie && CKEDITOR.env.version < 10 ) {
			assert.ignore();
		}

		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData ),
			file = { type: 'type' };

		nativeData.items = [ {
			getAsFile: function() {
				return file;
			}
		} ];

		nativeData.files.push( 'foo' );

		dataTransfer.cacheData();

		assert.areSame( 1, dataTransfer.getFilesCount() );
		assert.areSame( 'foo', dataTransfer.getFile( 0 ) );
		assert.isUndefined( dataTransfer.getFile( 1 ) );
	},

	'test isEmpty 1': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer();

		assert.isTrue( dataTransfer.isEmpty() );
	},

	'test isEmpty 2': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		assert.isTrue( dataTransfer.isEmpty() );
	},

	'test isEmpty 3': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		nativeData.setData( 'Text', '' );

		assert.isTrue( dataTransfer.isEmpty() );
	},

	'test isEmpty 4': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		dataTransfer.setData( 'Text', '' );

		assert.isTrue( dataTransfer.isEmpty() );
	},

	'test isEmpty 5': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		nativeData.setData( 'Text', 'foo' );

		assert.isFalse( dataTransfer.isEmpty() );
	},

	'test isEmpty 6': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		dataTransfer.setData( 'Text', 'foo' );

		assert.isFalse( dataTransfer.isEmpty() );
	},

	'test isEmpty 7': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		dataTransfer.setData( 'cke/custom', 'foo' );

		assert.isFalse( dataTransfer.isEmpty() );
	},

	'test isEmpty 8': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer();

		dataTransfer.setData( 'cke/custom', 'foo' );

		assert.isFalse( dataTransfer.isEmpty() );
	},

	'test isEmpty 9': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		dataTransfer.setData( 'Text', 'foo' );
		dataTransfer.setData( 'Text', '' );

		assert.isTrue( dataTransfer.isEmpty() );
	},

	'test isEmpty 10': function() {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		nativeData.setData( 'Text', 'foo' );
		dataTransfer.setData( 'cke/custom', 'foo' );

		assert.isFalse( dataTransfer.isEmpty() );
	},

	'test isEmpty 11': function() {
		if ( CKEDITOR.env.ie && CKEDITOR.env.version < 10 ) {
			assert.ignore();
		}

		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		nativeData.files.push( 'foo' );

		assert.isFalse( dataTransfer.isEmpty() );
	},

	'test isEmpty 12': function() {
		if ( CKEDITOR.env.ie && CKEDITOR.env.version < 10 ) {
			assert.ignore();
		}

		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		nativeData.files.push( 'foo' );
		dataTransfer.cacheData();
		nativeData.files = [];

		assert.isFalse( dataTransfer.isEmpty() );
	},

	'test initDragDataTransfer binding': function() {
		var nativeData1 = bender.tools.mockNativeDataTransfer(),
			nativeData2 = bender.tools.mockNativeDataTransfer(),
			evt1a = { data: { $: { dataTransfer: nativeData1 } }, name: 'dragstart' },
			evt1b = { data: { $: { dataTransfer: nativeData1 } }, name: 'dragstart' },
			evt2 = { data: { $: { dataTransfer: nativeData2 } }, name: 'dragstart' };

		CKEDITOR.plugins.clipboard.initDragDataTransfer( evt1a );
		CKEDITOR.plugins.clipboard.initDragDataTransfer( evt1b );

		assert.areSame( evt1a.data.dataTransfer, evt1b.data.dataTransfer, 'If we init dataTransfer object twice on the same event this should be the same object.' );

		CKEDITOR.plugins.clipboard.resetDragDataTransfer();
		CKEDITOR.plugins.clipboard.initDragDataTransfer( evt2 );

		assert.areNotSame( evt1a.data.dataTransfer, evt2.data.dataTransfer, 'If we init dataTransfer object twice on different events these should be different objects.' );
	},

	'test initDragDataTransfer binding no native event': function() {
		var evt1a = { data: {} },
			evt1b = { data: {} },
			evt2 = { data: {} };

		CKEDITOR.plugins.clipboard.initDragDataTransfer( evt1a );
		CKEDITOR.plugins.clipboard.initDragDataTransfer( evt1b );

		CKEDITOR.plugins.clipboard.resetDragDataTransfer();

		CKEDITOR.plugins.clipboard.initDragDataTransfer( evt2 );

		assert.areSame( evt1a.data.dataTransfer, evt1b.data.dataTransfer, 'Without native event events should be the same.' );

		assert.areNotSame( evt1a.data.dataTransfer, evt2.data.dataTransfer, 'After reset events should be different.' );
	},

	'test initDragDataTransfer constructor': function() {
		var isCustomDataTypesSupported = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported,
			bot = this.editorBots.editor1,
			editor = this.editors.editor1;

		bot.setHtmlWithSelection( '<p>x[x<b>foo</b>x]x</p>' );

		var nativeData = bender.tools.mockNativeDataTransfer(),
			evt = { data: { $: { dataTransfer: nativeData } } };

		CKEDITOR.plugins.clipboard.initDragDataTransfer( evt, editor );

		this.assertDataTransfer( {
				transferType: CKEDITOR.DATA_TRANSFER_INTERNAL,
				sourceEditor: editor,
				targetEditor: editor,
				text: isCustomDataTypesSupported ? 'xfoox' : '',
				html: 'x<b>foo</b>x' },
			evt.data.dataTransfer );
	},

	'test initDragDataTransfer constructor, no native event': function() {
		var isCustomDataTypesSupported = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported,
			bot = this.editorBots.editor1,
			evt = { data: {} },
			editor = this.editors.editor1;

		bot.setHtmlWithSelection( '<p>x[x<b>foo</b>x]x</p>' );

		CKEDITOR.plugins.clipboard.initDragDataTransfer( evt, editor );

		this.assertDataTransfer( {
				transferType: CKEDITOR.DATA_TRANSFER_INTERNAL,
				sourceEditor: editor,
				targetEditor: editor,
				text: isCustomDataTypesSupported ? 'xfoox' : '',
				html: 'x<b>foo</b>x'	},
		evt.data.dataTransfer );
	},

	'test initPasteDataTransfer binding': function() {
		if ( !CKEDITOR.plugins.clipboard.isCustomCopyCutSupported ) {
			assert.ignore();
		}

		var nativeData1 = bender.tools.mockNativeDataTransfer(),
			nativeData2 = bender.tools.mockNativeDataTransfer(),
			evt1 = { data: { $: { clipboardData: nativeData1 } }, name: 'copy' },
			evt2 = { data: { $: { clipboardData: nativeData1 } }, name: 'copy' },
			evt3 = { data: { $: { clipboardData: nativeData2 } }, name: 'copy' },
			dataTransfer1 = CKEDITOR.plugins.clipboard.initPasteDataTransfer( evt1 ),
			dataTransfer2 = CKEDITOR.plugins.clipboard.initPasteDataTransfer( evt2 ),
			dataTransfer3 = CKEDITOR.plugins.clipboard.initPasteDataTransfer( evt3 );

		assert.areSame( dataTransfer1, dataTransfer2, 'If we init dataTransfer object twice on the same event this should be the same object.' );
		assert.areNotSame( dataTransfer1, dataTransfer3, 'If we init dataTransfer object twice on different events these should be different objects.' );
	},

	'test initPasteDataTransfer constructor': function() {
		var isCustomCopyCutSupported = CKEDITOR.plugins.clipboard.isCustomCopyCutSupported,
			isCustomDataTypesSupported = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported,
			bot = this.editorBots.editor1,
			editor = this.editors.editor1,
			nativeData = bender.tools.mockNativeDataTransfer(),
			evt = { data: { $: { clipboardData: nativeData } } };

		bot.setHtmlWithSelection( '<p>x[x<b>foo</b>x]x</p>' );

		if ( isCustomCopyCutSupported ) {
			evt.data.$.clipboardData.setData = function() {
				assert.fail( 'Native setData should not be touched on IE.' );
			};

			evt.data.$.clipboardData.getData = function() {
				assert.fail( 'Native dataTransfer.getData should not be touched on IE.' );
			};
		}

		var dataTransfer = CKEDITOR.plugins.clipboard.initPasteDataTransfer( evt, editor );

		this.assertDataTransfer( {
				transferType: CKEDITOR.DATA_TRANSFER_INTERNAL,
				sourceEditor: editor,
				targetEditor: editor,
				text: isCustomDataTypesSupported ? 'xfoox' : '',
				html: 'x<b>foo</b>x' },
			dataTransfer );
	},

	'test initPasteDataTransfer constructor, no event': function() {
		var isCustomDataTypesSupported = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported,
			bot = this.editorBots.editor1,
			editor = this.editors.editor1;

		bot.setHtmlWithSelection( '<p>x[x<b>foo</b>x]x</p>' );

		var dataTransfer = CKEDITOR.plugins.clipboard.initPasteDataTransfer( null, editor );

		this.assertDataTransfer( {
				transferType: CKEDITOR.DATA_TRANSFER_INTERNAL,
				sourceEditor: editor,
				targetEditor: editor,
				text: isCustomDataTypesSupported ? 'xfoox' : '',
				html: 'x<b>foo</b>x'	},
		dataTransfer );
	},

	// (#962)
	'test new dataTransfer id is created for copy/cut/dragstart events': function() {
		if ( !CKEDITOR.plugins.clipboard.isCustomCopyCutSupported ) {
			assert.ignore();
		}

		var nativeData1 = bender.tools.mockNativeDataTransfer(),
			nativeData2 = bender.tools.mockNativeDataTransfer(),
			nativeData3 = bender.tools.mockNativeDataTransfer(),
			evt1 = { data: { $: { clipboardData: nativeData1 } }, name: 'copy' },
			evt2 = { data: { $: { clipboardData: nativeData2 } }, name: 'cut' },
			evt3 = { data: { $: { dataTransfer: nativeData3 } }, name: 'dragstart' },
			dataTransfer1 = CKEDITOR.plugins.clipboard.initPasteDataTransfer( evt1 ),
			dataTransfer2 = CKEDITOR.plugins.clipboard.initPasteDataTransfer( evt2 ),
			dtFallback1 = dataTransfer1._.fallbackDataTransfer,
			dtFallback2 = dataTransfer2._.fallbackDataTransfer,
			dataTransfer3,
			dtFallback3;

		CKEDITOR.plugins.clipboard.initDragDataTransfer( evt3 );
		dataTransfer3 = evt3.data.dataTransfer;
		dtFallback3 = dataTransfer3._.fallbackDataTransfer;

		// Check if ids are not empty.
		assert.isTrue( dataTransfer1.id.length > 0, 'dataTransfer1 id is not empty' );
		assert.isTrue( dataTransfer2.id.length > 0, 'dataTransfer2 id is not empty' );
		assert.isTrue( dataTransfer3.id.length > 0, 'dataTransfer3 id is not empty' );

		if ( CKEDITOR.plugins.clipboard.isCustomDataTypesSupported && !CKEDITOR.env.edge ) {
			assert.areSame( dataTransfer1.id, nativeData1.getData( 'cke/id' ), 'cke/id type holds dataTransfer1 id' );
			assert.areSame( dataTransfer2.id, nativeData2.getData( 'cke/id' ), 'cke/id type holds dataTransfer2 id' );
			assert.areSame( dataTransfer3.id, nativeData3.getData( 'cke/id' ), 'cke/id type holds dataTransfer3 id' );
		} else {
			assert.areSame( dataTransfer1.id,
				dtFallback1._extractDataComment( nativeData1.getData( dtFallback1._customDataFallbackType ) ).data[ 'cke/id' ],
				'cke/id custom data holds dataTransfer1 id' );

			assert.areSame( dataTransfer2.id,
				dtFallback2._extractDataComment( nativeData2.getData( dtFallback2._customDataFallbackType ) ).data[ 'cke/id' ],
				'cke/id custom data holds dataTransfer2 id' );

			assert.areSame( dataTransfer3.id,
				dtFallback3._extractDataComment( nativeData3.getData( dtFallback3._customDataFallbackType ) ).data[ 'cke/id' ],
				'cke/id custom data holds dataTransfer3 id' );
		}
	},

	// (#962)
	'test no new dataTransfer id is created for paste/drop/dragend events': function() {
		if ( !CKEDITOR.plugins.clipboard.isCustomCopyCutSupported ) {
			assert.ignore();
		}

		var nativeData1 = bender.tools.mockNativeDataTransfer(),
			nativeData2 = bender.tools.mockNativeDataTransfer(),
			nativeData3 = bender.tools.mockNativeDataTransfer(),
			evt1 = { data: { $: { clipboardData: nativeData1 } }, name: 'paste' },
			evt2 = { data: { $: { dataTransfer: nativeData2 } }, name: 'drop' },
			evt3 = { data: { $: { dataTransfer: nativeData3 } }, name: 'dragend' },
			dataTransfer1 = CKEDITOR.plugins.clipboard.initPasteDataTransfer( evt1 ),
			dataTransfer2,
			dataTransfer3;

		CKEDITOR.plugins.clipboard.initDragDataTransfer( evt2 );
		dataTransfer2 = evt2.data.dataTransfer;

		CKEDITOR.plugins.clipboard.initDragDataTransfer( evt3 );
		dataTransfer3 = evt3.data.dataTransfer;

		if ( CKEDITOR.plugins.clipboard.isCustomDataTypesSupported && !CKEDITOR.env.edge ) {
			assert.areSame( '', nativeData1.getData( 'cke/id' ), 'dataTransfer1 id is empty' );
			assert.areSame( '', nativeData2.getData( 'cke/id' ), 'dataTransfer2 id is empty' );
			assert.areSame( '', nativeData3.getData( 'cke/id' ), 'dataTransfer2 id is empty' );
		} else {
			// As dataTransfer id is stored in `customDataFallbackType` ('text/html' mime type), we just check if it is empty.
			assert.areSame( '',
				nativeData1.getData( dataTransfer1._.fallbackDataTransfer._customDataFallbackType ), 'dataTransfer1 id is empty' );
			assert.areSame( '',
				nativeData2.getData( dataTransfer2._.fallbackDataTransfer._customDataFallbackType ), 'dataTransfer2 id is empty' );
			assert.areSame( '',
				nativeData2.getData( dataTransfer3._.fallbackDataTransfer._customDataFallbackType ), 'dataTransfer2 id is empty' );
		}
	},

	'test if cache is initialized on dataTransfer creation': function() {
		var cache = new CKEDITOR.plugins.clipboard.dataTransfer()._.data;

		assert.isObject( cache, 'cache should be initialized' );
	},

	'test if different dataTransfer objects has different caches': function() {
		var dt1 = new CKEDITOR.plugins.clipboard.dataTransfer(),
			dt2 = new CKEDITOR.plugins.clipboard.dataTransfer();

		assert.isObject( dt1._.data, 'cache should be initialized' );
		assert.isTrue( dt1._.data !== dt2._.data, 'caches should not be equal' );
	},

	// (#1299)
	'test dataTransfer._stripHtml empty values': function() {
		var dt1 = new CKEDITOR.plugins.clipboard.dataTransfer();

		assert.areSame( '', dt1._stripHtml( '' ), 'Empty html' );
		assert.isUndefined( dt1._stripHtml( undefined ), 'Undefined' );
		assert.isNull( dt1._stripHtml( null ), 'Null' );
	},

	// (#3415)
	'test getData body filter whitespace': function() {
		if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
			assert.ignore();
		}

		var nativeData = bender.tools.mockNativeDataTransfer();
		nativeData.setData( 'text/html',
			'<html>' +
			'<body>\n' +
			'<!--StartFragment--><li>foo</li><!--EndFragment-->\n' +
			'</body>' +
			'</html>' );

		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		assert.areSame( '<li>foo</li>', dataTransfer.getData( 'text/html' ) );
	},

	// (#3634)
	'test getTypes (custom types)': function() {
		if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported || CKEDITOR.env.edge ) {
			assert.ignore();
		}

		var expectedTypes = [ 'whatever/cke', 'custom/type' ],
			nativeData,
			dataTransfer;

		nativeData = bender.tools.mockNativeDataTransfer();
		nativeData.setData( 'whatever/cke', 'Test' );
		nativeData.setData( 'custom/type', 'lorem ipsum' );

		dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		arrayAssert.itemsAreSame( expectedTypes, dataTransfer.getTypes() );
	},

	// (#3634)
	'test getTypes (non-custom types)': function() {
		var expectedTypes = [ 'Text' ],
			nativeData,
			dataTransfer;

		nativeData = bender.tools.mockNativeDataTransfer();
		nativeData.setData( 'Text', 'Test' );

		dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		arrayAssert.itemsAreSame( expectedTypes, dataTransfer.getTypes() );
	},

	// (#3634)
	'test getTypes when there is no native data transfer': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer();

		arrayAssert.itemsAreSame( [], dataTransfer.getTypes() );
	}
} );
