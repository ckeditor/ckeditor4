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
		} )
	};

	tests = bender.tools.createAsyncTests( tests );
	bender.test( tests );
} )();
