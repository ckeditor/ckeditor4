/* bender-tags: editor,pastetools,imagefilter */
/* bender-ckeditor-plugins: wysiwygarea,pastetools,font,toolbar */
/* bender-include: ../_helpers/ptTools.js */
/* global ptTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			removePlugins: 'pastefromword,pastefromlibreoffice,pastefromgdocs',
			allowedContent: true
		}
	};
	var RTF = [
			'{\\pict\\picscalex100\\picscaley100\\piccropl0\\piccropr0\\piccropt0\\piccropb0\\picw300\\pich300\\picwgoal3823\\pichgoal3823\\pngblip d76df8e7aefc}',
			'{\\*\\shppict{\\pict{\\*\\picprop{\\sp{\\sn wzDescription}{\\sv }}{\\sp{\\sn wzName}{\\sv }}}\\picscalex19\\picscaley19\\piccropl0\\piccropr0\\piccropt0' +
			'\\piccropb0\\picw300\\pich300\\picwgoal3823\\pichgoal3823\\pngblip d76df8e7aefc }}{\\nonshppict{\\pict{\\*\\picprop{',
			'{\\pict\\picscalex100\\picscaley100\\piccropl0\\piccropr0\\piccropt0\\piccropb0\\picw300\\pich300\\picwgoal3823\\pichgoal3823\\emfblip d76df8e7aefc}'
		];

	var tests = {
		'test image filter should transform 1st type of rtf data': ptTools.createFilterTest( {
			html: '<img src="file://foo" />',
			rtf: RTF[ 0 ],
			expected: '<img src="data:image/png;base64,12345678" />'
		} ),

		'test image filer should transform 2nd type of rtf data': ptTools.createFilterTest( {
			html: '<img src="file://foo" />',
			rtf: RTF[ 1 ],
			expected: '<img src="data:image/png;base64,12345678" />'
		} ),

		'test image filter should not transform non-file images': ptTools.createFilterTest( {
			html: '<img src="http://example.com/img.png" />',
			rtf: RTF[ 0 ],
			expected: '<img src="http://example.com/img.png" />'
		} ),

		'test image filer should raise an error for unsupported image format': function() {
			var editor = this.editor,
					filtersPaths = [
						CKEDITOR.plugins.getPath( 'pastetools' ) + 'filter/common.js',
						CKEDITOR.plugins.getPath( 'pastetools' ) + 'filter/image.js'
					],
					spy = sinon.spy( CKEDITOR, 'error' );

			return ptTools.asyncLoadFilters( filtersPaths, 'CKEDITOR.pasteFilters.image' )
				.then( function( imageFilter ) {
					var inputHtml = '<img src="file://foo" />',
						inputRtf = RTF[ 2 ],
						actual = imageFilter( inputHtml, editor, inputRtf ),
						spyCall = spy.getCall( 0 ),
						expectedSpyArguments = [
							'pastetools-unsupported-image',
							{
								type: 'image/emf',
								index: 0
							}
						];

					spy.restore();

					assert.areSame( inputHtml, actual, 'html output' );
					assert.areSame( 1, spy.callCount, 'errors raised' );
					objectAssert.areDeepEqual( expectedSpyArguments, spyCall.args );
				} );
		},

		'test image filer should raise an error if there are more images in RTF than in HTML': function() {
			var editor = this.editor,
					filtersPaths = [
						CKEDITOR.plugins.getPath( 'pastetools' ) + 'filter/common.js',
						CKEDITOR.plugins.getPath( 'pastetools' ) + 'filter/image.js'
					],
					spy = sinon.spy( CKEDITOR, 'error' );

			return ptTools.asyncLoadFilters( filtersPaths, 'CKEDITOR.pasteFilters.image' )
				.then( function( imageFilter ) {
					var inputHtml = '<img src="file://foo" />',
						inputRtf = RTF[ 0 ] + RTF[ 2 ],
						actual = imageFilter( inputHtml, editor, inputRtf ),
						spyCall = spy.getCall( 0 ),
						expectedSpyArguments = [
							'pastetools-failed-image-extraction',
							{
								rtf: 2,
								html: 1
							}
						];

					spy.restore();

					assert.areSame( inputHtml, actual, 'html output' );
					assert.areSame( 1, spy.callCount, 'errors raised' );
					objectAssert.areDeepEqual( expectedSpyArguments, spyCall.args );
				} );
		},

		'test image filer should raise an error if there are more images in HTML than in RTF': function() {
			var editor = this.editor,
					filtersPaths = [
						CKEDITOR.plugins.getPath( 'pastetools' ) + 'filter/common.js',
						CKEDITOR.plugins.getPath( 'pastetools' ) + 'filter/image.js'
					],
					spy = sinon.spy( CKEDITOR, 'error' );

			return ptTools.asyncLoadFilters( filtersPaths, 'CKEDITOR.pasteFilters.image' )
				.then( function( imageFilter ) {
					var inputHtml = '<img src="file://foo" /><img src="file://bar" />',
						inputRtf = RTF[ 0 ],
						actual = imageFilter( inputHtml, editor, inputRtf ),
						spyCall = spy.getCall( 0 ),
						expectedSpyArguments = [
							'pastetools-failed-image-extraction',
							{
								rtf: 1,
								html: 2
							}
						];

					spy.restore();

					assert.areSame( inputHtml, actual, 'html output' );
					assert.areSame( 1, spy.callCount, 'errors raised' );
					objectAssert.areDeepEqual( expectedSpyArguments, spyCall.args );
				} );
		}
	};

	tests = bender.tools.createAsyncTests( tests );
	bender.test( tests );
} )();
