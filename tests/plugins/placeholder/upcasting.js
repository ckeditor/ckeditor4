/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: placeholder */

( function() {
	'use strict';

	bender.editors = {
		fullPage: {
			name: 'fullpage',
			config: {
				fullPage: true,
				allowedContent: true
			}
		}
	};

	bender.test( {
		'test placeholder in title': function() {
			var sourceHtml = '<!DOCTYPE html>' +
				'<html lang="en">' +
				'<head>' +
				'	<title>foo[[bar]]bom</title>' +
				'</head>' +
				'<body></body>' +
				'</html>';

			this.editorBots.fullPage.setData( sourceHtml, function() {
				var data = this.editors.fullPage.getData();
				assert.isTrue( data.indexOf( '<title>foo[[bar]]bom</title>' ) > -1, 'Title should not be modified' );
			} );
		},

		'test placeholder in textarea': function() {
			var sourceHtml = '<p><textarea cols="10" rows="10">foo[[bar]]bom</textarea></p>';

			this.editorBots.fullPage.setData( sourceHtml, function() {
				var data = this.editors.fullPage.getData();
				assert.isMatching( /<textarea [^>]+>foo\[\[bar\]\]bom<\/textarea>/, data,
					'Textarea should not be modified' );
			} );
		},

		'test placeholder in custom element': function() {
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 )
				assert.ignore();

			var sourceHtml = '<p><boo>foo[[bar]]bom</boo></p>';

			this.editorBots.fullPage.setData( sourceHtml, function() {
				var data = this.editors.fullPage.getData();
				assert.isMatching( /<p><boo>foo\[\[bar\]\]bom<\/boo><\/p>/, data, 'Custom element survived' );
				assert.areSame( 1, CKEDITOR.tools.object.keys( this.editors.fullPage.widgets.instances ).length,
					'One widget has been initialized' );
			} );
		}
	} );
} )();
