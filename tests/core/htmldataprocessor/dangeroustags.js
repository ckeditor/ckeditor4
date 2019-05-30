/* bender-tags: #3131, feature, editor */

var protectedSourceMarker = '{cke_protected}';

bender.editor = {
	config: {
		allowDangerousTags: true,
		allowedContent: true
	}
}

bender.test( {
	'test script tags not protected when allowDangerousTags === true': function() {
		var editor = this.editor;
		dataProcessor = editor.dataProcessor;
		const data = '<script async src="//cdn.ckeditor.com/4.11.2/full/ckeditor.js"><\/script><script>var bla = 0; bla += 1;<\/script>'

		assert.areSame( -1, dataProcessor.toHtml( data ).indexOf(protectedSourceMarker), 'SCRIPT tag is protected.' );
	},
	'test noscript tags not protected when allowDangerousTags === true': function() {
		var editor = this.editor;
		dataProcessor = editor.dataProcessor;
		var data = '<noscript>Your browser does not support JavaScript!</noscript>';

		assert.areSame( -1, dataProcessor.toHtml( data ).indexOf(protectedSourceMarker), 'NOSCRIPT tag is protected.' );
	},
	'test meta tags not protected when allowDangerousTags === true': function() {
		var editor = this.editor;
		dataProcessor = editor.dataProcessor;
		const data = '<meta name="viewport" content="width=device-width, initial-scale=1.0">';

		assert.areSame( -1, dataProcessor.toHtml( data ).indexOf( protectedSourceMarker ), 'META tag is protected.' );
	}
} );
