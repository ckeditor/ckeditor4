/* bender-tags: editor,clipboard,pastefromword */
/* bender-ckeditor-plugins: pastefromword */
/* bender-include: generated/_helpers/pfwTools.js, ../pastetools/_helpers/ptTools.js */
/* global ptTools */

( function() {
	'use strict';


	bender.editor = {};

	function mockWordHtml( content ) {
		return '<span style="mso-mock">' + content + '</span>';
	}

	var tests = {
		'test PFW uses dataTransfer when available': function() {
			if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
				assert.ignore();
			}


			var editor = this.editor,
				nativeData = bender.tools.mockNativeDataTransfer(),
				dataTransfer;

			editor.once( 'afterPasteFromWord', function( evt ) {
				resume( function() {
					assert.areSame( evt.data.dataValue, 'foo' );
				} );
			} );

			nativeData.setData( 'text/html', mockWordHtml( 'foo' ) );
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

			editor.fire( 'paste', {
				dataValue: mockWordHtml( 'foo' ),
				dataTransfer: dataTransfer
			} );

			wait();
		},

		'test PFW uses dataValue when dataTransfer is empty':  function() {
			var editor = this.editor;

			editor.once( 'afterPasteFromWord', function( evt ) {
				resume( function() {
					assert.areSame( evt.data.dataValue, 'foo' );
				} );
			} );

			editor.fire( 'paste', {
				dataValue: mockWordHtml( 'foo' ),
				dataTransfer: CKEDITOR.plugins.clipboard.initPasteDataTransfer()
			} );

			wait();
		},

		'test PFW uses dataValue when dataTransfer is not supported': function() {
			if ( CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
				assert.ignore();
			}

			var editor = this.editor,
				nativeData = bender.tools.mockNativeDataTransfer(),
				dataTransfer;

			editor.once( 'afterPasteFromWord', function( evt ) {
				resume( function() {
					assert.areSame( evt.data.dataValue, 'bar' );
				} );
			} );

			nativeData.setData( 'Text', mockWordHtml( 'foo' ) );
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

			editor.fire( 'paste', {
				dataValue: mockWordHtml( 'bar' ),
				dataTransfer: dataTransfer
			} );

			wait();
		}
	};

	ptTools.ignoreTestsOnMobiles( tests );

	bender.test( tests );

} )();
