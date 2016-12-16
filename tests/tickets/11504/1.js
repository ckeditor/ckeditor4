/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: entities */

( function() {
	'use strict';

	bender.editor = {
		config: {
			fullPage: true
		}
	};

	bender.test( {
		'test encode entities when in fullPage mode': function() {
			var bot = this.editorBot,
				data = '<p>Este &eacute; &gt;um&lt; &quot;email&quot; autom&aacute;tico &alpha;.</p>';

			bot.setData( data, function() {
				assert.areSame( bender.tools.compatHtml( '<html><head><title></title></head><body>' + data + '</body></html>' ),
					bender.tools.compatHtml( bot.getData() ), 'Entities are encoded when in fullPage mode.' );
			} );
		}
	} );
} )();