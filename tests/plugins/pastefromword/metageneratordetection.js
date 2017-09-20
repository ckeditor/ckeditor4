/* bender-tags: editor,clipboard */
/* bender-ckeditor-plugins: pastefromword */

( function() {
	'use strict';

	bender.editor = {
		config: {
			pasteFromWordCleanupFile: '%TEST_DIR%_assets/customfilter.js'
		}
	};

	bender.test( {
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
		}
	} );

	function testMetaDetection( editor, success, generatorValue, content ) {
		editor.once( 'paste', function( evt ) {
			resume( function() {
				if ( success ) {
					assert.areSame( 'ok', evt.data.dataValue, 'Content from office detected correctly.' );
				} else {
					assert.areNotEqual( 'ok', evt.data.dataValue, 'Content not from office does not trigger PFW.' );
				}
			} );
		}, null, null, 999 );

		editor.fire( 'paste', {
			type: 'auto',
			dataValue: generateHtml( generatorValue, content ),
			method: 'paste'
		} );

		wait();
	}

	function generateHtml( generatorValue, content ) {
		var body = content || '<p>foo <strong>bar</strong></p>';
		return '<html><head><meta name=Generator content="' + generatorValue + '"></head><body>' + body + '</body></html>';
	}

} )();
