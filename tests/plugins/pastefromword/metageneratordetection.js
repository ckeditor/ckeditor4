/* bender-tags: editor,clipboard */
/* bender-ckeditor-plugins: pastefromword */
/* bender-include: generated/_helpers/pfwTools.js, ../pastetools/_helpers/ptTools.js */
/* global ptTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			pasteFromWordCleanupFile: '%TEST_DIR%_assets/customfilter.js'
		}
	};

	var tests = {
		'test detecting excel': function() {
			testMetaDetection( this.editor, true, 'Microsoft Excel 15' );
		},

		'test detecting outlook': function() {
			testMetaDetection( this.editor, true, 'Microsoft Word 15' );
		},

		'test detecting power point': function() {
			testMetaDetection( this.editor, true, 'Microsoft PowerPoint 15' );
		},

		'test detecting one note': function() {
			testMetaDetection( this.editor, true, 'Microsoft OneNote 15' );
		},

		'test other generator': function() {
			testMetaDetection( this.editor, false, 'Custom' );
		},

		'test empty generator': function() {
			testMetaDetection( this.editor, false, '' );
		},

		'test generator attribute inside content': function() {
			testMetaDetection( this.editor, false, '', '<p name="generator" content="microsoft">Tets</p>' );
		},

		// (#3586)
		'test detection with dataTransfer': function() {
			testMetaDetection( this.editor, true, 'Microsoft Excel 16', '<p>Test</p>', {
				dataTransfer: true
			} );
		}
	};

	ptTools.ignoreTestsOnMobiles( tests );

	bender.test( tests );

	function testMetaDetection( editor, success, generatorValue, content, options ) {
		var evtData = {
				type: 'auto',
				dataValue: generateHtml( generatorValue, content ),
				method: 'paste'
			},
			dataType = CKEDITOR.env.ie && CKEDITOR.env.version < 16 ? 'Text' : 'text/html',
			isDataTransferTest = options && !!options.dataTransfer,
			nativeDataTransfer,
			dataTransfer;

		if ( isDataTransferTest ) {
			nativeDataTransfer = bender.tools.mockNativeDataTransfer();
			nativeDataTransfer.setData( dataType, evtData.dataValue );

			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeDataTransfer );
			evtData.dataValue = dataTransfer.getData( dataType );
			evtData.dataTransfer = dataTransfer;
		}

		editor.once( 'paste', function( evt ) {
			resume( function() {
				if ( success ) {
					assert.areSame( 'ok', evt.data.dataValue, 'Content from office detected correctly.' );
				} else {
					assert.areNotEqual( 'ok', evt.data.dataValue, 'Content not from office does not trigger PFW.' );
				}
			} );
		}, null, null, 999 );

		editor.fire( 'paste', evtData );

		wait();
	}

	function generateHtml( generatorValue, content ) {
		var body = content || '<p>foo <strong>bar</strong></p>';
		return '<html><head><meta name=Generator content="' + generatorValue + '"></head><body>' + body + '</body></html>';
	}
} )();
