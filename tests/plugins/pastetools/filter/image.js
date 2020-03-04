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
			'\\piccropb0\\picw300\\pich300\\picwgoal3823\\pichgoal3823\\pngblip d76df8e7aefc }}{\\nonshppict{\\pict{\\*\\picprop{'
		];

	var tests = {
		'test image filter should transform 1st type of rtf data': function() {
			var editor = this.editor,
				filterPath = CKEDITOR.plugins.getPath( 'pastetools' ) + 'filter/image.js';

			return ptTools.asyncLoadFilters( filterPath, 'CKEDITOR.pasteFilters.image' )
				.then( function( imageFilter ) {
					var inputHtml = '<img src="file://foo" />',
						actual = imageFilter( inputHtml, editor, RTF[ 0 ] );

					assert.areSame( '<img src="data:image/png;base64,12345678" />', actual );
				} );
		},

		'test image filer should transform 2nd type of rtf data': function() {
			var editor = this.editor,
				filterPath = CKEDITOR.plugins.getPath( 'pastetools' ) + 'filter/image.js';

			return ptTools.asyncLoadFilters( filterPath, 'CKEDITOR.pasteFilters.image' )
				.then( function( imageFilter ) {
					var inputHtml = '<img src="file://foo" />',
						actual = imageFilter( inputHtml, editor, RTF[ 1 ] );

					assert.areSame( '<img src="data:image/png;base64,12345678" />', actual );
				} );
		},

		'test image filter should not transform non-file images': function() {
			var editor = this.editor,
				filterPath = CKEDITOR.plugins.getPath( 'pastetools' ) + 'filter/image.js';

			return ptTools.asyncLoadFilters( filterPath, 'CKEDITOR.pasteFilters.image' )
				.then( function( imageFilter ) {
					var inputHtml = '<img src="http://example.com/img.png" />',
						actual = imageFilter( inputHtml, editor, RTF[ 0 ] );

					assert.areSame( '<img src="http://example.com/img.png" />', actual );
				} );
		}
	};

	tests = bender.tools.createAsyncTests( tests );
	bender.test( tests );
} )();
