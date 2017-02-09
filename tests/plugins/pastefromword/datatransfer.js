/* bender-tags: editor,unit,clipboard,pastefromword */
/* bender-ckeditor-plugins: pastefromword */

( function() {
	'use strict';


	bender.editor = {};

	function mockWordHtml( content ) {
		return '<span style="mso-mock">' + content + '</span>';
	}

	bender.test( {
		'test PFW uses dataTransfer when available': function() {
			if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
				assert.ignore();
			}


			var editor = this.editor,
				nativeData = bender.tools.mockNativeDataTransfer(),
				dataTransfer;

			editor.once( 'pasteFromWord', function( evt ) {
				resume( function() {
					assert.areSame( evt.data.dataValue, mockWordHtml( 'foo' ) );
				} );
			} );

			nativeData.setData( 'text/html', mockWordHtml( 'foo' ) );
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

			editor.fire( 'paste', {
				dataValue: mockWordHtml( 'bar' ),
				dataTransfer: dataTransfer
			} );

			wait();
		},

		'test PFW uses dataValue when dataTransfer is not available': function() {
			if ( CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
				assert.ignore();
			}

			var editor = this.editor,
				nativeData = bender.tools.mockNativeDataTransfer(),
				dataTransfer;

			editor.once( 'pasteFromWord', function( evt ) {
				resume( function() {
					assert.areSame( evt.data.dataValue, mockWordHtml( 'bar' ) );
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
	} );

} )();
